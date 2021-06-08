using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static async Task SeedUser(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);
            if (users == null) return;
            var roles = new List<Role>
            {
                new Role{ Name = "Member" },
                new Role{ Name = "Admin" },
                new Role{ Name = "Moderator" },
                new Role{ Name = "VIP" },
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                // byte[] passwordhash, passwordsalt;
                // CreatePasswordHash("password",out passwordhash, out passwordsalt);

                // user.PasswordHash = passwordhash;
                // user.PasswordSalt = passwordsalt;
                // user.UserName = user.UserName.ToLower();
                // userManager.Users.Add(user);
                user.Photos.SingleOrDefault().IsApproved = true;
                await userManager.CreateAsync(user, "password");
                await userManager.AddToRoleAsync(user, "Member");
            }
            // userManager.SaveChanges();
            // create admin user
            var adminUser = new User
            {
                UserName = "Admin"
            };
            await userManager.CreateAsync(adminUser, "Pa$$w0rd");
            await userManager.AddToRolesAsync(adminUser, new[] { "Admin", "Moderator" });

        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}