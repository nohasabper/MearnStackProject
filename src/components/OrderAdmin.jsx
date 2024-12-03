import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import './css/OrderAdmin.css';

const OrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/ordersall', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const ordersData = response.data;
                console.log("Fetched orders data:", ordersData); // Check for _id field in each order
                setOrders(ordersData);
            } catch (err) {
                setError(err.response ? err.response.data.error : 'Failed to fetch orders');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);
    
    const confirmOrder = async (orderId) => {
        console.log("Order ID to confirm:", orderId);  // This should print the correct _id

        if (!orderId) {
            console.error('Order ID is undefined');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/orders/${orderId}`, { isSubmitted: true }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            Swal.fire({
                title: 'تم تأكيد الطلب!',
                text: 'تم إرسال الطلب إلى قسم المبيعات.',
                icon: 'success',
                confirmButtonText: 'حسناً'
            });

            // Remove the submitted order from the state
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (err) {
            Swal.fire({
                title: 'خطأ',
                text: 'حدث خطأ أثناء تأكيد الطلب.',
                icon: 'error',
                confirmButtonText: 'حسناً'
            });
        }
    };

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <div className="order-container">
            <h1>الطلبات</h1>
            <div className="order-rows">
                {orders.length === 0 ? (
                    <p>لا توجد طلبات لعرضها.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <h2>رقم الطلب: {order._id}</h2>
                                <p className="order-status">
                                    الحالة: {order.isSubmitted ? 'تم تأكيده' : 'غير مؤكد'}
                                </p>
                            </div>
                            <div className="order-details">
                                <p className='pp'><strong>اسم المستخدم:</strong> {order.name}</p>
                                <p className='pp'><strong>البريد الالكتروني:</strong> {order.email}</p>
                                <p className='pp'><strong>العنوان:</strong> {order.address}</p>
                                <p className='pp'><strong>رقم الهاتف:</strong> {order.phone}</p>
                                <p className='pp'><strong>ملاحظات:</strong> {order.notes || 'لا يوجد'}</p>
                                <p className='pp'><strong>طريقة الدفع:</strong> {order.paymentMethod}</p>
                                <p className='pp'><strong>إجمالي السعر:</strong> {order.totalAmount} ر.س</p>
                                <p className='pp'><strong>شحن:</strong> {order.shipping} ر.س</p>
                                <p className='pp'><strong>تاريخ الطلب:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                            </div>
                            <div className="order-products">
                                <h3>المنتجات:</h3>
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product.productName}>
                                            {product.productName} - الكمية: {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-actions">
                                {!order.isSubmitted && (
                                    <button
                                        className="confirm-button"
                                        onClick={() => confirmOrder(order._id)} // Use _id for confirmation
                                    >
                                        تأكيد الطلب
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderAdmin;
