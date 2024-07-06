import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

    function Account() {

        const navigate = useNavigate();
        const [detail, setDetail] = useState({});
        const [about, setAbout] = useState({});
        const [photo, setPhoto] = useState(null);

        useEffect(() => {
            const name = JSON.parse(localStorage.getItem('name'));
            const email = JSON.parse(localStorage.getItem('email'));
            const result = {
                name,email
            }
            setDetail(result);
        }, [])

        const logout = (e) => {
            e.preventDefault();
            localStorage.clear();
            navigate('/signup');
        }

        useEffect(() => {
            const email = JSON.parse(localStorage.getItem('email'));
            async function profile(){
                try {
                    const result = await axios.post('http://localhost:5000/blog/profile', {email});
                    console.log("HELLO " , JSON.stringify(result.data));
                    setAbout(result.data);
                    setPhoto("../uploads/" + result.data.imgFile);
                    localStorage.setItem('photo', JSON.stringify("../uploads/" + result.data.imgFile));
                }
                catch(error){
                    console.log(error)
                    alert("Something Went Wrong!");
                }
            }
            profile();
        }, [])

  return (
    <div className='w-[80%] h-[90vh] bg-[#161616]'>
        <div className='w-[90%] h-[15%] ml-4 border-b-2 border-white flex justify-start items-center text-white text-3xl font-bold'>
            Account
        </div>
        <div className='w-[90%] h-[30%] ml-4 border-b-2 border-white flex justify-evenly items-center text-white text-3xl font-bold '>
            <div className='w-[20%] h-[90%] flex justify-center items-center'>
                <div className='h-full w-[90%] rounded-full border-2 border-white text-white'>
                    <img
                     className='h-full w-full rounded-full bg-cover'
                     src={photo} alt=""/>
                </div>
            </div>
            <div className='w-[50%] h-[90%] text-white text-5xl flex flex-col justify-evenly items-center pl-7'>
                <h1>{detail.name}</h1>
                <p className='text-sm'>{detail.email}</p>
            </div>
            <div className='w-[20%] h-[90%] flex flex-col justify-evenly items-center text-base'>
                <Link to = '/blog/create'><button className='w-[20vh] h-[8vh] hover:bg-[#303031] rounded-lg'>Create</button></Link>
                <Link to = '/blog/edit'><button className='w-[20vh] h-[8vh] hover:bg-[#303031] rounded-lg'>Edit Profile</button></Link>
            </div>
        </div>
        <div className='w-[90%] h-[50%] flex justify-evenly items-center mt-4'>
            <div className='w-[45%] h-[90%] bg-[#303031] rounded-3xl flex flex-col pl-5 py-5'>
                <div className='text-white text-xl my-5'>
                    Age : {about.age}
                </div>
                <div className='text-white text-xl my-5'>
                    DOB : {about.dob}
                </div>
                <div className='text-white text-xl my-5'>
                    Height : {about.height}
                </div>
            </div>
            <div className='w-[45%] h-[90%] flex flex-col justify-evenly items-center'>
                <div className='w-full h-[70%] bg-[#303031] rounded-3xl flex flex-col pl-5 py-5'>
                    <div className='text-white text-xl my-5'>
                        From : {about.from}
                    </div>
                    <div className='text-white text-xl my-5'>
                        Workplace : {about.work}
                    </div>
                </div>
                <button
                className='w-[50%] h-[25%] bg-[#81ffd9] rounded-lg text-black text-xl font-medium mt-2'
                onClick={logout}
                >
                LogOut
                </button>
            </div>
        </div>
    </div>
  )
}

export default Account