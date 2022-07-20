import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import "../App.css"
import Axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';



function AddToDo() {
    let navigate = useNavigate();

    const initialValues = {
        title: "",
        content: ""
    }
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);


    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit && localStorage.getItem("token")) {
            Axios.post('http://localhost:3001/api/article', formValues, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            })
                .then(() => {
                    var successMessage = document.getElementById('successAlert');
                    successMessage.style.display = 'block';
                    // navigate("/");
                })
                .catch((error) => {
                    console.log(error);
                    var failAdd = document.getElementById('failAlert');
                    var failAddMsg = document.getElementById('failAlertMsg');

                    failAddMsg.innerText = error.response.data;
                    failAdd.style.display = 'block';
                });
        }
    }, [formErrors, isSubmit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        closeFailAlert();
        closeSuccessAlert();
        setFormErrors(validateForm(formValues));
        if (localStorage.getItem("token")) {
            setIsSubmit(true);
        }
        else {
            navigate("/login");
        }
    };

    const closeSuccessAlert = () => {
        var successMessage = document.getElementById('successAlert');
        successMessage.style.display = 'none';
    }
    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }

    const validateForm = (values) => {
        const errors = {}

        if (!values.title) {
            errors.title = "Title is required";
        }
        else if (values.title.length < 10 || values.title.length > 100) {
            errors.title = "Title should be between 10 to 100 characters"
        }

        if (!values.content) {
            errors.content = "Content cannot be emptied"
        } else if (values.content.length < 50 || values.content.length > 4000) {
            errors.content = "Content should be between 50 to 4000 characters"
        }

        return errors;
    };

    return (
        <div className='container my-5'>
            <div className="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
                <strong>To Do has been successfully added</strong>
                <button type="button" className="btn-close" onClick={closeSuccessAlert}></button>
            </div>
            <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
                <strong id="failAlertMsg">Error while trying to add the new to do item. Please try again.</strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <h1 className='text-center'>New To Do</h1>
            <form className='m-4 w-75 mx-auto' onSubmit={handleSubmit}>
                <label htmlFor="title" className='form-label my-3 mb-1'>Title</label>
                <input type="text" placeholder='Article title' className="form-control"
                    name="title" id="title" value={formValues.title} onChange={handleChange} />
                <p className='errors'>{formErrors.title}</p>

                <label htmlFor="content" className='form-label my-3 mb-1'>Item Description</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={formValues.content}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setFormValues({ ...formValues, "content": data });
                    }}
                />
                <p className='errors'>{formErrors.content}</p>

                <div className='d-flex justify-content-center'>
                    <button className="btn btn-primary text-center my-3 mx-1" type="submit">Add</button>
                    <a href="/auth/articles" className="btn btn-primary text-center my-3 mx-1" type="submit">Back to List</a>
                </div>
            </form>
        </div>
    );
}

export default AddToDo;