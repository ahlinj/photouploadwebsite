"use client";

import { useState } from "react";
import Cookies from 'js-cookie';
import api from "../services/api";
import { useRouter } from "next/router";

const PhotoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
  
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
      }
    };
  
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    };
  
    const handleDragLeave = () => {
      setIsDragOver(false);
    };
  
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        setSelectedFile(event.dataTransfer.files[0]);
      }
    };

    
  
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        if (selectedFile) {
            console.log('Submitting file:', selectedFile.name);
            formData.append('photo', selectedFile);
          
            const token = Cookies.get('token');
            console.log(token);
            try {
              const response = await api.post('/api/Photos/photoupload', formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data'
                }
              });
              console.log('File uploaded successfully', response);
            } catch (error) {
              console.error('Error uploading file', error);
            }
          } else {
            console.error('No file selected');
          }
    };

    const handleRedirect = () => {
      useRouter().push('/photodisplay/'); 
    };
  
    return (
      <div>
        <h2>Upload a File</h2>
  
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                border: isDragOver ? '2px dashed #0070f3' : '2px dashed #cccccc',
                padding: '20px',
                textAlign: 'center',
                borderRadius: '10px',
                backgroundColor: isDragOver ? '#f0f8ff' : '#f9f9f9',
                position: 'relative', 
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
        >
            {selectedFile ? (
                <p>Selected file: {selectedFile.name}</p>
            ) : (
                <p>Drag and drop a file here, or click to select a file</p>
            )}
            <input
                type="file"
                id="fileInput"
                onChange={handleFileSelect}
                style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    cursor: 'pointer',
                }}
            />
        </div>
        
        <button onClick={handleSubmit} disabled={!selectedFile} style={{ marginTop: '20px' }}>
          Upload File
        </button>
        <button onClick={handleRedirect} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Go to New Page
        </button>
      </div>
    );
  };

export default PhotoUpload;
