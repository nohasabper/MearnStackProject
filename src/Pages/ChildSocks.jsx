import React from 'react';
import SocksCard from '../components/SocksCard'; 
const ChildSocks = () => {
    const childSocks = [
        { name: 'مجموعة 8 شرابات طويل كود 61', deletedPrice: 60, currentPrice: 45 },
        { name: 'مجموعة 5 شرابات قصير كود 62', deletedPrice: 50, currentPrice: 35 },
        { name: 'مجموعة 3 شرابات رياضي كود 63', deletedPrice: 55, currentPrice: 40 }
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
                {childSocks.map((sock, index) => (
                    <SocksCard key={index} name={sock.name} deletedPrice={sock.deletedPrice} currentPrice={sock.currentPrice} />
                ))}
            </div>
        </div>
    );
};

export default ChildSocks;
