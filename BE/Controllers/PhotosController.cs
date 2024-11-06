using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BE.DTOs;
using BE.Models;
using BE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Utilities;

namespace BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : Controller
    {
        private readonly PhotoService _photoService;
        private readonly UserService _userService;

        public PhotosController(PhotoService photoService, UserService userService) 
        {
            _photoService = photoService;
            _userService = userService;
        }


        
        [HttpPost("photoupload")]
        [Authorize]
        public async Task<IActionResult> PhotoUpload([FromForm] IFormFile photo) 
        {
            string userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine(userIdValue);
            int userId = int.Parse(userIdValue);


            var result = await _photoService.SavePhotoAsync(photo, userId);

            if (result)
            {
                return Ok("Photo uploaded successfully");
            }

            return StatusCode(500, "Error while uploading the photo");

        }



    }
}
