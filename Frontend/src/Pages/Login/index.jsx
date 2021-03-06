import { useState } from 'react';
import { sessionService } from '../../services';
import {useNavigate} from 'react-router-dom'
import Swal from "sweetalert2";

const Login = () => {
    let navigate = useNavigate();
    let [input, setInput] = useState({
        email: {
            value: '',
            error: null,
        },
        password: {
            value: '',
            error: null,
        }
    })

    const handleInputChange = (e) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: {
                value: e.target.value,
                error: null
            }
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(input);
        
        let error = false
        Object.keys(input).forEach(key => {
            if (input[key].value.length === 0) {
                error = true;
                setInput((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        error: "Completar este campo"
                    }
                }))
            }
        })
        if (!error) {
            sessionService.login({body:{
                email:input.email.value,
                password:input.password.value
            },callbackSuccess:callbackSuccessLogin,callbackError:callbackErrorLogin})
        }
    }
    /*CALLBACKS */
    const callbackSuccessLogin = (response) =>{
        if(process.env.REACT_APP_AUTHENTICATION_MODE==="LOCAL_STORAGE"){
            let user = response.data.payload.user;
            localStorage.setItem('sessionToken',response.data.payload.token)
            localStorage.setItem('user',JSON.stringify(user));
        }else if(process.env.REACT_APP_AUTHENTICATION_MODE==="COOKIE"){
            let user = response.data.payload.user;
            localStorage.setItem('user',JSON.stringify(user));
        }
       let userLocal = JSON.parse(localStorage.getItem('user')); 
        Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: userLocal.first_name? userLocal.first_name +' '+ userLocal.last_name : "Administrador",
            timer:5000
        })

        setTimeout(function(){
            window.location.replace('/')
        }, 2000);

    }
    const callbackErrorLogin = (error) =>{
        Swal.fire({
            icon: "error",
            title: "Usuario no registrado",
            text: "Por favor complete sus datos",
            timer:5000
        })
        setTimeout(function(){
            window.location.replace('/register')
        }, 2000);
        
    }
    return <>
        <div>
            <p>Identif??cate</p>
            <form>
                <div>
                    <label>Email</label>
                    <input value={input.email.value} name="email" onChange={handleInputChange} />
                    {input.email.error && <p>{input.email.error}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={input.password.value} onChange={handleInputChange} />
                    {input.password.error && <p>{input.password.error}</p>}
                    <button onClick={handleSubmit}>Ingresar</button>
                </div>
            </form>
        </div>
    </>
}


export default Login;   