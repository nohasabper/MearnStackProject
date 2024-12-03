import React, { useState, useEffect } from 'react';
import './Css/HomePage.css'; // Ensure the path is correct
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SocksCard from '../components/SocksCard';
import axios from 'axios';

const HomePage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

  const socks = [
    { id: 1, title: 'شرابات انكل حريمي', imgSrc: '/images/Ankel.jpeg', price: 50, to: "/category/3" },
    { id: 2, title: 'شرابات طويلة رجالي', imgSrc: '/images/Men.jpeg', price: 60, to: "/category/1" },
    { id: 3, title: 'شرابات اطفالي', imgSrc: '/images/children.jpeg', price: 30, to: "/category/10" },
    { id: 4, title: 'شرابات طويلة حريمي', imgSrc: '/images/tallwomen.jpeg', price: 55, to: "/category/4" },
    { id: 5, title: 'العروض', imgSrc: '/images/offers.jpeg', price: 40, to: "/Offers" },
  ];

  const [products, setProducts] = useState([]);
  const [wproducts, setwProducts] = useState([]);
  const [error, setError] = useState(null);
  const [werror, setwError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [response1, response3] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/category/1`),
          axios.get(`${API_BASE_URL}/products/category/3`)
        ]);
        setProducts(response1.data);
        setwProducts(response3.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
        setwError('Failed to load women\'s products.');
      }
    };

    fetchProducts();
  }, [API_BASE_URL]);

  return (
    <section className="home-page">
      <div className="container-fluid">
        <Row>
          <Col lg={6} md={12} className="image-container">
            <img src='/images/SosksRight.jpeg' alt="عرض الشرابات اليمنى" className="img-fluid animated-image-left" />
          </Col>
          <Col lg={6} md={12} className="image-container">
            <img src='/images/SocksLeft.jpeg' alt="عرض الشرابات اليسرى" className="img-fluid animated-image-right" />
          </Col>
          <div className="centered-box">
            <p>جواربنا المميزة مصنوعة من مواد عالية الجودة توفر أقصى درجات الراحة والمتانة.</p>
            <div className="Links">
              <Link className="btn-custom" to="/category/3">شراب حريمي</Link>
              <Link className="btn-custom" to="/category/1">شراب رجالي</Link>
            </div>
          </div>
        </Row>
      </div>

      <Container className="mt-5">
        <Row>
          {socks.map((item) => (
            <Col md={3} key={item.id} className="mb-4 text-center">
              <div className="circle-image">
                <img src={item.imgSrc} alt={item.title} />
              </div>
              <h5>{item.title}</h5>
              <Link to={item.to} className='More'>
                المزيد↖
              </Link>
            </Col>
          ))}
        </Row>
      </Container>


      <Container fluid className='mt-3'>
        <h1 className='head'>
          <span className='highlight'>رجالي !!</span>
          <Link className='more-btn' to="/category/2">
            عرض المزيد
          </Link>
        </h1>
        {error && <p className="error-message">{error}</p>}
        <Row id="product-list">
          {products.map((sock) => (
            <SocksCard
              key={sock._id}
              id={sock._id}
              image={sock.image}
              name={sock.name}
              deletedPrice={sock.deletedPrice}
              currentPrice={sock.price}
            />
          ))}
        </Row>
      </Container>

      <Container fluid className='mt-3'>
        <h1 className='head'>
          <span className='highlight'>حريمي!!</span>
          <Link className='more-btn' to="/category/3">
            عرض المزيد
          </Link>
        </h1>
        {werror && <p className="error-message">{werror}</p>}
        <Row id="product-list">
          {wproducts.map((sock) => (
            <SocksCard
              key={sock._id}
              id={sock._id}
              image={sock.image}
              name={sock.name}
              deletedPrice={sock.deletedPrice}
              currentPrice={sock.price}
            />
          ))}
        </Row>

      </Container>
    </section>
  );
};

export default HomePage;
