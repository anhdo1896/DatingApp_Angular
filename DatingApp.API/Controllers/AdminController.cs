using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        public IOptions<CloudinarySettings> _cloudinarySettings { get; }

        public Cloudinary _cloudinary { get; }
        public AdminController(DataContext context, UserManager<User> userManager,
        IOptions<CloudinarySettings> cloudinarySettings)
        {
            _userManager = userManager;
            _context = context;
            _cloudinarySettings = cloudinarySettings;
            Account account = new Account(
               _cloudinarySettings.Value.CloudName,
               _cloudinarySettings.Value.CloudKey,
               _cloudinarySettings.Value.CloudSecret
           );
            _cloudinary = new Cloudinary(account);

        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await _context.Users
                          .OrderBy(x => x.UserName)
                          .Select(user => new
                          {
                              Id = user.Id,
                              UserName = user.UserName,
                              Roles = (from userRole in user.UserRoles
                                       join role in _context.Roles
                                       on userRole.RoleId
                                       equals role.Id
                                       select role.Name
                                      ).ToList()
                          }).ToListAsync();

            return Ok(userList);
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{username}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);

            var selectedRoles = roleEditDto.RoleNames;

            //selectedRoles = selectedRoles != null ? selectedRoles : new string[]{}
            selectedRoles = selectedRoles ?? new string[] { };

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
            {
                return BadRequest("Add to roles fail");
            }

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
            {
                return BadRequest("Remove to roles fail");

            }

            return Ok(await _userManager.GetRolesAsync(user));

        }
        [Authorize(Policy = "ModeratorPhotoRole")]
        [HttpGet("photosForModeration")]
        public async Task<IActionResult> GetPhotosForModeration()
        {
            var photo = await _context.Photos
                .Include(u => u.User)
                .IgnoreQueryFilters()
                .Where(p => p.IsApproved == false)
                .Select(u => new
                {
                    Id = u.Id,
                    UserName = u.User.UserName,
                    Url = u.Url,
                    IsApproved = u.IsApproved
                }).ToListAsync();

            return Ok(photo);
        }

        [Authorize(Policy = "ModeratorPhotoRole")]
        [HttpPost("approvePhoto/{photoId}")]
        public async Task<IActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _context.Photos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == photoId);
            
            photo.IsApproved = true;

            await _context.SaveChangesAsync();

            return Ok();

        }
        
        [Authorize(Policy = "ModeratorPhotoRole")]
        [HttpPost("rejectPhoto/{photoId}")]
        public async Task<IActionResult> RejectPhoto(int photoId)
        {
            var photo = await _context.Photos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == photoId);
            if(photo.IsMain)
                return BadRequest("You cannot reject the main photo");

      
            if(photo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);
                if(result.Result == "ok" || result.Result=="not found")
                {
                    _context.Photos.Remove(photo);

                }
            }
            if(photo.PublicId == null)
            {
                 _context.Photos.Remove(photo);
            }

            await _context.SaveChangesAsync();

            return Ok();

        }
    }
}