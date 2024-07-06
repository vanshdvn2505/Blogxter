import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Layout from '../Layout.jsx'
import Login from './pages/Login.jsx' 
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import HomeLayout from '../HomeLayout.jsx'
import Friends from './pages/Friends.jsx'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import Create from './pages/Create.jsx'
import Account from './pages/Account.jsx'
import EditProfile from './pages/EditProfile.jsx'
import AddNote from './pages/AddNote.jsx'
import Chat from './pages/Chat.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element = {<Layout />} >
      <Route path = '' element = {<SignUp />} />
      <Route path = '/login' element = {<Login />} />
      <Route path = '/signup' element = {<SignUp />} />
      <Route path = '/blog' element = {<HomeLayout />}>
        <Route path = '/blog/' element = {<Home />} />
        <Route path = '/blog/home' element = {<Home />} />
        <Route path = '/blog/friends' element = {<Friends />} />
        <Route path = '/blog/create' element = {<Create />} />
        <Route path = '/blog/account' element = {<Account />} />
        <Route path = '/blog/edit' element = {<EditProfile />} />
        <Route path = '/blog/note' element = {<AddNote />} />
        <Route path = '/blog/chat' element = {<Chat />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router = {router} />
)
