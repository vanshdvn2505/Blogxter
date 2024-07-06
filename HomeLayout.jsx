import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './src/components/Header'
import SideBar from './src/components/SideBar'

function HomeLayout() {
  return (
    <>
          <Header />
          <div className='flex'>
            <SideBar />
            <Outlet />
          </div>
    </>
  )
}

export default HomeLayout