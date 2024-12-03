import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";
import './css/Card.css';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../Rtk/Slices/favSlice';

const SocksCard = ({ name, deletedPrice, currentPrice, image, id }) => {

    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites.favoriteItems);

    const isFavorite = favorites.some(item => item.id === id);

    const toggleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFavorite(id));
        } else {
            dispatch(addFavorite({ id, image, name, deletedPrice, currentPrice }));
        }
    };
    return (
        <div className="col-md-4 mb-4">
            <Card className="h-100 shoecard">
                <p className="discount-label">وفر 30%</p>
                <Card.Img variant="top" src={image} alt={name} />
                <CiHeart
                    className={`heart ${isFavorite ? 'favorited' : ''}`}
                    onClick={toggleFavorite}
                />                <Card.Body className="d-flex flex-column">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className='prices'>
                        {deletedPrice && (
                            <span className="text-muted text-decoration-line-through me-2">
                                {deletedPrice} جنيها
                            </span>
                        )}
                        <span className="fw-bold">{currentPrice} جنيها</span>
                    </Card.Text>
                    <Link to={`/product/${id}`}>
                        <button className="btn-full-width">
                            عرض الخيارات
                        </button>
                    </Link>
                </Card.Body>
            </Card>
        </div>
    );
};

export default SocksCard;
