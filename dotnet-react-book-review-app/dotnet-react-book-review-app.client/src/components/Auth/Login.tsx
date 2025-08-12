import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { authService, LoginRequest } from "../../services/authService";

const Login: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
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

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
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
            
            const response = await authService.login(formData);
            authService.setAuthData(response.data);
            
            // Redirect to home page or dashboard
            history.push('/');
            
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                setGeneralError('Invalid email or password');
            } else {
                setGeneralError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title">
                                    <i className="fas fa-sign-in-alt me-2 text-primary"></i>
                                    Sign In
                                </h2>
                                <p className="text-muted">Welcome back! Please sign in to your account.</p>
                            </div>

                            {generalError && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {generalError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="fas fa-envelope me-2"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">
                                        <i className="fas fa-lock me-2"></i>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-4">
                                <div className="mb-2">
                                    <Link to="/forgot-password" className="text-decoration-none">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div>
                                    Don't have an account? 
                                    <Link to="/register" className="text-decoration-none ms-1 fw-bold">
                                        Sign up here
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
