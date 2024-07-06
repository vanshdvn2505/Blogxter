import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import {format, parseISO} from 'date-fns'

function Home() {

  const [note, setNote] = useState([]);
  const [posts, setPosts] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [play, setPlay] = useState(false);
  const [sound, setSound] = useState(<i className="fa-solid fa-volume-high"></i>);
  const audioRef = useRef(null);
  const startRef = useRef(null);
  const timeoutRef = useRef(null);
  const remainingRef = useRef(10000);
  const [drop, setDrop] = useState(null);
  const [user, setUser] = useState(null);
  const [like, setLike] = useState("like");
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("Comments");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setPhoto(JSON.parse(localStorage.getItem('photo')));
    setUser(JSON.parse(localStorage.getItem('email')));
    async function fetchPosts(){
      try{
        const response = await axios.get('http://localhost:5000/blog/posts');
        setPosts(response.data);
      }
      catch(error){
        alert("Error Fetching Posts!!");
        console.log(error);
      }
    }
    async function fetchNotes(){
      const email = JSON.parse(localStorage.getItem('email'));
      try {
        const response = await axios.post('http://localhost:5000/blog/fetchNotes', {email});
        setNote(response.data);
      }
      catch(error){
        alert("Error Fetching Posts!!");
        console.log(error);
      }
    }
    fetchPosts();
    fetchNotes();
  }, [])

  const ReadMore = ({children}) => {
    const text = children;
    const [readMore, setReadMore] = useState(true);
    const toggle = () => {
      setReadMore(!readMore);
    };


    if(text.length < 400){
      return (
        <p>{text}</p>
      )
    }

    return (
      <p className='text'>
        {readMore ? text.slice(0, 400) : text}
        <span
          onClick={toggle}
          className='read'
          style={{color: 'lightblue', cursor: 'pointer'}}>
          {readMore ? "...Read More" : " Show Less"}
        </span>
      </p>
    )
  }

  const Popup = (i) => {
    setCurrentNote(i)
    setShowPopup(true);
    setSound(<i className="fa-solid fa-volume-high"></i>);
    setPlay(false);
    if (audioRef.current) {
      audioRef.current.src = `../uploadAudio/${i.audio}`;
      audioRef.current.play();
    }
    remainingRef.current = 10000;
    startRef.current = Date.now();
    timeoutRef.current = setTimeout(() => {
      closePopup();
    }, remainingRef.current);
  }

  const closePopup = () => {
    setShowPopup(false);
    setCurrentNote(null);
    if(audioRef.current){
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }

  const notePlay = () => {
    if(sound.props.className == 'fa-solid fa-volume-high'){
      audioRef.current.pause();
      setSound(<i className="fa-solid fa-volume-xmark"></i>);
    }
    else if(sound.props.className == 'fa-solid fa-volume-xmark'){
      if(!play){
        audioRef.current.play();
      }
      setSound(<i className="fa-solid fa-volume-high"></i>)
    }
  } 

  const pauseNote = () => {
      if(play){
        startRef.current = Date.now();
        if(audioRef.current && sound.props.className == 'fa-solid fa-volume-high'){
          audioRef.current.play();
        }
        timeoutRef.current = setTimeout(() => {
          closePopup();
        }, remainingRef.current)
      }
      else{
        clearTimeout(timeoutRef.current);
        remainingRef.current -= Date.now() - startRef.current;
        if(audioRef.current){
          audioRef.current.pause();
        }
      }
      setPlay(!play);
  }

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMM 'at' h:mm a");
    } catch (error) {
      console.error('Invalid date format:', error);
      return 'Invalid date';
    }
  };

  const dropdown = (id) => {
    setDrop(drop === id ? null : id);
  }

  async function deletePost(id){
    console.log(id);
    try {
      const response = await axios.delete('http://localhost:5000/blog/postDel', {data: {id}})
      location.reload();
    }
    catch(error){
      console.log(error);
      alert("Cannot Delete Post Try Again");
      setDrop(null);  
    }
  }

  const showComments = async (id) => {
    if(show == false){
      setShow(true);
      setComment("Close");
      try {
        const response = await axios.post('http://localhost:5000/blog/getComments', {id});
        setComments(response.data);
      }
      catch(error){
        console.log(error);
        alert("Error Fetching Comments!")  
      }
    }
    else{
      setShow(false);
      setComment("Comments");
      setComm(null);
    }
  }

  const postComment = async (id) => {
      const email = JSON.parse(localStorage.getItem('email'));
      if(content == ""){
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/blog/postComment', {email, content, id});
        setContent("");
        // location.reload();
      }
      catch(error){
        console.log(error);
        alert("Something Went Wrong!!")  
      }
  }

  return (
      <div className='w-[80%] h-[90vh] bg-[#161616] overflow-y-auto'>
        <audio ref={audioRef} />
        {showPopup && currentNote && (
          <div className='h-[100%] w-[100%] top-0 left-0 absolute z-10 backdrop-blur-sm flex justify-center items-center'>
            <button className='text-white text-3xl mr-5 mt-3 absolute top-0 right-0'
            onClick={closePopup}><i className="fa-solid fa-xmark"></i></button>
            <div className='h-[95%] w-[40%] relative z-2 rounded-xl bg-[#242526] flex flex-col justify-center items-center'>
                <div className='h-[10%] w-full absolute top-5 rounded-t-xl flex justify-center items-center'>
                    <div className='w-[15%] h-full'>
                        <img src={currentNote.userImg}
                        className='h-full w-full bg-cover rounded-full' />
                    </div>
                    <div className='w-[80%] h-full pl-4 text-white text-3xl flex justify-start items-center'> 
                        {currentNote.name}
                        <div className='h-full w-[40%] text-base flex justify-evenly items-center absolute right-0'>
                            <button onClick={pauseNote}>{play ? <i className="fa-solid fa-play"></i> : <i className="fa-solid fa-pause"></i>}</button>
                            <button onClick = {notePlay}>{sound}</button>
                        </div>
                    </div>
                </div>
                <div className='h-[10%] w-[70%] absolute bottom-10 rounded-xl bg-[#242526] opacity-80
                flex justify-center items-center text-white text-xl'> 
                      {currentNote.content}
                </div>
                <div className='w-full h-full rounded-xl'>
                    <img src={"../uploads/" + currentNote.photo} className='h-full w-full bg-cover rounded-xl' />
                </div>
            </div>
          </div>
        )}
        <div className='w-[95%] h-[40%] flex justify-center ml-7 items-center my-10 rounded-xl bg-[#242526] relative'>
              <div className='w-[20%] h-full flex justify-center items-center '>
                  <div className='h-[90%] w-[90%] bg-[#201f1f] border-[#b0b2b8] border-2 rounded-lg text-white'>
                        <div className='h-[75%] w-full rounded-tl-lg rounded-tr-lg border-b-2'>
                          <img src={photo}
                          className='h-full w-full bg-cover rounded-tl-lg rounded-tr-lg'/>
                        </div>
                        <div className='h-[25%] w-full flex justify-evenly items-center '>
                          <Link to = '/blog/note'><button
                            className='flex justify-evenly items-center h-[7vh] w-[25vh]'>
                            <span className='text-2xl'><i className="fa-solid fa-plus"></i></span><p>Add Note</p></button>
                          </Link>
                        </div>
                  </div>
              </div>
              <div className='h-full w-[80%] bg-[#242526] flex items-center justify-start overflow-x-auto rounded-xl'>
                  {note.map(i => (
                    <div key={i.id} className='h-[90%] w-[20%] relative flex-shrink-0 mx-5 rounded-lg'
                    onClick={() => Popup(i)}>
                        <img src={"../uploads/" + i.photo} alt="" className='h-full w-full rounded-lg bg-cover' />
                        <div className='h-[7vh] w-[7vh] bg-[#161616] rounded-full border-2 ml-1 mt-2 absolute top-0'>
                            <img src={i.userImg} alt="" className='w-full h-full bg-cover rounded-full'/>
                        </div>
                        <div className='h-[4vh] w-full text-white font-bold absolute bottom-0 flex justify-start items-center pl-1'>
                            {i.name}
                        </div>
                    </div>
                  ))}        
              </div>
        </div>
        <div className='w-[100%] h-[25%] flex justify-center items-center text-white rounded-lg'>
          <div className='w-[45%] h-full bg-[#242526] flex flex-col justify-center items-center rounded-lg'>
            <div className='w-[90%] h-[50%] border-b-2 border-white flex justify-evenly items-center'>
              <div className='h-[5vh] w-[5vh] rounded-full'>
                <img src={photo} 
                className='rounded-full bg-cover h-full w-full'/>
              </div>
              <input
              type="text"
              placeholder="What's on your mind"
              name = 'note'
              onChange = {(e) => setNote(e.target.value)}
              className='rounded-xl pl-2 w-[70%] h-[50%] text-black'
              />
            </div>
            <div className='w-full h-[50%] flex justify-center items-center'>
              <button className='w-[25%] h-[50%] hover:bg-[#303031] rounded-lg'>Create</button>
              <button className='w-[25%] h-[50%] hover:bg-[#303031] rounded-lg'>Cancel</button>
              <button className='w-[25%] h-[50%] hover:bg-[#303031] rounded-lg'>Post</button>
            </div>
          </div>
        </div>
        <div className='w-[100%] flex flex-col justify-center items-center'>
              {posts.map(post => (
                <div key = {post._id} className='bg-[#303031] m-10 min-h-[75vh] h-auto w-[80%] flex flex-col items-center
                rounded-xl'
                >
                  <div className='h-[15vh] w-[100%] rounded-t-xl flex border-b-2 border-[#b0b3b8]'>
                      <div className='h-[100%] w-[20%] flex justify-center items-center'>
                        <div className='rounded-full h-[80%] w-[50%]'>
                            <img src={post.userImg} alt="" className='rounded-full h-full w-full' />
                        </div>
                      </div>
                      <div className='h-full w-[60%] flex flex-col justify-center text-xl text-white'>
                          <p className='font-semibold'>{post.name}</p>
                          <p className='text-sm text-[#b0b3b8]'>{formatDate(post.date)}</p>
                      </div>
                      {user == post.email && (
                        <div className='w-[20%] h-full relative flex flex-col justify-center items-center text-white text-3xl'>
                          <button
                          onClick={() => dropdown(post._id)}
                          className='h-[8vh] w-[8vh] rounded-full hover:bg-[#343536]'><i className="fa-solid fa-ellipsis"></i>
                          </button>
                          {drop === post._id && (
                            <div className='w-[25vh] h-[10vh] top-16 right-16 flex justify-center items-center
                             rounded-xl rounded-tr-none bg-[#201f1f] absolute'>
                                <button className='w-[80%] h-[70%] text-2xl rounded-lg bg-[#303031]'
                                onClick={() => deletePost(drop)}>
                                  <i className="fa-regular fa-trash-can text-[#81ffd9]"></i> Delete
                                </button>
                            </div>
                          )}
                      </div>
                      )}
                  </div>
                  <div className='min-h-[10vh] text-white text-xl flex justify-center items-center'>
                    <ReadMore>{post.content}</ReadMore>
                  </div>
                  <div className='bg-[#201f1f] h-[50vh] w-[80%] rounded-xl pl-4 pt-4 flex flex-col justify-evenly items-center'>
                      <img src={"../uploads/" + post.photo} alt="" className='bg-cover h-[85%] w-auto' />
                  </div>
                  <div className='h-[10vh] w-[90%] flex justify-center items-center m-5 border-y-2 border-[#b0b2b8]'>
                    <div className='h-full w-[50%] flex justify-center items-center'>
                        <div className='h-[70%] w-[90%] bg-[#201f1f] rounded-full flex justify-evenly items-center'>
                            <div className='w-[50%] h-full rounded-full rounded-r-none flex justify-center items-center
                            text-white text-2xl border-r-2 border-[#b0b3b8]'>
                                <button><i className="fa-regular fa-thumbs-up"></i> Like</button>
                            </div>
                            <div className='w-[50%] h-full rounded-full rounded-l-none flex justify-center items-center
                            text-white text-xl'>
                                <button onClick={() => showComments(post._id)}>{comment}</button>
                            </div>
                        </div>
                    </div>
                    <div className='h-full w-[50%] flex justify-center items-center'>
                        <div className='h-[70%] w-full rounded-full bg-[#201f1f] flex justify-center items-center'>
                              <input type="text"
                              placeholder='Write Comments'
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              className='h-full w-[75%] rounded-l-full pl-4 outline-none
                              text-white border-r-2 border-[#b0b3b8] bg-[#201f1f]'/>
                              <button className='h-full w-[25%] rounded-r-full text-white
                              flex justify-center items-center'
                              onClick={() => postComment(post._id)}>Post</button>
                        </div>
                    </div>
                  </div>
                  {show && (
                    <div className='h-[30vh] w-[90%] bg-[#201f1f] flex flex-col justify-start items-center rounded-xl mb-4 overflow-y-auto'>
                      {comments.map(i => (
                        <div key={i.id} className='h-[10vh] w-[100vh] flex justify-evenly
                        items-center flex-shrink-0 m-5 rounded-xl bg-[#303031]'>
                              <div className='h-full w-[10%] rounded-l-xl
                              flex justify-center items-center'>
                                  <img src={"../uploads/" + i.photo}
                                  className='h-[80%] w-[75%] rounded-full bg-cover'/>
                              </div>
                              <div className='h-full w-[90%] rounded-r-xl'>
                                  <div className='h-[40%] w-full relative text-white text-xl font-semibold'>
                                      <p>{i.name}</p>
                                      <p className='absolute right-0 top-0 pr-3 text-[#b0b3b8]
                                      text-base'>{formatDate(i.time)}</p>
                                  </div>
                                  <div className='h-[60%] w-full text-white text-lg'>
                                      <p>{i.content}</p>
                                  </div>
                              </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
  )
}

export default Home