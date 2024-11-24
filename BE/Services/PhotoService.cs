using BE.Data;
using BE.DTOs;
using BE.Models;
using Microsoft.EntityFrameworkCore;

namespace BE.Services
{
    public class PhotoService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly string _photoStoragePath;

        public PhotoService(ApplicationDbContext dbContext, IWebHostEnvironment environment) 
        {
            _context = dbContext;
            _environment = environment;
            _photoStoragePath = Environment.GetEnvironmentVariable("PHOTO_STORAGE_PATH");
        }

        public async Task<bool> SavePhotoAsync(IFormFile photoFile, int userId, string folder)
        {
            if (photoFile == null || photoFile.Length == 0)
                return false;

            string fileExtension = Path.GetExtension(photoFile.FileName);
            string fileName = Path.GetFileName(photoFile.FileName);
            string userDirectory = Path.Combine(_photoStoragePath, userId.ToString());
            if(!folder.Equals("root")) 
            {
                userDirectory = Path.Combine(userDirectory, folder);
            }
            string storagePath = Path.Combine(userDirectory, fileName);
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

        public async Task<List<Photo>> GetAllPhotos()
        {
            return await _context.Photos.ToListAsync();
        }

        public async Task<List<Photo>> GetUserPhotos(int userId)
        {
            return await _context.Photos
                .Where(photo => photo.UserId == userId)
                .ToListAsync();
        }

        public List<string> GetUserFolders(int userId)
        {
            var userDirectory = Path.Combine(_photoStoragePath, userId.ToString());
            var folders = new List<string> { "root" };
            folders.AddRange(  Directory.GetDirectories(userDirectory)
                                        .Select(Path.GetFileName));
            return folders;
        }

        public async Task<bool> DeletePhotoByName(string path)
        {
            try
            {
                File.Delete(path);
                var photo = await _context.Photos.FirstOrDefaultAsync(p => p.PhotoPath == path);
                if (photo != null)
                {
                    _context.Photos.Remove(photo);
                    await _context.SaveChangesAsync();
                }

                return true;
            } catch 
            {
                return false;
            }
        }

        public async Task<bool> MovePhotoToFolder(MovePhotoDto moveFolderDto, string userId)
        {
            try
            {
                string photoName = Path.GetFileName(moveFolderDto.PhotoPath);
                string destFilePath = Path.Combine(_photoStoragePath, userId, moveFolderDto.NewFolderName, photoName);
                File.Move(moveFolderDto.PhotoPath, destFilePath);

                var photo = await _context.Photos.FirstOrDefaultAsync(p => p.PhotoPath == moveFolderDto.PhotoPath);
                if (photo != null)
                {
                    photo.PhotoPath = destFilePath;
                    _context.Photos.Update(photo);
                    await _context.SaveChangesAsync();
                }
                return true;

            }catch
            {
                return false;
            }
        }

    }

    
}
