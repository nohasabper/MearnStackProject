import React from 'react';
import { Container, Row } from 'react-bootstrap';
import './Css/MenShoe.css';
import ShoeCard from '../components/ShoeCard';
import axios from 'axios';

export default function MenShoe() {
    const [shoes, setShoes] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://localhost:8080/api/products/category/15')
            .then(response => setShoes(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <>
            <div>
                <Container fluid>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label htmlFor="sort" className="form-label">الترتيب الافتراضي</label>
                            <select
                                id="sort"
                                className="form-select"
                            >
                                <option value="default">الترتيب الافتراضي</option>
                                <option value="priceLowToHigh">ترتيب حسب: الأقل سعراً</option>
                                <option value="priceHighToLow">ترتيب حسب: الأعلى سعراً</option>
                            </select>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="h-100">
                <Row className="text-center g-4">
                    {shoes.map((shoe) => (
                        <ShoeCard
                            key={shoe._id}           
                            id={shoe._id}           
                            image={shoe.image}
                            name={shoe.name}
                            deletedPrice={shoe.deletedPrice}
                            currentPrice={shoe.price}
                        />
                    ))}
                </Row>
            </Container>
        </>
    );
}
