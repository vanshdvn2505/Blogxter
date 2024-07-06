import React from 'react'
import { Link } from 'react-router-dom'

function SideBar() {
  return (
    <div className='w-[20%] h-[90vh] bg-[#161616] text-white border-r-2 border-[#201f1f]'>
            <Link to = '/blog/'>
              <div className='text-2xl flex justify-start items-center h-[10%] w-[85%] bg-[#201f1f] rounded-xl mt-10 ml-2 mb-2'>
              <i className="fa-solid fa-house p-2"></i>Home
              </div>
            </Link>
            <Link to = '/blog/friends'>
              <div className='text-2xl flex justify-start items-center h-[10%] w-[85%] bg-[#201f1f] rounded-xl ml-2  mb-2'>
                  <i className="fa-solid fa-user-group p-2"></i>Friends
              </div>
            </Link>
            <Link to = '/blog/create'>
              <div className='text-2xl flex justify-start items-center h-[10%] w-[85%] bg-[#201f1f] rounded-xl ml-2 mb-2'>
                <i className="fa-solid fa-plus p-2"></i>Create
              </div>
            </Link>
            <Link to = '/blog/chat'>
              <div className='text-2xl flex justify-start items-center h-[10%] w-[85%] bg-[#201f1f] rounded-xl ml-2 mb-2'>
                <i className="fa-solid fa-comments p-2"></i>Chat
              </div>
            </Link>
            <Link to = '/blog/account'>
              <div className='text-2xl flex justify-start items-center h-[10%] w-[85%] bg-[#201f1f] rounded-xl ml-2 mb-2'>
                <i className="fa-solid fa-circle-user p-2"></i>Account
              </div>
            </Link>
    </div>
  )
}

export default SideBar