using Microsoft.AspNetCore.Mvc;
using BE.Services;
using BE.DTOs;
using BE.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;


namespace BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDto registerDto)
        {
            var newUser = await _userService.AddUser(registerDto);
            string storageDirectory = Environment.GetEnvironmentVariable("PHOTO_STORAGE_PATH");
            string userDirectory = Path.Combine(storageDirectory, newUser.Id.ToString());
            Directory.CreateDirectory(userDirectory);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsers();
            if (users == null || users.Count == 0)
            {
                return NotFound("No users found.");
            }

            return Ok(users);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var user = await _userService.GetUserByUsernameAsync(loginDto.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        [HttpPost("adminlogin")]
        public async Task<IActionResult> AdminLogin([FromBody] UserLoginDto loginDto)
        {
            var user = await _userService.GetUserByUsernameAsync(loginDto.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            if (!user.Admin) 
            {
                return Forbid();
            }

            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }



        private string GenerateJwtToken(User user)
        {
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
            var jwtExpiresInMinutes = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_MINUTES"));

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", user.Id.ToString()),
            new Claim ("username", user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(jwtExpiresInMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
