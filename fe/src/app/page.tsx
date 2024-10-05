"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Home Page</h1>
      
      <div style={{ marginTop: '20px' }}>
        <Link href="/adminlogin">
          <button style={{ marginRight: '20px', padding: '10px 20px', fontSize: '16px' }}>
            Admin Login
          </button>
        </Link>
        
        <Link href="/login">
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>
            Normal Login
          </button>
        </Link>
      </div>
    </div>
  );
}