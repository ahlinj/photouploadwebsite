"use client";

import { useEffect, useState } from 'react';
import api from "../services/api";
import Cookies from 'js-cookie';

interface Photo {
  id: number;
  url: string;
  uploadDate: string;
  fileExtension: string;
}

const PhotoDisplay = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const token = Cookies.get('token');
      try {
        const response = await api.get('/api/Photos/photodisplay',{
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {photos.map(photo => (
        <div 
          key={photo.id} 
          style={{ 
            width: '200px', 
            border: '1px solid #ddd', 
            borderRadius: '5px', 
            padding: '10px', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
          }}
        >
          <img 
            src={photo.url} 
            alt={`Photo ${photo.id}`} 
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} 
          />
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
            <p><strong>Upload Date:</strong> {new Date(photo.uploadDate).toLocaleDateString()}</p>
            <p><strong>File Extension:</strong> {photo.fileExtension}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoDisplay;