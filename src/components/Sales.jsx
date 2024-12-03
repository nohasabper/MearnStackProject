import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/sales.css'; // Adjust styles in this file

const Sales = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/orderSubmited', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                console.log('Fetched orders:', response.data);
                const submittedSales = response.data; 
                setSales(submittedSales);
            } catch (err) {
                console.error('Error fetching sales:', err.response ? err.response.data : err.message);
            }
        };

        fetchSales();
    }, []);

    const totalRevenue = sales.reduce((total, sale) => total + (sale.totalAmount || 0), 0);
    const totalSales = sales.length;

    return (
        <div className="sales-container" style={{ textAlign: 'center' }}>
            <h1 className='head'>نظرة عامة على المبيعات</h1>
            <div className="summary" style={{ marginBottom: '20px' }}>
                <h2>إجمالي الإيرادات: ج.م{totalRevenue.toFixed(2)}</h2>
                <h3>إجمالي المبيعات: {totalSales}</h3>
            </div>

            <div className="sales-cards">
                {sales.length > 0 ? (
                    sales.map((sale, index) => (
                        <div className="sale-card" key={sale._id}>
                            <div className="card-header" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <h3>الطلب رقم {index + 1}</h3> 
                                <p><strong>إجمالي المبلغ:</strong> ج.م{sale.totalAmount || 0}</p>
                            </div>
                            <div className="card-body" style={{ padding: '15px' }}>
                                <p className='pp'><strong>العميل:</strong> {sale.name || 'غير متوفر'}</p>
                                <p className='pp'><strong>البريد الإلكتروني:</strong> {sale.email || 'غير متوفر'}</p>
                                <p className='pp'><strong>الهاتف:</strong> {sale.phone || 'غير متوفر'}</p>
                                <p className='pp'><strong>عنوان الشحن:</strong> {sale.address || 'غير متوفر'}</p>
                                <p className='pp'><strong>تاريخ الطلب:</strong> {new Date(sale.orderDate).toLocaleString('ar-EG')}</p>
                                <p className='pp'><strong>طريقة الدفع:</strong> {sale.paymentMethod || 'غير متوفر'}</p>
                                <p className='pp'><strong>رسوم الشحن:</strong> {sale.shipping || 'غير متوفر'}</p>
                                <p className='pp'><strong>المنتجات:</strong> {sale.products && sale.products.length > 0 
                                    ? sale.products.map(p => `${p.productName} (الكمية: ${p.quantity})`).join(', ') 
                                    : 'لا توجد منتجات متاحة'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>لا توجد طلبات مقدمة متاحة.</p>
                )}
            </div>
        </div>
    );
};

export default Sales;
