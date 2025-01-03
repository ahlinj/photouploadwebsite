"use client";

import { SetStateAction, useEffect, useState } from 'react';
import api from "../services/api";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

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
  const [displayedFolder, setDisplayedFolder] = useState('root'); 
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const handleChangeFolder = async(path:string) => {
    try{
      const token = Cookies.get('token');
      const response = await api.put('api/Photos/changePhotoFolder',{selectedFolder,path},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <div>
      {/* Display Folders */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {folders
          .filter((folder) => folder !== displayedFolder)
          .map((folder, index) => (
            <div
              key={index}
              onDoubleClick={() => setDisplayedFolder(folder)}
              style={{
                width: "200px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon
                icon={faFolder}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
                <p>
                  <strong>Folder: </strong>
                  {folder}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Display Photos */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {photos
          .filter(
            (photo) =>
              (photo.photoPath
                .replace(new RegExp(`/mtn/hdd/photos/${photo.userId}`), "")
                .replace(/\/[^/]+$/, "") || '/root') === '/'.concat(displayedFolder)
          )
          .map((photo) => (
            <div
              key={photo.id}
              style={{
                width: "200px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={photo.url}
                alt={`Photo ${photo.id}`}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onDoubleClick={() => setSelectedPhoto(photo.url)}
              />
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
                <p>
                  <strong>Image name:</strong>
                  {photo.photoPath.split("/").pop()?.split(".")[0]}
                </p>
                <p>
                  <strong>Folder:</strong>
                  {photo.photoPath
                    .replace(new RegExp(`/mtn/hdd/photos/${photo.userId}/`), "")
                    .replace(/\/[^/]+$/, "") || "/"}
                </p>
                <p>
                  <strong>Upload Date:</strong>{" "}
                  {new Date(photo.uploadDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>File Extension:</strong> {photo.fileExtension}
                </p>
                <p>
                  <select
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    value={selectedFolder}
                  >
                    {folders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleChangeFolder(photo.photoPath)}>
                    Change folder
                  </button>
                </p>
                <p>
                  <button onClick={() => handleDelete(photo.photoPath)}>
                    Delete photo
                  </button>
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Modal for Full-Size Image */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={selectedPhoto}
            alt="Full Size"
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
            }}
          />
        </div>
      )}
    </div>
  );
};


export default PhotoDisplay;