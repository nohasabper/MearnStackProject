import React, { useState, useEffect } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of Navigate
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logout } from '../Rtk/Slices/Auth'; // Assuming you have this slice for fetching user details
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert

export default function AccountDetails() {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth); // Fetch user and token from Redux
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook

    // Fetch user details from Redux 
    useEffect(() => {
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch, token]);

    // Populate user info once it's fetched
    useEffect(() => {
        if (user) {
            setFullName(user.username || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (user && user.id) { // Ensure user is available before sending request
            try {
                const response = await axios.put(
                    `http://localhost:8080/api/users/${user.id}/password`,
                    {
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Add token from Redux
                        },
                    }
                );

                // Success Alert
                Swal.fire({
                    icon: 'success',
                    title: 'تم تحديث كلمة المرور',
                    text: 'تم تحديث كلمة المرور الخاصة بك بنجاح!',
                });
            } catch (error) {
                console.error('Error updating password:', error);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    Swal.fire({
                        icon: 'error',
                        title: 'فشل في تحديث كلمة المرور',
                        text: error.response.data.message || 'حدث خطأ أثناء محاولة تحديث كلمة المرور. حاول مرة أخرى.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'فشل في تحديث كلمة المرور',
                        text: 'حدث خطأ أثناء محاولة تحديث كلمة المرور. حاول مرة أخرى.',
                    });
                }
            }
        } else {
            console.error('User or User ID is missing');
        }
    };

    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        Swal.fire({
            icon: 'success',
            title: 'تم تسجيل الخروج',
            text: 'تم تسجيل الخروج بنجاح!',
        }).then(() => {
            navigate('/login'); // Use navigate to redirect after the alert is closed
        });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="my-5">
            <Row className="g-4">
                <Col md={3}>
                    <div className="sidebar">
                        <div className="user-info mb-4">
                            <div className="d-flex align-items-center">
                                <div className="ms-2">
                                    <strong>{user.username}</strong> {/* Display fetched username */}
                                </div>
                            </div>
                        </div>
                        <Link className="mb-4" as={Link} to="/Account">لوحة التحكم</Link>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/Account/Orders">الطلبات</Nav.Link>
                            <Nav.Link as={Link} to="/Account/Address">العنوان</Nav.Link>
                            <Nav.Link as={Link} to="/Account/AccountDetails" style={{ color: "blue" }}>تفاصيل الحساب</Nav.Link>
                            <Nav.Link onClick={handleLogout}>تسجيل الخروج</Nav.Link>
                        </Nav>
                    </div>
                </Col>
                <Col md={9}>
                    <div className="content">
                        <h2>تفاصيل الحساب</h2>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">الاسم الكامل <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)} // Update name input
                                    disabled // Disable the full name input field
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">البريد الإلكتروني <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Update email input
                                    disabled // Disable the email input field
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="oldPassword" className="form-label">كلمة المرور القديمة<span className="text-danger">*</span></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)} // Update old password input
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">كلمة المرور الجديدة<span className="text-danger">*</span></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)} // Update new password input
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">تحديث الحساب</button>
                        </form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
