import React from 'react';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default function LoginPage() {
    const user = useSelector((s) => s.auth.user);
    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <div style={{
                width: 360, padding: 24, border: '1px solid #eee',
                borderRadius: 12
            }}>
                <h2>Welcome to ToDo</h2>
                {!user ? (
                    <a href={`${API_URL}/auth/google`} style={{
                        display: 'inline-block',
                        padding: '10px 16px', border: '1px solid #ccc', borderRadius: 8,
                        textDecoration: 'none'
                    }}>
                        Continue with Google
                    </a>
                ) : (
                    <a href="/todos">Go to app →</a>
                )}
            </div>
        </div>
    );
}
