import { useEffect, useState } from 'react';
import axios from 'axios';

interface Photo {
  id: number;
  url: string;
}

const PhotoDisplay = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('/api/photos');
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