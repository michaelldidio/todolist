import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Register() {

    let navigate = useNavigate();

    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            Axios.post('http://localhost:3001/api/register', formValues)
                .then(() => {
                    // var successMessage = document.getElementById('addItemSuccess');
                    // successMessage.style.display = 'block';
                    navigate("/login");
                })
                .catch((error) => {
                    console.log(error);
                    var failRegister = document.getElementById('failAlert');
                    var failRegisterMsg = document.getElementById('failAlertMsg');
                    
                    if(error.response.status === 409){
                        failRegisterMsg.innerText = error.response.data;
                        failRegister.style.display = 'block';
                    }
                    else {
                        failRegisterMsg.innerText = "Something went wrong with the registration. Please try again!";
                        failRegister.style.display = 'block';
                    }
                });
        }
    }, [formErrors, isSubmit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        setFormErrors(validateForm(formValues));
        setIsSubmit(true);
    };

    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }

    const validateForm = (values) => {
        const errors = {}
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)$/;
        if (!values.email) {
            errors.email = "Email is required";
        }
        else if (!emailRegex.test(values.email)) {
            errors.email = "Please check email format (username@mail.com)";
        }
        else if (values.email.length > 150) {
            errors.email = "Email cannot be longer than 150 characters";
        }

        const usernameRegex = /^[a-z0-9]{4,20}$/;
        if (!values.username) {
            errors.username = "Username is required";
        }
        else if (!usernameRegex.test(values.username)) {
            errors.username = "Username should be between 4 to 20 characters. It can only contain lowercase and numbers."
        }

        if (!values.password) {
            errors.password = "Password is required.";
        }
        else {
            if (values.password.length < 6 || values.password.length > 64) {
                errors.password = "Password must be between 6-100 characters."
            }
            const pwdUpperRegex = /[A-Z]/;
            if (!pwdUpperRegex.test(values.password)) {
                errors.password = "Password requires at least one uppercase."
            }
            const pwdLowerRegex = /[a-z]/;
            if (!pwdLowerRegex.test(values.password)) {
                errors.password = "Password requires at least one lowercase."
            }
            const pwdSpecialRegex = /([0-9]|\W)/;
            if (!pwdSpecialRegex.test(values.password)) {
                errors.password = "Password requires at least one number or one special character."
            }
        }

        if (values.confirmPassword.localeCompare(values.password) !== 0) {
            errors.confirmPassword = "The 2 passwords do not match."
        }

        return errors;
    };

    return (
        <div className="container my-5">
            <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
                <strong id="failAlertMsg">The username or email already exists. Please choose a new one.</strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <h2 className="text-center my-5">New User Registration Form</h2>

            <form className="w-50 mx-auto" onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter username" max-length="20" className="form-control my-2"
                    id="username" name="username" value={formValues.username} onChange={handleChange} />
                <p className='errors mb-4'>{formErrors.username}</p>

                <input type="email" placeholder="Enter email" max-length="50" className="form-control my-2"
                    id="email" name="email" value={formValues.email} onChange={handleChange} />
                <p className='errors mb-4'>{formErrors.email}</p>

                <input type="password" placeholder="Enter Password" className="form-control my-2"
                    id="password" name="password" value={formValues.password} onChange={handleChange} />
                <p className='errors mb-4'>{formErrors.password}</p>

                <input type="password" placeholder="Re-Enter Password" className="form-control my-2"
                    id="confirmPassword" name="confirmPassword" value={formValues.confirmPassword} onChange={handleChange} />
                <p className='errors mb-4'>{formErrors.confirmPassword}</p>

                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary text-center mt-3" type="submit">Sign Up</button>
                </div>
                <p>Already registered, <a href="/login">login</a> here</p>

            </form>
        </div>
    );
}

export default Register;
