﻿using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models
{
    public class Photo
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("user_id")]
        public int UserId { get; set; }
        public string PhotoPath { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.Now;
        public string FileExtension {  get; set; }
    }
}