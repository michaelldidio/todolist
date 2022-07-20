import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext, UserContext } from "../components/UserContext";


function Login() {

    let navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    }

    const [formValues, setFormValues] = useState(initialValues);
    const {user, setUser} = useContext(UserContext);
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const login = (e) => {
        e.preventDefault();
        closeFailAlert();
        closeSuccessAlert();
        Axios.post('http://localhost:3001/api/login', formValues)
            .then((response) => {
                var successMessage = document.getElementById('successAlert');
                successMessage.style.display = 'block';
                if (!response.data.auth) {
                    console.log(response.data);
                    setIsAuth(false);
                    setUser(null);
                }
                else {
                    console.log(response.data);
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("username", response.data.user.username);
                    setIsAuth(true);
                    setUser(response.data.user.username);
                }
                navigate("/");

            })
            .catch((error) => {
                console.log(error);
                var failLogin = document.getElementById('failAlert');
                var failLoginMsg = document.getElementById('failAlertMsg');

                failLoginMsg.innerText = error.response.data;
                failLogin.style.display = 'block';
            });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const closeSuccessAlert = () => {
        var successMessage = document.getElementById('successAlert');
        successMessage.style.display = 'none';
    }

    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }

    return (
        <div className="container my-5">
            <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
                <strong id="failAlertMsg">Email </strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <div className="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
                <strong>Login successfully</strong>
                <button type="button" className="btn-close" onClick={closeSuccessAlert}></button>
            </div>
            <h2 className="text-center my-5">Login</h2>

            <form className="w-50 mx-auto">

                <input type="email" placeholder="Enter email" max-length="50" className="form-control my-2"
                    id="email" name="email" value={formValues.email} onChange={handleChange} />

                <input type="password" placeholder="Enter Password" className="form-control my-2"
                    id="password" name="password" value={formValues.password} onChange={handleChange} />

                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary text-center mt-3" onClick={login}>Login</button>
                </div>

            </form>

            <p className='text-center my-5'>Not a user yet, <a href="/register">register here</a></p>
        </div>
    );
}

export default Login;
