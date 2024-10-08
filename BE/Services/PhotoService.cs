using BE.Data;
using BE.Models;

namespace BE.Services
{
    public class PhotoService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public PhotoService(ApplicationDbContext dbContext, IWebHostEnvironment environment)
        {
            _context = dbContext;
            _environment = environment;
        }

        public async Task<bool> SavePhotoAsync(IFormFile photoFile, int userId)
        {
            if (photoFile == null || photoFile.Length == 0)
                return false;

            string fileExtension = Path.GetExtension(photoFile.FileName);
            string fileName = $"{userId}{fileExtension}";
            string storageDirectory = Environment.GetEnvironmentVariable("PHOTO_STORAGE_PATH");
            string storagePath = Path.Combine(storageDirectory, fileName);
            System.Diagnostics.Debug.WriteLine("SPATH: "+storagePath);

            // Save the file to the directory
            using (var stream = new FileStream(storagePath, FileMode.Create))
            {
                await photoFile.CopyToAsync(stream);
            }

            Photo photo = new Photo
            {
                UserId = userId,
                PhotoPath = storagePath,
                FileExtension = fileExtension.TrimStart('.')
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();


            return true;
        }

    }

    
}
