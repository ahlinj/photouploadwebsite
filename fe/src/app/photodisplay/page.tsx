"use client";

import { useEffect, useState } from 'react';
import api from "../services/api";
import Cookies from 'js-cookie';

interface Photo {
  id: number;
  url: string;
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
        <div key={photo.id} style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
          <img 
            src={photo.url} 
            alt={`Photo ${photo.id}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoDisplay;