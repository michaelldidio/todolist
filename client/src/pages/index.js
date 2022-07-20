import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';


function Index() {

    let navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    console.log(isAuth);

    const [articleList, setArticleList] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setIsAuth(false);
        } else {
            setIsAuth(true);
        }

        if (!localStorage.getItem("username")) {
            setUser(null);
        } else {
            setUser(localStorage.getItem("username"));
        }

        Axios.get('http://localhost:3001/api/articles').then((response) => {
            setArticleList(response.data)
        });
    }, []);

    return (
        <div className="container my-5">
            <h1 className="text-center my-5 text-success">Buy Food</h1>

            {articleList.map((art) => (
                <div key={art.articleId} className="my-5 card p-3">
                    <h3 className=' text-primary'>{art.title}</h3>
                    <p><i>Posted by {art.username} on {moment(art.creationTime).format("MMMM D, YYYY")} at {moment(art.creationTime).format("HH:MM")}</i></p>
                    <div>{parse((art.body).substring(0, 500))}
                        <a href={"/todo/" + art.articleId} className='button btn btn-success py-0'>read more</a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Index;
