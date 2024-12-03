import React from 'react';
import './Css/WomenSocks.css';
import SocksCard from '../components/SocksCard';  
const WomenSocks = () => {
    const womenSocks = [
        { name: 'مجموعة 12 شرابات طويل كود 81', deletedPrice: 90, currentPrice: 70 },
        { name: 'مجموعة 8 شرابات قصير كود 82', deletedPrice: 85, currentPrice: 65 },
        { name: 'مجموعة 5 شرابات رياضي كود 83', deletedPrice: 100, currentPrice: 85 }
    ];

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="sort" className="form-label">الترتيب الافتراضي</label>
                    <select id="sort" className="form-select">
                        <option value="default">الترتيب الافتراضي</option>
                        <option value="priceLowToHigh">ترتيب حسب: الأقل سعراً</option>
                        <option value="priceHighToLow">ترتيب حسب: الأعلى سعراً</option>
                    </select>
                </div>
            </div>
            <div className="row" id="product-list">
                {womenSocks.map((sock, index) => (
                    <SocksCard key={index} name={sock.name} deletedPrice={sock.deletedPrice} currentPrice={sock.currentPrice} />
                ))}
            </div>
        </div>
    );
};

export default WomenSocks;
