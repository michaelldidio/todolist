import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';


function ToDoList() {

    const [articleList, setToDoList] = useState([]);

    const deleteToDo = (id) => {
        Axios.delete(`http://localhost:3001/api/delete/${id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            getToDoList()
        })
    }

    const getToDoList = () => {
        Axios.get('http://localhost:3001/api/author/articles', {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setToDoList(response.data)
        }).catch((error) => {
            var fail = document.getElementById('failAlert');
            var failMsg = document.getElementById('failAlertMsg');

            failMsg.innerText = error.response.data;
            fail.style.display = 'block';
        });
    }

    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }

    useEffect(() => {
        Axios.get('http://localhost:3001/api/author/articles', {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setToDoList(response.data)
        }).catch((error) => {
            var fail = document.getElementById('failAlert');
            var failMsg = document.getElementById('failAlertMsg');

            failMsg.innerText = error.response.data;
            fail.style.display = 'block';
        });
    }, []);

    return (
        <div className="container my-5">
            <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
                <strong id="failAlertMsg">Error trying to get your todos.</strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <table className="table table-striped table-hover table-bordered border border-5 my-5" id="todos-table">
                <thead className="text-center">
                    <tr>
                        <th>Title</th>
                        {/* <th>Content</th> */}
                        <th>Content</th>
                        <th>Created (DD-MM-YY)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articleList.map((art) => (
                        <tr key={art.id}>
                            <td>{art.title}</td>
                            {/* <td>{parse((art.body).substring(0,200))}</td> */}
                            <td>{parse((art.body).substring(0, 200))}</td>
                            <td className='text-center'>{moment(art.creationTime).format("DD-MM-YY HH:mm")}</td>
                            <td className="text-center">
                                <a href={"/auth/todo/edit/" + art.id} className="btn btn-secondary mx-2">Edit</a>
                                <button className="btn btn-danger mx-2" onClick={() => { deleteToDo(art.id) }}>Delete</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default ToDoList;
