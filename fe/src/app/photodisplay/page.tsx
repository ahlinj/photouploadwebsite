"use client";

import { useEffect, useState } from 'react';
import api from "../services/api";
import Cookies from 'js-cookie';

interface Photo {
  id: number;
  userId: number;
  url: string;
  uploadDate: string;
  fileExtension: string;
  photoPath: string;
}

const PhotoDisplay = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [folders, setFolders] = useState(['root']);
  const [selectedFolder, setSelectedFolder] = useState('root'); 

  useEffect(() => {
    fetchPhotos();
  }, []);

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

  const handleDelete = async (path:string) => {
    const token = Cookies.get('token');
    try{
      const response = await api.delete(`api/Photos/deletePhoto?path=${encodeURIComponent(path)}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      fetchPhotos();
    }catch(error){
      console.log(error);
    }
  }

  const handleChangeFolder = async() => {
    try{
      const token = Cookies.get('token');
      const response = await api.put('api/Photos/changePhotoFolder',{selectedFolder},{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPhotos();
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchFolders = async () => {
        try {
            const token = Cookies.get('token');
            const response = await api.get('/api/Photos/getUserFolders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFolders(response.data);
        } catch (error) {
            console.error("Error fetching folders", error);
        }
    };
    fetchFolders();
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
            <p><strong>Image name:</strong>{photo.photoPath.split('/').pop()?.split('.')[0]}</p>
            <p><strong>Folder:</strong>{photo.photoPath.replace(new RegExp(`/mtn/hdd/photos/${photo.userId}`),'').replace(/\/[^/]+$/, '') || '/'}</p>
            <p><strong>Upload Date:</strong> {new Date(photo.uploadDate).toLocaleDateString()}</p>
            <p><strong>File Extension:</strong> {photo.fileExtension}</p>
            <p><button onClick={() => handleDelete(photo.photoPath)}>Delete photo</button></p>
            <p>
              <select onChange={(e) => setSelectedFolder(e.target.value)} value={selectedFolder}>
                {folders.map((folder) => (
                    <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
              <button onClick={() => handleChangeFolder()}>Change folder</button>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoDisplay;