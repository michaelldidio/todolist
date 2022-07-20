import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import "../App.css"
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';


function ToDo() {
    const { id } = useParams();

    const initialValues = {
        id: 0,
        title: "",
        body: "",
        creationTime: "",
        username: ""
    }


    let navigate = useNavigate();


    const [todo, setArticle] = useState(initialValues);
    useEffect(() => {
        Axios.get(`http://localhost:3001/api/article/${id}`)
            .then((response) => {
                console.log(response);
                setArticle(response.data[0]);
            }).catch((error) => {
                navigate("/");
            });
    }, []);


    return (
        <div className='container my-5'>
            <div className="my-5">
                <h3 className=' text-primary'>{todo.title}</h3>
                <p><i>Posted by {todo.username}</i></p>
                <div>{parse(todo.body)}</div>
            </div>
            <div className='text-center'>
                <a href="/" className='button btn btn-success'>Back to Home</a>
            </div>
        </div>
    );
}

export default ToDo;