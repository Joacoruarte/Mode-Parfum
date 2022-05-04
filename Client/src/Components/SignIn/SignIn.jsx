import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logo from "./Logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import service from "../../services/login";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "react-google-login";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export function validate(input) {
  let errors = {};
  console.log(errors);

  if (!input.username) {
    errors.username = "Username is required";
  } else if (!/\S+@\S+\.\S+/.test(input.username)) {
    errors.username = "Username is invalid";
  }
  if (!input.password) {
    errors.password = "Password is required";
  } else if (!/(?=.-*[0-9])/.test(input.password)) {
    errors.password = "Password is invalid";
  }
  return errors;
}

function SignUp() {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const User = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleInputChange = function (e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSumbit = async (e) => {
    try {
      e.preventDefault();
      if (Object.keys(errors).length > 0) {
        toast.error("Debes completar correctamente los campos.");
      }
      const user = await service.login(input);
      setUser(user);
      window.localStorage.setItem("loggedToken", JSON.stringify(user));
      service.setToken(user.token);
      if (user.token) {
        toast.success(`Bienvenido al Home ${user.username}`);
        navigate("/");
      }
      console.log(user);
    } catch (e) {
      console.log(e);
      toast.error("Contraseña o usuario incorrecto.");
    }
  };
  const respuestaGoogle = async (respuesta) => {
    const register = await axios.post("/oneUser", {
      username: respuesta.profileObj.email,
      password: respuesta.profileObj.googleId,
    });
    if (register.data.hasOwnProperty("success")) {
      const user = await axios.post("/login", {
        username: respuesta.profileObj.email,
        password: respuesta.profileObj.googleId,
      });
      window.localStorage.setItem("loggedToken", JSON.stringify(user.data));
      service.setToken(user.data.token);
      if (user.data.token) {
        toast.success(`Bienvenido al Home ${user.data.username}`);
        navigate("/");
      }
    } else {
      const userRegister = await axios.post("/register", {
        username: respuesta.profileObj.email,
        password: respuesta.profileObj.googleId,
      });
      if (userRegister.data.hasOwnProperty("success")) {
         setTimeout(async() => {
           const user = await axios.post("/login", {
             username: respuesta.profileObj.email,
             password: respuesta.profileObj.googleId,
           });
           window.localStorage.setItem("loggedToken", JSON.stringify(user.data));
           service.setToken(user.data.token);
           if (user.data.token) {
             toast.success(`Bienvenido al Home ${user.data.username}`);
             navigate("/");
           }
         }, 3000);
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SignUpDivContainer>
        <ImgSignUp>
          <Link to="/">
            <img src={logo} alt="logo" width="450px" />
          </Link>
        </ImgSignUp>

        <SignUpContainer>
          <form onSubmit={handleSumbit}>
            <label>Username</label>
            <input
              onChange={handleInputChange}
              value={input.username}
              placeholder="Email"
              type="text"
              name="username"
            />
            {errors.username && <p className="error">{errors.username}</p>}

            <label>Contraseña</label>
            <input
              onChange={handleInputChange}
              value={input.password}
              placeholder="Password"
              type="password"
              name="password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
            <button>Acceder</button>
            <hr className="linea"/>
            <GoogleLogin
              clientId="909615731637-in2a5sb985nndpniessv5trc4ph926q7.apps.googleusercontent.com"
              buttonText="Acceder con Google"
              onSuccess={respuestaGoogle}
              onFailure={() => console.log("fail")}
              cookiePolicy={"single_host_origin"}
              style={{ color: "black important!" }}
            />
            <div style={{ position: "relative", top: "-1rem" }}>
              <Link className="link-to-signup" to={"/PasswordReset"}>
                ¿Olvidaste tu contraseña?
              </Link>

              <Link className="link-to-signup" to={"/SignUp"}>
                REGISTRARME
              </Link>
            </div>
          </form>
        </SignUpContainer>

        <Link to="/">
          <button className="back_signUp">VOLVER</button>
        </Link>
      </SignUpDivContainer>
    </>
  );
}

export default SignUp;

const SignUpDivContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-image: url(https://dam.esquirelat.com/wp-content/uploads/2021/02/nuevos-perfumes-para-hombre-marcas.jpg);
  object-fit: fill;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  .back_signUp {
    margin: 0.2rem;
    padding: 0.5rem;
    border: none;
    background: none;
    color: #ffffff;
    font-size: 1rem;
    font-weight: bold;
    transition: 0.2s ease-in-out;
    letter-spacing: 0.3rem;
  }
  .back_signUp:hover {
    cursor: pointer;
    color: white;
    background: #8893b1b5;
    border-radius: 10px;
  }
  @media (max-width: 455px) {
    height: 125vh;
    width: 125%;
    object-fit: fill;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const ImgSignUp = styled.div`
  margin-top: -2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 455px) {
    width: 150px;
  }
`;

const SignUpContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  * {
    @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
    font-family: "Poppins", sans-serif;
  }
  label {
    padding-top: 10px;
    margin-top: 0.5rem;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 0.2rem;
  }
  form {
    margin-top: -4.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1a1a1a9c;
    width: 32rem;
    height: auto;
    border-radius: 20px;
  }
  input {
    width: 250px;
    margin-top: 0.3rem;
    margin-bottom: 0.5rem;
    padding: 10px;
    border: 0.1px solid #dfdfdf;
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(235, 235, 235, 0.606);
    &:focus {
      outline: none;
    }
  }
  button {
    margin: 25px 0 25px 0;
    background-color: #ededed;
    padding: 5px 20px;
    color: #414141;
    letter-spacing: 2px;
    text-decoration: none;
    font-size: 15px;
    transition: 0.1s;
    border-radius: 5px;
    border: none;
    left: 70px;
    box-shadow: 0 5px 10px rgba(255, 255, 255, 0.568);
    &:hover {
      color: black;
      box-shadow: 0 0 10px #8893b1b5, 0 0 10px #8893b1b5, 0 0 15px #8893b1b5;
      transition: 0.8s;
      border: none;
      color: white;
      background-color: #8893b1b5;
      cursor: pointer;
    }
  }
  span {
    color: black;
  }
  .linea{ 
    width: 15rem;
  }
  h1 {
    color: #fff;
    padding: 10px;
  }
  .link-to-signup {
    align-self: flex-end;
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    transition: 0.2s ease-in-out;
    letter-spacing: 0.2rem;
  }
  .link-to-signup:hover {
    cursor: pointer;
    color: white;
    background: #8893b1b5;
    border-radius: 10px;
  }
  .error {
    color: red;
  }
  @media (max-width: 455px) {
    form {
      width: 20rem;
    }
    input {
      width: 180px;
    }
  }
`;

const AuthDiv = styled.div`
  margin-top: -6.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1a1a9c;
  width: 32rem;
  height: 15rem;
  border-radius: 20px;
  margin: 0px auto;
  position: relative;
  h1 {
    position: relativo;
    line-height: 11rem;
  }
  button {
    margin-top: -3rem;
    background-color: #ededed;
    padding: 5px 20px;
    color: #414141;
    letter-spacing: 2px;
    text-decoration: none;
    font-size: 15px;
    transition: 0.1s;
    border-radius: 5px;
    border: none;
    left: 70px;
    box-shadow: 0 5px 10px rgba(255, 255, 255, 0.568);
    &:hover {
      color: black;
      box-shadow: 0 0 10px #8893b1b5, 0 0 10px #8893b1b5, 0 0 15px #8893b1b5;
      transition: 0.8s;
      border: none;
      color: white;
      background-color: #8893b1b5;
      cursor: pointer;
    }
  }
`;
