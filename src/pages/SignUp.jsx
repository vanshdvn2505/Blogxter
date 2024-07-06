    import React from 'react'
    import logo from '../assets/logo.svg'
    import { Link, useNavigate } from 'react-router-dom'
    import axios from 'axios'
    import { useState } from 'react'


    function SignUp() {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPass] = useState('');
        const navigate = useNavigate();

        const submit = async (e) => {
            e.preventDefault()
            try {
                const result = await axios.post("http://localhost:5000/signup", { name, email, password });
                localStorage.setItem('name', JSON.stringify(name));
                localStorage.setItem('email', JSON.stringify(email));
                navigate('/blog');
            } catch (error) {
                alert(error.response.data.error);
                navigate('/signup');
            }
        }

    return (
        <>
            <div className='w-full h-screen flex justify-center items-center'>
                <div className='w-3/6 h-screen bg-[url(https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg)] bg-cover bg-no-repeat'>
                        <div className='w-full h-full relative z-10 bg-gradient-to-b from-transparent to-black flex flex-col justify-center items-start
                        text-white font-bold'>
                            <h1 className='text-5xl pl-3'>Keep It Special</h1>
                            <br></br>
                            <h3 className='text-4xl pl-3'>Capture your personal memories in</h3>
                            <h3 className='text-4xl pl-3'>a unique way, anywhere.</h3>
                        </div>
                </div>
                <div className='w-3/6 h-screen bg-[#161616] flex flex-col justify-center items-center'>
                        <div className='w-4/5 h-4/5 flex flex-col justify-evenly items-center'>
                            <img src={logo} alt="" className='w-40'/>
                            <div className='w-4/5 h-2/5  flex flex-col justify-evenly items-center'>
                                <input type="text"
                                    required
                                    placeholder='Username'
                                    className='w-4/5 h-1/5 rounded-md p-2'
                                    name = 'name'
                                    onChange = {(e) => setName(e.target.value)}
                                />
                                <input type="email"
                                    required
                                    placeholder='Email'
                                    className='w-4/5 h-1/5 rounded-md p-2'
                                    name = 'email'
                                    onChange = {(e) => setEmail(e.target.value)}
                                />
                                <input type="password"
                                    required
                                    placeholder='Password'
                                    className='w-4/5 h-1/5 rounded-md p-2'
                                    name = 'password'
                                    onChange = {(e) => setPass(e.target.value)}
                                />
                            </div>
                            <button
                            className='bg-[#81ffd9] text-[#161616] w-2/4 h-14 rounded-full font-medium'
                            onClick = {submit}
                            >
                                Sign Up
                            </button>
                            <Link to="/login" className='text-white'><p>Already have an account, Login</p></Link>
                        </div>
                </div>
            </div>
        </>
    )
    }

    export default SignUp