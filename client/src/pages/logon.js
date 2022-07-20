import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Logon() {

    let navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    }
    const [formValues, setFormValues] = useState(initialValues);

    const [loginStatus, setLoginStatus] = useState("");

    Axios.defaults.withCredentials = true;

    const login = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/api/login', formValues)
            .then(() => {
                var successMessage = document.getElementById('addItemSuccess');
                successMessage.style.display = 'block';
                // navigate("/");
            })
            .catch((error) => {
                console.log(error);
                var failRegister = document.getElementById('registerFail');
                var failRegisterMsg = document.getElementById('registerFailMsg');

                if (error.response.status === 409) {
                    failRegisterMsg.innerText = error.response.data;
                    failRegister.style.display = 'block';
                }
                else {
                    failRegisterMsg.innerText = "Something went wrong with the registration. Please try again!";
                    failRegister.style.display = 'block';
                }
            });
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const closeFailAlert = () => {
        var failMessage = document.getElementById('registerFail');
        failMessage.style.display = 'none';
    }



    return (
        <div className="container my-5">
            <div className="alert alert-danger alert-dismissible fade show" role="alert" id="registerFail">
                <strong id="registerFailMsg">The username or email already exists. Please choose a new one.</strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <h2 className="text-center my-5">New User Registration Form</h2>

            <form className="w-50 mx-auto">

                <input type="email" placeholder="Enter email" max-length="50" className="form-control my-2"
                    id="email" name="email" value={formValues.email} onChange={handleChange} />

                <input type="password" placeholder="Enter Password" className="form-control my-2"
                    id="password" name="password" value={formValues.password} onChange={handleChange} />

                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary text-center mt-3" onClick={login}>Logon</button>
                </div>

            </form>
        </div>
    );
}

export default Logon;
