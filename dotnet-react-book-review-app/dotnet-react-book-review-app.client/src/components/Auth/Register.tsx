import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { authService, RegisterRequest } from "../../services/authService";

const Register: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [generalError, setGeneralError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (generalError) {
            setGeneralError('');
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setGeneralError('');
            
            const response = await authService.register(formData);
            authService.setAuthData(response.data);
            
            // Redirect to home page or dashboard
            history.push('/');
            
        } catch (error: any) {
            console.error('Registration error:', error);
            if (error.response?.status === 400) {
                setGeneralError('Email is already registered or invalid data provided');
            } else {
                setGeneralError('An error occurred during registration. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title">
                                    <i className="fas fa-user-plus me-2 text-success"></i>
                                    Create Account
                                </h2>
                                <p className="text-muted">Join our book review community!</p>
                            </div>

                            {generalError && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {generalError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="firstName" className="form-label">
                                                <i className="fas fa-user me-2"></i>
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter your first name"
                                                autoComplete="given-name"
                                            />
                                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="lastName" className="form-label">
                                                <i className="fas fa-user me-2"></i>
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter your last name"
                                                autoComplete="family-name"
                                            />
                                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="fas fa-envelope me-2"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        <i className="fas fa-lock me-2"></i>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="new-password"
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    <div className="form-text">Password must be at least 6 characters long</div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        <i className="fas fa-lock me-2"></i>
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                    />
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create Account
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-4">
                                Already have an account? 
                                <Link to="/login" className="text-decoration-none ms-1 fw-bold">
                                    Sign in here
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
