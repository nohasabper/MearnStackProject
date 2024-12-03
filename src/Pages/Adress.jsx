import React, { useState, useEffect } from 'react';
import { Col, Container, Nav, Row, Form, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logout } from '../Rtk/Slices/Auth'; 
import axios from 'axios';
import Swal from 'sweetalert2'; 

export default function Address() {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth); 
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch, token]);

    // Fetch current user details after the user has been fetched
    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (user) { // Check if user is available
                setName(user.username || "");
                setAddress(user.address || "");
                setPhone(user.contact || ""); 
            }
            console.log('User from Redux:', user); // Log user from Redux
        };
        fetchCurrentUser();
    }, [user]); // Only run this effect when the user object changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form...');

        if (user && user.id) { // Change from user._id to user.id
            const updatedUser = { username: name, address, contact: phone };
            console.log('Updating user with data:', updatedUser);

            try {
                const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, updatedUser, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                Swal.fire({
                    icon: 'success',
                    title: 'تم تحديث المعلومات بنجاح',
                    text: 'تم تحديث معلوماتك الشخصية بنجاح!'
                });
            } catch (error) {
                console.error('Error updating user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'حدث خطأ',
                    text: 'فشل تحديث معلوماتك. حاول مرة أخرى لاحقًا.'
                });
            }
        } else {
            console.error('User or User ID is missing');
            console.log('User ID:', user ? user.id : 'No user available'); // Log the correct ID
        }
    };

    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        Swal.fire({
            icon: 'success',
            title: 'تم تسجيل الخروج',
            text: 'تم تسجيل الخروج بنجاح!',
        }).then(() => {
            Navigate('/login'); // Redirect to login page or homepage
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
                                    <strong>{name}</strong>
                                </div>
                            </div>
                        </div>
                        <Link className="mb-4" as={Link} to="/Account">لوحة التحكم</Link>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/Account/Orders">الطلبات</Nav.Link>
                            <Nav.Link as={Link} to="/Account/Address" style={{ color: "blue" }}>العنوان</Nav.Link>
                            <Nav.Link as={Link} to="/Account/AccountDetails">تفاصيل الحساب</Nav.Link>
                            <Nav.Link  onClick={handleLogout}>تسجيل الخروج</Nav.Link>
                        </Nav>
                    </div>
                </Col>
                <Col md={9}>
                    <div className="content">
                        <h1 className="mb-4">عنوان الفاتورة</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>الاسم</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="أدخل اسمك"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="address">
                                <Form.Label>العنوان</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="أدخل عنوانك"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>رقم الهاتف</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="أدخل رقم هاتفك"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                حفظ
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
