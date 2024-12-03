// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenShoe from './Pages/MenShoe';
import ProductDetails from './Pages/ProductDetails';
import Account from './Pages/Account';
import OrderedForm from './Pages/OrderedForm';
import Login from './Pages/Login';
import Offers from './Pages/Offers';
import Register from './Pages/Register';
import FavPage from './Pages/FavPage';
import Cart from './Pages/Cart';
import Address from './Pages/Adress';
import AccountDetails from './Pages/AccountDetails';
import Orders from './Pages/Orders';
import CategoryPage from './Pages/CategoryPage';
import AdminDashboard from './Pages/AdminDashboard';
import Categories from './components/Categories';
import Products from './components/Product';
import Users from './components/Users';
import Sales from './components/Sales';
import OrderAdmin from './components/OrderAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './Rtk/Slices/Auth';


function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/category/:categoryNumber" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/fav" element={<FavPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/men-shoe" element={<MenShoe />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/offers" element={<Offers />} />
          {/* Protected Routes for Admin */}
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="category" element={<Categories />} />
            <Route path="product" element={<Products />} />
            <Route path="user" element={<Users />} />
            <Route path="sales" element={<Sales />} />
            <Route path="ordersAdmin" element={<OrderAdmin />} />

          </Route>

          {/* Protected Routes for Authenticated Users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/OrderedForm" element={<OrderedForm />} />
            <Route path="/account/orders" element={<Orders />} />
            <Route path="/account/AccountDetails" element={<AccountDetails />} />
            <Route path="/account/address" element={<Address />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
