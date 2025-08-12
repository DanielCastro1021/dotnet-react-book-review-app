import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { authService } from "../../services/authService";

interface ProtectedRouteProps extends RouteProps {
    component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    component: Component, 
    ...rest 
}) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                authService.isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                    <Redirect 
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }} 
                    />
                )
            }
        />
    );
};

export default ProtectedRoute;
