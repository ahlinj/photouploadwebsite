﻿namespace BE.DTOs
{
    public class UserRegistrationDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Admin {  get; set; } 
    }
}
