import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Friends() {

  const [add, setAdd] = useState([]);
  const [req, setReq] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const email = JSON.parse(localStorage.getItem('email'));
    async function addFriends(){
      try {
          const response = await axios.post('http://localhost:5000/blog/addFriend', {email});
          setAdd(response.data);
      }
      catch(error){
        console.log(error);
        alert("Something Went Wrong!");
      }
    }
    async function friendReq(){
      try {
          const response = await axios.post('http://localhost:5000/blog/friendReq', {email});
          setReq(response.data);
      }
      catch(error){
        console.log(error);
        alert("Something Went Wrong!");
      }
    }
    async function friendsAdd(){
      try {
          const response = await axios.post('http://localhost:5000/blog/friends', {email});
          setFriends(response.data);
      }
      catch(error){
        console.log(error);
        alert("Something Went Wrong!");
      }
    }
    addFriends();
    friendReq();
    friendsAdd();
  },[])

  async function sendReq(email){
      const userEmail = JSON.parse(localStorage.getItem('email'))
      try {
        const response = await axios.post('http://localhost:5000/blog/sendReq', {userEmail, email});
        location.reload();
      }
      catch(error){
          console.log(error);
          alert("Something Went Wrong!")
      }
  }
  async function decline(email){
    const userEmail = JSON.parse(localStorage.getItem('email'))
    try {
      const response = await axios.post('http://localhost:5000/blog/reqDecline', {userEmail, email})
      location.reload();
    } 
    catch(error){
      console.log(error);
      alert("Something Went Wrong!")
    }
  }
  async function accept(email, type){
    if(type == "Sent"){
      return;
    }

    const userEmail = JSON.parse(localStorage.getItem('email'))
    try {
      const response = await axios.post('http://localhost:5000/blog/reqAccept', {userEmail, email});
      location.reload();
    }
    catch(error){
      console.log(error);
      alert("Something Went Wrong!")
    }
  }
  async function remove(email){
    const userEmail = JSON.parse(localStorage.getItem('email'))
    try {
      const response = await axios.post('http://localhost:5000/blog/remove', {userEmail, email})
      location.reload();
    } 
    catch(error){
      console.log(error);
      alert("Something Went Wrong!")
    }
  }  

  return (
    <div className='w-[80%] h-[90vh] bg-[#161616] flex flex-col justify-evenly items-center'>
        <div className='w-full h-[100%] flex justify-evenly items-center'>
          <div className='h-[90%] w-[43%] bg-[#201f1f] rounded-xl flex flex-col '>
              <div className='h-[50%] w-full rounded-t-xl border-b-2'>
                  <div className='h-[17%] w-full rounded-t-xl flex justify-start items-center
                  pl-4 text-white text-2xl border-b-2'>
                      Add Friends
                  </div>
                  <div className='h-[83%] w-full flex flex-col justify-start items-center overflow-y-auto'>
                      {add.map(i => (
                        <div key = {i.id} className='w-[100%] flex flex-col flex-shrink-0'>
                            <div className='h-[10vh] w-[90%] m-2 bg-[#161616] flex flex-shrink-0 rounded-lg'>
                                <div className='h-full w-[30%] rounded-l-lg flex items-center justify-center'>
                                      <img src={"../uploads/" + i.photo} className='rounded-full w-[9vh] h-[9vh] bg-cover'/>
                                </div>
                                <div className='h-full w-[70%] rounded-r-lg'>
                                      <div className='h-[50%] w-[100%] pl-2 pt-1 text-white'>
                                          {i.name}
                                      </div>
                                      <div className='h-[50%] w-full flex justify-start items-center'>
                                            <button className='w-[40%] h-[75%] bg-[#81ffd9] rounded-xl
                                             flex justify-center items-center'
                                             onClick={() => sendReq(i.email)}>Add</button>
                                      </div>
                                </div>
                            </div>
                        </div>
                      ))}
                      
                  </div>
              </div>
              <div className='h-[50%] w-full rounded-b-xl'>
                  <div className='h-[17%] w-full flex justify-start items-center
                  pl-4 text-white text-2xl border-b-2'>
                    Friend Requests
                  </div>
                  <div className='h-[83%] w-full flex flex-col justify-start items-center overflow-y-auto'>
                      {req.map(i => (
                        <div key = {i.id} className='w-[100%] flex flex-col flex-shrink-0'>
                            <div className='h-[10vh] w-[90%] m-2 bg-[#161616] flex flex-shrink-0 rounded-lg'>
                                <div className='h-full w-[30%] rounded-l-lg flex items-center justify-center'>
                                      <img src={"../uploads/" + i.photo}  alt={`${i.name}'s profile`} className='rounded-full w-[9vh] h-[9vh] bg-cover'/>
                                </div>
                                <div className='h-full w-[70%] rounded-r-lg'>
                                      <div className='h-[50%] w-[100%] pl-2 pt-1 text-white'>
                                          {i.name}
                                      </div>
                                      <div className='h-[50%] w-full flex justify-evenly items-center'>
                                            <button className='w-[40%] h-[75%] bg-[#81ffd9] rounded-xl
                                             flex justify-center items-center'
                                             onClick={() => accept(i.email, i.type)}>{i.type}</button>
                                            <button className='w-[40%] h-[75%] bg-[#81ffd9] rounded-xl
                                             flex justify-center items-center'
                                             onClick={() => decline(i.email)}>Cancel</button>
                                      </div>
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>
          </div>
          <div className='h-[90%] w-[43%] bg-[#201f1f] rounded-xl'>
                <div className='h-[15%] w-[100%] flex justify-start items-center pl-4 text-2xl rounded-t-xl
                font-semibold text-white border-b-2'>
                    Your Friends
                </div>
                <div className='h-[85%] w-[100%] flex flex-col justify-start items-center rounded-b-xl overflow-y-auto'>
                      {friends.map(i => (
                        <div key = {i.id} className='w-[100%] flex flex-col flex-shrink-0'>
                            <div className='h-[10vh] w-[90%] m-2 bg-[#161616] flex flex-shrink-0 rounded-lg'>
                                <div className='h-full w-[30%] rounded-l-lg flex items-center justify-center'>
                                      <img src={"../uploads/" + i.photo}  alt={`${i.name}'s profile`} className='rounded-full w-[9vh] h-[9vh] bg-cover'/>
                                </div>
                                <div className='h-full w-[70%] rounded-r-lg'>
                                      <div className='h-[50%] w-[100%] pl-2 pt-1 text-white'>
                                          {i.name}
                                      </div>
                                      <div className='h-[50%] w-full flex justify-evenly items-center'>
                                            <button className='w-[40%] h-[75%] bg-[#81ffd9] rounded-xl
                                             flex justify-center items-center'
                                             onClick={() => remove(i.email)}>Remove</button>
                                      </div>
                                </div>
                            </div>
                        </div>
                      ))}
                </div>
          </div>
        </div>
    </div>
  )
}

export default Friends