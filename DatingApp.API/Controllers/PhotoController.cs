using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("user/{userId}/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        public IDatingRepository _repo { get; }
        public IMapper _mapper { get; }
        public IOptions<CloudinarySettings> _cloudinarySettings { get; }

        public Cloudinary _cloudinary { get; }
        public PhotoController(IDatingRepository repo, IMapper mapper,
            IOptions<CloudinarySettings> cloudinarySettings)
        {
            _repo = repo;
            _mapper = mapper;
           _cloudinarySettings = cloudinarySettings;
            Account account = new Account(
               _cloudinarySettings.Value.CloudName,
               _cloudinarySettings.Value.CloudKey,
               _cloudinarySettings.Value.CloudSecret
           );
            _cloudinary = new Cloudinary(account);

        }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            if (userId != int.Parse((User.FindFirst(ClaimTypes.NameIdentifier)).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(userId);
            var file = photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500)
                        .Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.Url = uploadResult.SecureUri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if (!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;

            userFromRepo.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute(nameof(GetPhoto), new {userId,id = photo.Id,}, photoReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            
            var photoFromRepo = await _repo.GetPhoto(id);

            if(photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");
            
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if(await _repo.SaveAll())
                return NoContent();
            
            return BadRequest("Could not set Photo to main");


        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
             if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            
            var photoFromRepo = await _repo.GetPhoto(id);

            if(photoFromRepo.IsMain)
                return BadRequest("Cannot delete the main photo");
            if(photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);
                if(result.Result == "ok" || result.Result=="not found")
                {
                    _repo.Delete(photoFromRepo);

                }
            }
            if(photoFromRepo.PublicId == null)
            {
                _repo.Delete(photoFromRepo);
            }
            if(await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the photo");
        }

    }
}