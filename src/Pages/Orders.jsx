import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Row, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders');
                console.log('Fetched orders:', response.data);
                setOrders(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setOrders([]);
                    setError(null);
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            if (!token) {
                throw new Error('No token found. Please log in.');
            }

            await axios.delete(`http://localhost:8080/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            });

            // Refresh orders after deletion
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="my-5">
            <Row className="g-3">
                <Col md={3}>
                    <div className="sidebar">
                        <div className="user-info mb-4">
                            <div className="d-flex align-items-center">
                                <div className="ms-2">
                                    <strong>monadewidar02</strong>
                                </div>
                            </div>
                        </div>
                        <Link className="mb-4" to="/Account">لوحة التحكم</Link>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/Account/Orders" style={{ color: "blue" }}>الطلبات</Nav.Link>
                            <Nav.Link as={Link} to="/Account/Address">العنوان</Nav.Link>
                            <Nav.Link as={Link} to="/Account/AccountDetails">تفاصيل الحساب</Nav.Link>
                            <Nav.Link href="#">تسجيل الخروج</Nav.Link>
                        </Nav>
                    </div>
                </Col>
                <Col md={9}>
                    <div className="content">
                        {loading && <p>جاري تحميل الطلبات...</p>}
                        {error && <p className="text-danger">خطأ: {error}</p>}
                        {!loading && orders.length === 0 && (
                            <p className="user-welcome">لم يتم تسجيل أي طلبات بعد!</p>
                        )}
                        <Row className="g-3">
                            {!loading && orders.map((order, index) => (
                                <Col md={4} key={order.id} className="mb-4">
                                    <Card className="h-100"> {/* Set height to 100% */}
                                        <Card.Body className="d-flex flex-column"> {/* Make Card Body a flex column */}
                                            <Card.Title>طلب رقم: {index + 1}</Card.Title>
                                            <Card.Text className="flex-grow-1"> {/* Allow the text to grow and occupy space */}
                                                <strong>منتجات:</strong>
                                                <ul>
                                                    {order.products && order.products.length > 0 ? (
                                                        order.products.map(product => (
                                                            <li key={product?.product?.id}>
                                                                {product?.product?.name ?? 'اسم غير متوفر'} × {product.quantity}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>لا توجد منتجات لهذا الطلب.</li>
                                                    )}
                                                </ul>
                                                <strong>الإجمالي:</strong> {order.totalAmount} جنيه
                                            </Card.Text>

                                            {/* Check if the order is submitted */}
                                            {order.isSubmitted ? (
                                                <>
                                                    <p className="text-success">
                                                        تم تأكيد الطلب! سيتواصل مندوب التوصيل معك قريباً.
                                                    </p>
                                                    <Button variant="secondary" disabled>
                                                        حذف الطلب (تم تأكيد الطلب)
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => {
                                                            console.log('Deleting order ID:', order.id);
                                                            handleDelete(order.id);
                                                        }}
                                                    >
                                                        حذف الطلب
                                                    </Button>
                                                    <p className="mt-2 text-muted">
                                                        يمكنك التراجع في الطلب فقط في حال لم يتم تأكيده بواسطة البائع.
                                                    </p>
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
