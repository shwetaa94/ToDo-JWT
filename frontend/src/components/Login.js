import React,{useState} from 'react'

import { NavLink, useNavigate } from "react-router-dom";
import "./Register.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  const handleEvent = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      localStorage.setItem("token",data.token);
      navigate("/home");
    }
  };
  return (
    <>
    <div className="container">
        <form onSubmit={handleSubmit} class="login-form">
            <h1>Login</h1>
                <input type="text" onChange={handleEvent} placeholder="Username" name="username" />
                <input type="password" onChange={handleEvent} placeholder="Password" name="password" />
                <br />
                <br />
                <input type="submit" value="Log In" />
                <NavLink to="/register"  className="navlink" >
                <p className="clickhere">New user, Click here to Register?</p>
                </NavLink>
        </form>
    </div>
</>
  )
}

export default Login;