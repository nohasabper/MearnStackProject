// src/components/Users.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button } from 'reactstrap'; // Using Reactstrap for UI components

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">بيانات مستخدمي الموقع</h1>
            <Input
                type="text"
                placeholder="ابحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />
            <Table striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>الاسم</th>
                        <th>العنوان</th>
                        <th>رقم الهاتف</th>
                        <th>الايميل</th>
                        <th>تاريخ التسجيل</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.username}</td>
                            <td>{user.address || 'N/A'}</td>
                            <td>{user.contact || 'N/A'}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Users;
