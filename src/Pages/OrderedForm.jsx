import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearCart } from '../Rtk/Slices/CartSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Css/OrderedForm.css';

export default function OrderedForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '', // Add email field to formData
    notes: '',
    paymentMethod: 'cashOnDelivery',
  });
  const [loading, setLoading] = useState(false);  // Loading state for the button
  const [error, setError] = useState(null);  // Error handling state

  const cartItems = useSelector(state => state.cart.cartItems); // Get cart items from Redux
  const total = useSelector(state => state.cart.total); // Total price of items
  const shipping = 40; // Assuming constant shipping value for now
  const totalWithShipping = total < 350 ? total + shipping : total;
  const user = useSelector(state => state.auth.user); // Get user data from Redux

  // Pre-fill form data with user info
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.username || '',
        address: user.address || '',
        phone: user.contact || '',
        email: user.email || '', // Pre-fill email if available
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    try {
      const response = await axios.post('http://localhost:8080/api/orders', {
        user: user ? user.id : null, // Use user ID from Redux state
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email, // Include email in the request
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        products: cartItems.map(item => ({
          product: item.id,
          name: item.name, 
          quantity: item.quantity
        })),
        totalAmount: totalWithShipping,
        shipping: 40,
      });

      console.log('Order created successfully:', response.data);
      dispatch(clearCart());
      Swal.fire({
        icon: 'success',
        title: 'Order Confirmed!',
        text: 'Your order has been successfully placed.',
        confirmButtonText: 'OK',
      }).then(() => {
        // Navigate to the order page after SweetAlert confirmation
        navigate('/account/orders');  // Replace '/order' with the actual order page route
      });

    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.response?.data?.error || 'An error occurred'); // Capture specific error message
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };


  return (
    <Container className="my-5">
      <Row>
        <Col md={8}>
          <div className="form-section">
            <h4>الفاتورة والشحن</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>الاسم *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>العنوان بالتفصيل</Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>رقم الهاتف *</Form.Label>
                <Form.Control
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>البريد الإلكتروني *</Form.Label>
                <Form.Control
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  title="يرجى إدخال بريد إلكتروني صحيح"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="notes">
                <Form.Label>ملاحظات حول الطلب (اختياري)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Check
                type="radio"
                id="cashOnDelivery"
                label="الدفع نقدًا عند الاستلام"
                name="paymentMethod"
                value="cashOnDelivery"
                checked={formData.paymentMethod === 'cashOnDelivery'}
                onChange={handleChange}
                className="my-3"
              />

              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'جاري تأكيد الطلب...' : 'اتمام الطلب'}
              </Button>
              {error && <p className="text-danger mt-3">{error}</p>}
            </Form>
          </div>
        </Col>

        <Col md={4}>
          <div className="form-section">
            <h4>طلبك</h4>
            {cartItems.map((item) => (
              <div key={item.id} className="bottom-space">
                <p>{item.name} × {item.quantity}</p>
                <p className="total-font-bold">{item.price * item.quantity} جنيه</p>
              </div>
            ))}
            <div className="bottom-space">
              <p>المجموع بدون الشحن</p>
              <p className="total-font-bold">{total} جنيه</p>
            </div>

            <div className="bottom-space">
              <p>الشحن</p>
              <p>40.00 جنيه</p>
            </div>

            <div className="bottom-space">
              <p>الإجمالي مع الشحن</p>
              <p className="total-font-bold">{totalWithShipping} جنيه</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
