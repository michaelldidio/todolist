import React from 'react'
import { Route, useNavigate } from 'react-router-dom'

function ProtectedRoute({ isAuth: isAuth, element: element, ...rest }) {
    const navigate = useNavigate();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuth) {
                    return element;
                }
                else {
                    return <navigate to={{ pathname: "/login", state: { from: props.location } }} />;
                }
            }} />
    );
}

export default ProtectedRoute;