import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import './index.css';
import Register from './pages/register'
import Login from './pages/login'
import AddToDo from './pages/addToDo';
import EditToDo from './pages/editToDo';
import Index from './pages/index';
import ToDo from './pages/toDo';
import ToDoList from './pages/toDoList';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { UserContext, AuthContext } from "./components/UserContext";

function AppRouter() {

  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

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
  }, [isAuth, user]);

  const logout = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.clear();
  }

  return (
    <BrowserRouter>
      <div className="container">
        <div className='d-flex justify-content-end mt-5'>
          {(isAuth && user) ?
            <div>
              <span className='h5'>Hello {user}</span>
              <button className='btn btn-info ms-4 mb-2 py-0' onClick={logout}>Logout</button>
            </div>
            :
            <span className='h5'><a href="/register">Register</a> or <a href="/login">Login</a> to add todos</span>
          }
        </div>
        <nav className="navbar navbar-expand-md navbar-light my-3">
          <button className="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between" id="navbarNavAltMarkup">
            <div className="navbar-nav fw-bold fs-5 ms-4">
              <Link className="nav-link" to="/">Home</Link>
              {isAuth ? <Link className="nav-link" to="/auth/articles/add">Add Todos</Link> : <p />}
              {isAuth ? <Link className="nav-link" to="/auth/articles">Edit My Todos</Link> : <p />}
            </div>
          </div>
        </nav>
      </div>
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" exact element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todo/:id" element={<ToDo />} />

            {/* <Route path="/addtodo" element={user? <AddToDo/> : <Navigate to ="/login"/>}/> */}
            <Route path="/auth/todo/add" element={isAuth ? <AddToDo /> : <Login />} />
            <Route path="/auth/todo/edit/:id" element={isAuth ? <EditToDo /> : <Login />} />
            <Route path="/auth/todo" element={isAuth ? <ToDoList /> : <Login />} />
          </Routes>
        </UserContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default AppRouter;

