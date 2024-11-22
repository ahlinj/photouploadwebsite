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
            int userId = int.Parse(User.FindFirst("userId")?.Value);

            var result = await _photoService.SavePhotoAsync(photo, userId);

            if (result)
            {
                return Ok("Photo uploaded successfully");
            }

            return StatusCode(500, "Error while uploading the photo");

        }

        [HttpGet("photodisplay")]
        [Authorize]
        public async Task<IActionResult> PhotoDisplay()
        {
            int userId = int.Parse(User.FindFirst("userId")?.Value);

            var photos = await _photoService.GetUserPhotos(userId);
            if (photos == null)
            {
                return NotFound("No photos found.");
            }

            return Ok(photos);
        }

        [HttpPost("addfolder")]
        [Authorize]
        public async Task<IActionResult> AddFolder([FromBody] FolderDto folderDto)
        {
            if (string.IsNullOrWhiteSpace(folderDto.FolderName))
            {
                return BadRequest(new { message = "Folder name cannot be empty." });
            }

            try
            {
                string userId = User.FindFirst("userId")?.Value;
                string userDirectory = Path.Combine(Environment.GetEnvironmentVariable("PHOTO_STORAGE_PATH"), userId);
                string folderPath = Path.Combine(userDirectory, folderDto.FolderName);

                if (Directory.Exists(folderPath))
                {
                    return BadRequest(new { message = "Folder already exists." });
                }
                else
                {
                    Directory.CreateDirectory(folderPath);
                    return Ok(new { message = "Folder created successfully." });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the folder.", error = ex.Message });
            }
        }

        [HttpGet("getUserFolders")]
        [Authorize]
        public async Task<IActionResult> GetUserFolders() 
        {
            try
            {
                int userId = int.Parse(User.FindFirst("userId")?.Value);
                var folders = _photoService.GetUserFolders(userId) ?? ["root"];
                return Ok(folders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving folders" , error = ex.Message });
            }
        }



    }
}
