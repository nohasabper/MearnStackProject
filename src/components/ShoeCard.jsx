import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { CiHeart } from "react-icons/ci";
import './css/Card.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../Rtk/Slices/favSlice';

export default function ShoeCard({ id, image, name, deletedPrice , currentPrice}) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.favoriteItems);

  const isFavorite = favorites.some(item => item.id === id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(id));
    } else {
      dispatch(addFavorite({ id, image, name, deletedPrice ,currentPrice }));
    }
  };

  return (
    <Col xs={12} md={4} className="mb-4 d-flex justify-content-center align-items-center" data-id={id}>
      <Card className='shoecard'>
        <p className="discount-label">وفر 30%</p>
        <Card.Img variant="top" src={image} alt={name} />
        <CiHeart 
          className={`heart ${isFavorite ? 'favorited' : ''}`} 
          onClick={toggleFavorite} 
        />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text className='prices'>
            <span className="deleted-price">{deletedPrice} جنيها</span>
            <strong className="current-price">{currentPrice} جنيها</strong>
          </Card.Text>
          <Link to={`/product/${id}`}>
                        <button className="btn-full-width">
                            عرض الخيارات
                        </button>
                    </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}
