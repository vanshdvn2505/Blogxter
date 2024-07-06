import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom'

function Header() {

    const [photo, setPhoto] = useState(null);

    useEffect(()=> {
        setPhoto(JSON.parse(localStorage.getItem('photo')));
    }, [])

  return (
        <div className='w-full h-[10vh] bg-[#201f1f] flex justify-between items-center '>
            <div className='w-1/5 h-full  flex justify-start items-center pl-2'>
                <img src= {logo} className='bg-cover bg-no-repeat w-1/5'/>
                <p className='text-white pl-4 text-4xl text-center pb-1'>Blogxter</p>
            </div>
            <div className='w-2/5 h-full flex justify-evenly items-center text-white'>
                <Link to = '/blog/'><span className='text-2xl'><i className="fa-solid fa-house"></i></span></Link>
                <Link to='/blog/friends'><span className='text-2xl'><i className="fa-solid fa-user-group"></i></span></Link>
                <Link to = '/blog/create'><span className='text-2xl'><i className="fa-solid fa-plus"></i></span></Link>

            </div>
            <div className='w-1/5 h-full flex justify-evenly items-center text-white'>
                <Link to = '/blog/chat'><span className='text-3xl'><i className="fa-solid fa-comments"></i></span></Link>
                <Link to = '/blog/account'>
                    <div className='h-[5vh] w-[5vh] rounded-full'>
                    <img src={photo} 
                    className='rounded-full bg-cover h-full w-full'/>
                    </div>
                </Link>
            </div>
        </div>
  )
}

export default Header