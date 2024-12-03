import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../Rtk/Slices/favSlice';


export default function FavPage() {
    const dispatch = useDispatch();
    const favoriteItems = useSelector(state => state.favorites.favoriteItems);

    const handleRemove = (id) => {
        dispatch(removeFavorite(id));
    };
    return (
        <>
            <section className="fav mt-5">
                <div className="container">
                    {favoriteItems.length === 0 ? (<p className='fs-5 text-center'>No favorites added yet!</p>) : (
                        <>
                        {
                            favoriteItems.map(item => (


                                <div className="row g-3 justify-content-between">
                                    <div className="col-md-6 col-lg-3">
                                        <div className="d-flex gap-1 align-items-center  gap-3 mb-3">
                                            <button type="button"  onClick={() => handleRemove(item.id)} className=" btn_exit p-1" aria-label="Close">x </button>
                                            <a href='#'> <img src={item.image} alt={item.name} title="" style={{ width: "90px", height: "90px", borderRadius: "0" }} /></a>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <h4>اسم المنتج </h4>
                                        <p className='productname'>{item.name}</p>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <h4>السعر</h4>
                                        <div className="d-flex"><span>{item.currentPrice}  جنيه</span></div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <h4>تاريخ الاضافة</h4>
                                        <p>سبتمبر 27, 2024
                                        </p>
                                    </div>
                                </div>))
                        }</>
                    )}


                </div>



            </section>

        </>
    )
}


// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { removeFavorite } from '../Rtk/Slices/favSlice';

// export default function FavoritesPage() {
//   const dispatch = useDispatch();
//   const favoriteItems = useSelector(state => state.favorites.favoriteItems);

//   const handleRemove = (id) => {
//     dispatch(removeFavorite(id));
//   };

//   return (
//     <div className="favorites-page">
//       <h2>Your Favorites</h2>
//       {favoriteItems.length === 0 ? (
//         <p>No favorites added yet!</p>
//       ) : (
//         <ul>
//           {favoriteItems.map(item => (
//             <li key={item.id}>
//               <img src={item.image} alt={item.name} />
//               <div>
//                 <h3>{item.name}</h3>
//                 <p>{item.currentPrice} جنيها</p>
//                 <button onClick={() => handleRemove(item.id)}>Remove from Favorites</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
