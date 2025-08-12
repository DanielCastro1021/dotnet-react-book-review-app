import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authService } from "../../services/authService";

const Logout: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
        authService.logout();
        history.push('/login');
    }, [history]);

    return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Logging out...</span>
            </div>
            <p className="mt-3">Logging you out...</p>
        </div>
    );
};

export default Logout;
