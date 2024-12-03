// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaEdit, FaBoxOpen, FaUsers, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import './css/Sidebar.css';
import { Container, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Rtk/Slices/Auth'; // Adjust the path based on your project structure
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Accessing user data from Redux store to conditionally render logout
    const user = useSelector((state) => state.auth.user);
    
    // Logout handler
    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        navigate('/login', { replace: true }); // Redirect to the login page
    };
    
    return (
        <>
            <Container fluid className='side'>
                <Card className="text-center my-4">
                    <Card.Header>مرحبًا بك في لوحة التحكم</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            استخدم الروابط أدناه للوصول إلى الميزات المختلفة لإدارة التطبيق الخاص بك.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <nav>
                    <h2>لوحة التحكم</h2>
                    <ul>
                        <li>
                            <NavLink to="/admin-dashboard/category" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaEdit className="icon" />
                                تعديل التصنيفات
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin-dashboard/product" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaBoxOpen className="icon" />
                                تعديل المنتجات
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin-dashboard/user" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaUsers className="icon" />
                                عرض المستخدمين
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin-dashboard/sales" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FaShoppingCart className="icon" />
                                المبيعات
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin-dashboard/OrdersAdmin" className={({ isActive }) => isActive ? 'active' : ''}>
                                <span>0</span>
                                الطلبات
                            </NavLink>
                        </li>
                        {/* Add Logout Link */}
                        <li>
                            <button onClick={handleLogout} className="logout-button">
                                <FaSignOutAlt className="icon" />
                                تسجيل الخروج
                            </button>
                        </li>
                    </ul>
                </nav>
            </Container>
        </>
    );
};

export default Sidebar;
