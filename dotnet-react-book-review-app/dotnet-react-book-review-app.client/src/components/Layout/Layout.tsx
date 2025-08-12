import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {authService, User} from "../../services/authService";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = () => {
            const authenticated = authService.isAuthenticated();
            const currentUser = authService.getCurrentUser();

            setIsAuthenticated(authenticated);
            setUser(currentUser);
        };

        checkAuthStatus();

        // Check auth status on component mount and when storage changes
        const handleStorageChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <header>
                <nav
                    className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                    <div className="container">
                        <Link className="navbar-brand" to="/">Book Review App</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/authors">Authors</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/books">Books</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/categories">Categories</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/reviews">Reviews</Link>
                                </li>
                            </ul>

                            {/* Authentication Navigation */}
                            <ul className="navbar-nav">
                                {isAuthenticated && user ? (
                                    <>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle text-dark" href="#"
                                               id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                                               aria-expanded="false">
                                                <i className="fas fa-user me-1"></i>
                                                Welcome, {user.firstName}
                                            </a>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <Link className="dropdown-item" to="/profile">
                                                        <i className="fas fa-user-circle me-2"></i>
                                                        My Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <hr className="dropdown-divider"/>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/logout">
                                                        <i className="fas fa-sign-out-alt me-2"></i>
                                                        Logout
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to="/login">
                                                <i className="fas fa-sign-in-alt me-1"></i>
                                                Login
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to="/register">
                                                <i className="fas fa-user-plus me-1"></i>
                                                Register
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <main role="main" className="flex-grow-1 pb-3">
                {children}
            </main>
            <footer className="border-top footer text-muted mt-auto">
                <div className="container py-3">
                    &copy; {new Date().getFullYear()} - Book Review App
                </div>
            </footer>
        </div>
    );
};

export default Layout;