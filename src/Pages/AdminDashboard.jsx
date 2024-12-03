// src/components/AdminDashboard.js
import React from 'react';
import './Css/AdminDashboard.css';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard mt-5 mb-5">
        <div className="main-content">
            <Sidebar/>
        </div>
    </div>
    );
};

export default AdminDashboard;
