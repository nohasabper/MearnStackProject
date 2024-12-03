// Account.js
import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import './Css/Account.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Rtk/Slices/Auth'; 
export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login', { replace: true }); 
  };

  return (
    <Container className="my-5">
      <Row className="g-4">
        <Col md={3}>
          <div className="sidebar">
            <div className="user-info mb-4">
              <div className="d-flex align-items-center">
                <div className="ms-2">
                  {/* Dynamically display the username */}
                  <strong>{user?.username || 'User'}</strong>
                </div>
              </div>
            </div>
            <h5 className="mb-4">لوحة التحكم</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/account/orders">الطلبات</Nav.Link>
              <Nav.Link as={Link} to="/account/address">العنوان</Nav.Link>
              <Nav.Link as={Link} to="/account/AccountDetails">تفاصيل الحساب</Nav.Link>
              {/* Implement logout functionality */}
              <Nav.Link onClick={handleLogout}>تسجيل الخروج</Nav.Link>
            </Nav>
          </div>
        </Col>
        <Col md={9}>
          <div className="content">
            <p className="user-welcome">
              مرحبًا {user?.username || 'User'} (لست {user?.username || 'User'}؟{' '}
              {/* Implement logout functionality */}
              <Nav.Link onClick={handleLogout} className="d-inline">تسجيل الخروج</Nav.Link>)
            </p>
            <p>
              من خلال لوحة تحكم الحساب الخاص بك، يمكنك استعراض{' '}
              <Nav.Link  as={Link} to="/account/orders" className="d-inline">أحدث الطلبات</Nav.Link>، إدارة{' '}
              <Nav.Link as={Link} to="/account/address" className="d-inline">عناوين الشحن والفواتير</Nav.Link> الخاصة بك، بالإضافة إلى{' '}
              <Nav.Link as={Link} to="/account/AccountDetails" className="d-inline">تعديل كلمة المرور وتفاصيل حسابك</Nav.Link>.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
