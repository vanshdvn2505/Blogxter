import React from 'react'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import { nanoid } from 'nanoid'

function Chat() {

    const [friends, setFriends] = useState([]);
    const [current, setCurrent] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState(null);

    useEffect(() => {
        const email = JSON.parse(localStorage.getItem('email'))
        const chat = () => {
            const newSocket = io('http://localhost:3000');
            setSocket(newSocket);

            newSocket.emit('login', email);
            newSocket.on('receive', (data) => {
                setMessages(prev => [...prev, {
                    id: data.id,
                    users: data.users,
                    sender: data.sender,
                    content: data.content,
                    time: data.time,
                    // type: data.chat.type,
                    // read: data.chat.read
                }]);
            })
        }     
        const fetchFriends = async () => {
            const email = JSON.parse(localStorage.getItem('email'));
            try {
                const response = await axios.post('http://localhost:5000/blog/chatFriends', {email});
                setFriends(response.data);
            }
            catch(error){
                console.log(error);
                alert("Something Went Wrong!");    
            }
        }
        fetchFriends();
        chat();
    }, [])

    const chatChange = async (i) => {
        const email = JSON.parse(localStorage.getItem('email'));
        try {
            const response = await axios.post("http://localhost:5000/blog/chatHistory", {
                users: [email, i],
            });
            setHistory({
                id: response.data.id,
                users: response.data.users,
                chat: response.data.chat
            });
        } 
        catch(error){
            console.log(error);
            alert("Something Went Wrong!")    
        }
    }
    
    const handleChat = (i) => {
        setCurrent(i);
        setHistory(null);
        setMessages([]);
        chatChange(i.email);
    }

    const send = () => {
        const email = JSON.parse(localStorage.getItem('email'));
        if(input){
            const ID = nanoid();
            const msg = {
                id: ID,
                content: input,
                sender: email,
                from : email,
                to: current.email,
                // type: "Send",
            }
            socket.emit('private', msg)
            const users = [email, current.email];
            setMessages(prev => [...prev, {
                id: msg.id,
                users,
                sender: email,
                content: msg.content,
                time: Date.now(),
                // type: msg.type,
                // read: "NA"
            }]);
            setInput("")
        }
    }

  return (
    <div className='w-[80%] h-[90vh] bg-[#161616] flex'>
        <div className='w-[60%] h-full border-[#201f1f] border-r-2'>
            <div className='h-[15%] w-full flex  border-b-2 border-white'>
                <div className='h-full w-[20%] flex justify-center items-center'>
                    {(current == null) ? "" : <img src={"../uploads/" + current.photo}
                     className='w-[60%] h-[85%] border-2 border-white rounded-full bg-cover'/> }
                </div>
                <div className='h-full w-[80%] flex justify-start items-center pl-4 text-white text-2xl'>
                    <p className='text-3xl text-white font-semibold'>{(current == null) ? "" : current.name}</p>
                </div>
            </div>
            <div className='h-[75%] w-full flex flex-col overflow-y-auto'>
                {history && (
                    history.chat.map(i => (
                        (i.sender == JSON.parse(localStorage.getItem('email'))) ? <div key={i.time} className='min-h-[5vh] h-auto w-full flex-shrink-0 my-5  flex justify-end items-center text-white'>
                        <p className='h-auto w-auto max-w-[60%]  px-3 py-3 mr-3 rounded-2xl flex justify-center items-center
                         bg-emerald-500'>{i.content}</p></div>
                     : <div  key={i.time} className='min-h-[3vh] h-auto w-full text-white flex-shrink-0 my-5 flex justify-start'>
                        <p className='h-auto w-auto max-w-[60%] px-3 py-3 ml-3 rounded-2xl flex justify-center items-center
                         bg-emerald-500'>{i.content}</p></div>
                    ))
                )}
                {messages.map(i => (
                    (i.sender == JSON.parse(localStorage.getItem('email'))) ? <div key={i.id} className='min-h-[5vh] h-auto w-full flex-shrink-0 my-5  flex justify-end items-center text-white'>
                        <p className='h-auto w-auto max-w-[60%]  px-3 py-3 mr-3 rounded-2xl flex justify-center items-center
                         bg-emerald-500'>{i.content}</p></div>
                     : <div  key={i.id} className='min-h-[3vh] h-auto w-full text-white flex-shrink-0 my-5 flex justify-start'>
                        <p className='h-auto w-auto max-w-[60%] px-3 py-3 ml-3 rounded-2xl flex justify-center items-center
                         bg-emerald-500'>{i.content}</p></div>
                ))}
            </div>
            <div className='h-[10%] w-full flex justify-evenly items-start'>
                <input type="text"
                className='h-[70%] w-[60%] pl-3 rounded-full outline-none'
                placeholder='Message'
                onChange={(e) => setInput(e.target.value)}
                value={input}
                />
                <button className='h-[70%] w-[20%] bg-[#81ffd9] text-xl flex justify-center items-center rounded-full'
                onClick={send}>
                    Send
                </button>
            </div>
        </div>
        <div className='w-[40%] h-full'>
            <div className='h-[15%] w-full flex justify-start items-center pl-3 border-b-2 border-white'>
                <p className='text-white text-4xl'>Chat</p>
            </div>
            <div className='h-[85%] w-full flex flex-col justify-start items-center overflow-y-auto'>
                {friends.map(i => (
                    <button key={i.id} className='h-[15%] w-[80%] bg-[#201f1f] my-4 flex flex-shrink-0 rounded-2xl'
                    onClick={() => handleChat(i)}>
                        <div className='h-full w-[25%] rounded-l-2xl flex justify-center items-center'>
                            <img src={"../uploads/" + i.photo} className='w-[80%] h-[85%] border-2 border-white rounded-full bg-cover'/>
                        </div>
                        <div className='h-full w-[75%] pl-3 rounded-r-2xl flex justify-start items-center'>
                            <p className='text-2xl text-white font-semibold'>{i.name}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Chat