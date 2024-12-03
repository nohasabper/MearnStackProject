import React, { useEffect, useState } from 'react';
import OfferCard from '../components/offerCard'; // Ensure this component is correctly imported
import axios from 'axios';

export default function Offer() {
    const [offers, setOffers] = useState([]);
    const [sortedOffers, setSortedOffers] = useState([]); // New state for sorted offers
    const [sortOption, setSortOption] = useState('default'); // State for sort option
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products/category/17');
                console.log("Data received from API:", response.data);
                setOffers(response.data);
                setSortedOffers(response.data); // Set sorted offers initially
            } catch (error) {
                console.error("Error fetching offers:", error);
                setError("Error fetching offers. Please try again later.");
            } finally {
                setLoading(false); // Set loading to false once fetch is complete
            }
        };

        fetchOffers();
    }, []);

    const handleSortChange = (e) => {
        const selectedOption = e.target.value;
        setSortOption(selectedOption);

        let sortedArray = [...offers]; // Create a copy of offers for sorting
        if (selectedOption === 'priceLowToHigh') {
            sortedArray.sort((a, b) => a.price - b.price); // Sort ascending
        } else if (selectedOption === 'priceHighToLow') {
            sortedArray.sort((a, b) => b.price - a.price); // Sort descending
        }
        setSortedOffers(sortedArray); // Update sorted offers
    };

    if (loading) {
        return <div>Loading offers...</div>; // Loading message
    }

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="sort" className="form-label">الترتيب الافتراضي</label>
                    <select id="sort" className="form-select" value={sortOption} onChange={handleSortChange}>
                        <option value="default">الترتيب الافتراضي</option>
                        <option value="priceLowToHigh">ترتيب حسب: الأقل سعراً</option>
                        <option value="priceHighToLow">ترتيب حسب: الأعلى سعراً</option>
                    </select>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row" id="product-list">
                {sortedOffers.map((sock) => (
                    <OfferCard 
                        key={sock._id} 
                        name={sock.name}
                        deletedPrice={sock.deletedPrice}
                        currentPrice={sock.newPrice}
                        image={sock.image}
                        id={sock._id} 
                    />
                ))}
            </div> 
        </div>
    );
}
