import React, { useMemo, useState } from 'react';
import './css/Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import { increaseQuantity, decreaseQuantity, removeProduct } from '../Rtk/Slices/CartSlice';

const Header = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const total = useSelector(state => state.cart.total);
  const currentUser = useSelector(state => state.auth.user);
  const favoritesCount = useSelector(state => state.favorites.favoriteItems.length);

  const [isOfferActivated, setIsOfferActivated] = useState(false);
  const shipping = isOfferActivated ? 0 : 40; // Dynamic shipping based on the offer
  const uniqueProductCount = cartItems.length;

  const totalWithShipping = useMemo(() => {
    return total < 350 ? total + shipping : total;
  }, [total, shipping]); 

  return (
    <>
      <header className="header">
        <div className="top-bar">
          <p>شحن مجاني وخفض 100 جنيه للطلبات +999ج</p>
        </div>
        <Navbar expand="lg" className="navbar">
          <Container>
            <Link to="/" className="navbar-logo-text">DONICCI</Link>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" className="justify-content-center">
              <Nav className="nav-links">
                <NavDropdown title="رجالي" id="men-dropdown">
                  <NavDropdown.Item as={Link} to="/men-Shoe">أحذية رجالي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/2">شراب انكل رجالي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/1">شراب طويل رجالي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/6">شراب غير ظاهر رجالي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/5">شراب هاف رجالي</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="حريمي" id="women-dropdown">
                  <NavDropdown.Item as={Link} to="/category/3">شراب انكل حريمي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/4">شراب طويل حريمي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/7">شراب غير ظاهر حريمي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/8">شراب هاف حريمي</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="اطفال" id="kids-dropdown">
                  <NavDropdown.Item as={Link} to="/category/9">اطفالي ولادي (من 2 سنة ل 4 سنين)</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/10">اطفالي بناتي (من 2 سنة ل 4 سنين)</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/12">اطفالي ولادي (من 5 سنين ل 8 سنين)</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/11">اطفالي بناتي (من 5 سنين ل 8 سنين)</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/13">اطفالي ولادي (من 9 سنين ل 12 سنين)</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/category/14">اطفالي بناتي (من 9 سنين ل 12 سنين)</NavDropdown.Item>
                </NavDropdown>

                <Link to="/offers" className="offers">العروض</Link>
                <Link to="/category/all" className="offers">الجميع</Link>
              </Nav>
            </Navbar.Collapse>
            <div className="nav-icons d-flex align-items-center">
              <Link className="icon position-relative" data-bs-toggle="modal" data-bs-target="#cart">
                <FaShoppingCart />
                {uniqueProductCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle cartQuantity">
                    {uniqueProductCount}
                  </span>
                )}
              </Link>
              {currentUser?.isAdmin && (
                <Link className="link-admin" to="/admin-dashboard">admin</Link>
              )}
              <Link className="icon position-relative" to="/Fav">
                <FaHeart />
                {favoritesCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle wishQuantity">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <Link className="icon" to="/Login"><FaUser /></Link>
            </div>
          </Container>
        </Navbar>
      </header>

      {/* Modal for Cart */}
      <div className="modal fade" id="cart" tabIndex={-1} aria-labelledby="cartname" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="w-100 model_hed p-3 px-4 bg-body-secondary d-flex justify-content-between align-items-center">
              <h1 className="modal-title fs-5">سلة التسوق</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body px-4">
              {cartItems.length === 0 ? (
                <p>سلة التسوق فارغة</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="d-flex gap-3 mb-2 align-items-center justify-content-between">
                    <div className="d-flex gap-1 align-items-center">
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => dispatch(removeProduct(item.id))}
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        title={item.name}
                        style={{ width: "90px", height: "90px", borderRadius: "0" }}
                      />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.price} جنيه</p>
                      </div>
                    </div>
                    <div className="quantites d-flex gap-1 p-0 bg-body-secondary">
                      <span className="decrease p-2" onClick={() => dispatch(decreaseQuantity(item.id))}>-</span>
                      <span className="quantity p-2 border px-3">{item.quantity}</span>
                      <span className="increase p-2" onClick={() => dispatch(increaseQuantity(item.id))}>+</span>
                    </div>
                  </div>
                ))
              )}

              <div className="d-flex justify-content-between my-3">
                <span>المجموع</span>
                <span>{total} جنيه</span>
              </div>
              <div className="d-flex justify-content-between my-3">
                <span>الشحن</span>
                <span>{shipping} جنيه</span>
              </div>
              <div className="d-flex justify-content-between my-3 fw-bold">
                <span>الإجمالي</span>
                <span>{totalWithShipping} جنيه</span>
              </div>

              <div className="w-100">
                <Link 
                  to="/OrderedForm" 
                  className="btn w-100 btn_order" 
                  disabled={cartItems.length === 0} // Disable the button if the cart is empty
                  style={{ 
                    pointerEvents: cartItems.length === 0 ? 'none' : 'auto', // Prevent click events when disabled
                    opacity: cartItems.length === 0 ? 0.5 : 1 // Reduce opacity for visual indication
                  }}
                >
                  اتمام الطلب
                </Link>
              </div>
              <div className="text-center my-3">
                <Link to="/category/all">مزيد من التسوق</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
