"use client";

import { useEffect, useState } from 'react';
import api from './services/api';

interface User {
    id: number;
    username: string; // Make sure the property matches your User model
}

const HomePage = () => {
    const [data, setData] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/users');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Users List</h1>
            {data.length > 0 ? (
                <ul>
                    {data.map(user => (
                        <li key={user.id}>{user.username}</li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default HomePage;
