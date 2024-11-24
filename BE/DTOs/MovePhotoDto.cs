namespace BE.DTOs
{
    using System.Text.Json.Serialization;
    public class MovePhotoDto
    {
        [JsonPropertyName("selectedFolder")]
        public string NewFolderName { get; set; }

        [JsonPropertyName("path")]
        public string PhotoPath { get; set; }

    }
}
