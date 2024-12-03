import React, { useState, useEffect } from 'react';
import './Css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchUser } from '../Rtk/Slices/Auth'; // Import fetchUser
import { Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { email, password } = formData;

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);
    
    const [formErrors, setError] = useState({});
    const [hasNavigated, setHasNavigated] = useState(false); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasErrors()) {
            console.log(error);
            return; 
        }

        try {
            const loginResult = await dispatch(loginUser({ email, password })).unwrap();
            await dispatch(fetchUser()); // Fetch user data after login
            Swal.fire({
                title: 'نجاح!',
                text: 'تم تسجيل الدخول بنجاح.',
                icon: 'success',
                confirmButtonText: 'موافق'
            });
        } catch (err) {
            console.error('Login failed:', err);
            Swal.fire({
                title: 'خطأ!',
                text: err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
                icon: 'error',
                confirmButtonText: 'موافق'
            });
        }
    };
    
    const hasErrors = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "البريد الإلكتروني غير صالح";
        }
        if (password.length < 8) {
            errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
        }
        setError(errors);
        return Object.keys(errors).length > 0;
    };

    useEffect(() => {
        if (token && user && !hasNavigated) {
            if (user.role === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else {
                navigate('/account', { replace: true });
            }
            setHasNavigated(true);
        }
    }, [token, user, navigate, hasNavigated]);

    return (
        <div className="container form-container">
            <div className="form-box">
                <h3>تسجيل الدخول</h3>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            البريد الإلكتروني <span className="text-danger">*</span>
                        </label>
                        <input
                            type="email"
                            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            required
                            value={email}
                            onChange={handleChange}
                        />
                        {formErrors.email && (
                            <div className="invalid-feedback">
                                {formErrors.email}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            كلمة المرور <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <input
                                type='password'
                                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                required
                                value={password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            {formErrors.password && (
                                <div className="invalid-feedback">
                                    {formErrors.password}
                                </div>
                            )}
                        </div>
                    </div>
                    {error && error.message && (
                        <div className="alert alert-danger" role="alert">
                            {error.message}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />{' '}
                                جاري تسجيل الدخول...
                            </>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </button>

                    <Link to="/register" className="text-center d-block mt-3">مستخدم جديد؟ تسجيل حساب</Link>
                </form>
            </div> 
        </div>
    );
};

export default Login;
