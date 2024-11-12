"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Welcome = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');

    interface MyJwtPayload {
        username: string;
      }

    useEffect(() => {
        const token = Cookies.get('token');
    
        if (token) {
          try {
            const decoded = jwtDecode<MyJwtPayload>(token);
            setUsername(decoded.username || 'usernme');
          } catch (error) {
            console.error('Failed to decode token:', error);
          }
        }
      }, []);


    return(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1>Welcome, {username}!</h1>
            
            <div style={{ marginTop: '20px' }}>
                <button 
                onClick={() => router.push('/photoupload')}
                style={{ padding: '10px 20px', margin: '10px', cursor: 'pointer', fontSize: '16px' }}
                >
                Go to Photo Upload
                </button>

                <button 
                onClick={() => router.push('/photodisplay')}
                style={{ padding: '10px 20px', margin: '10px', cursor: 'pointer', fontSize: '16px' }}
                >
                Go to Photo Display
                </button>
            </div>
        </div>
    );
};

export default Welcome