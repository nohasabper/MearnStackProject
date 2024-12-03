import React, { useState, useEffect } from 'react';
import './Css/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../Rtk/Slices/Auth';
import { Spinner, Alert } from 'react-bootstrap';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const { username, email, password } = formData;
    const { user, token, loading, error } = useSelector((state) => state.auth);
    const handleChange = (e) => { 
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (hasErrors()) {
            console.log(error);
        } else {
            dispatch(registerUser({ username, email, password }));
        }
    };

    // Validate form inputs
    const hasErrors = () => {
        const errors = {};
        if (!username) {
            errors.username = "اسم المستخدم مطلوب";
        }
        // Simple email regex for validation
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

    // Local state for form errors
    const [formErrors, setError] = useState({});

    useEffect(() => {
        if (token) {
            navigate('/Account');
        }
    }, [token, navigate]);

    return (
        <div className="container form-container">
            <div className="form-box">
                <h3>تسجيل جديد</h3>
                <form onSubmit={handleSubmit} noValidate>
                    {/* Username Field */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            اسم المستخدم <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                            id="username"
                            name="username"
                            required
                            value={username}
                            onChange={handleChange}
                        />
                        {formErrors.username && (
                            <div className="invalid-feedback">
                                {formErrors.username}
                            </div>
                        )}
                    </div>

                    {/* Email Field */}
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

                    {/* Password Field */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            كلمة المرور <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        {formErrors.password && (
                            <div className="invalid-feedback">
                                {formErrors.password}
                            </div>
                        )}
                    </div>

                    {/* Server Error */}
                    {error && error.message && (
                        <div className="alert alert-danger" role="alert">
                            {error.message}
                        </div>
                    )}

                    {/* Submit Button */}
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
                                جاري التسجيل...
                            </>
                        ) : (
                            'تسجيل جديد'
                        )}
                    </button>

                    {/* Link to Login Page */}
                    <Link to="/Login" className="text-center d-block mt-3">لديك حساب؟ تسجيل الدخول</Link>
                </form>
            </div>
        </div>
    );
};

export default Register;
