import React, { useRef } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function AddNote() {
    
    const [imageUrl, setImageUrl] = useState(null);
    const [audio, setAudio] = useState(null);
    const [button, setButton] = useState('Play');
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const audioRef = useRef(null);
    const [filename, setFileName] = useState("");
    const [audioName, setAudioName] = useState("");
    const navigate = useNavigate();

    const handle = (e) => {
        const selectedImage = e.target.files[0];
        setPhoto(selectedImage);
        setImageUrl(URL.createObjectURL(selectedImage));
    };
    const handleAudio = (e) => {
        const selectedAudio = e.target.files[0];
        setAudioURL(URL.createObjectURL(selectedAudio));
        setAudio(selectedAudio);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setButton('Play');
        }
    };

    const play = () => {
        if (audio) {
            if (!audioRef.current) {
                audioRef.current = new Audio(audioURL);
            }

            if (button === 'Play') {
                audioRef.current.play();
                setButton('Pause');
            } else {
                audioRef.current.pause();
                setButton('Play');
            }
        }
    }
    
    const add = async (e) => {
        e.preventDefault();

        try {
            const email = JSON.parse(localStorage.getItem('email'));
            const name = JSON.parse(localStorage.getItem('name'));
            const userImg = JSON.parse(localStorage.getItem('photo'));

            const note = {
                id: name + Date.now(),
                email,
                name,
                userImg,
                content,
                audioName,
                filename,

            }
            if(photo){
                let formData = new FormData()
                const filename = Date.now() + photo.name;
                formData.append('img', filename);
                formData.append('file', photo)
                setFileName(filename);
                note.filename = filename;
                try{
                   const upload = await axios.post("http://localhost:5000/blog/upload", formData); 
                }
                catch(error){
                    console.log(error);
                }
              }
              else{
                note.filename = "blogxter.jpeg";
              }
              if(audio){
                let formData = new FormData()
                const audioName = Date.now() + audio.name;
                formData.append('audio', audioName);
                formData.append('file', audio)
                setAudioName(audioName);
                note.audioName = audioName;
                try{
                   const upload = await axios.post("http://localhost:5000/blog/uploadAudio", formData); 
                }
                catch(error){
                    console.log(error);
                }
              }
            const result = await axios.post("http://localhost:5000/blog/addNote", note);
            navigate('/blog/home');
        }
        catch(error){
            console.log(error);
            alert("Something Went Wrong!");
            navigate('/blog/home');
        }
    }

    return (
    <div className='w-[80%] h-[90vh] bg-[#161616] flex flex-col'>
        <div className='w-[90%] h-[15%] ml-2 border-b-2 border-white flex justify-start items-center text-white text-3xl font-bold'>
            Add Note
        </div>
        <div className='w-[90%] h-[85%] flex justify-center items-center ml-2'>
            <div className='w-[50%] h-[100%] flex flex-col justify-center items-center'>
                <div className='w-[90%] h-[75%] border-2 rounded-3xl mb-4' style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className='w-[90%] h-[15%] flex justify-center items-center'>
                    <input type="file" name = "file" className ="text-sm text-white
                        file:mr-5 file:py-2 file:px-6
                        file:rounded-full file:border-0
                        file:text-sm file:font-medium
                      file:bg-[#303031] file:text-white
                        hover:file:cursor-pointer hover:file:bg-amber-50
                      hover:file:text-black"
                      onChange={handle}   
                    />
                </div>
            </div>
            <div className='w-[50%] h-[100%]'>
                <div className='w-[90%] h-[30%] flex flex-col justify-evenly items-center'>
                    <input type="file" name = "file" className ="text-sm text-white
                        file:mr-5 file:py-2 file:px-6
                        file:rounded-full file:border-0
                        file:text-sm file:font-medium
                      file:bg-[#303031] file:text-white
                        hover:file:cursor-pointer hover:file:bg-amber-50
                      hover:file:text-black"
                      onChange={handleAudio}   
                    />
                    <button className='w-[40%] h-[25%] rounded-full bg-[#81ffd9]'
                    onClick = {play}>
                        {button} Audio
                    </button>
                </div>
                <div className='h-[45%] w-[90%] mt-5 flex justify-center items-center'>
                    <div className='h-[90%] w-[90%] bg-yellow-100 rounded-3xl'>
                        <textarea name="content" className='h-full w-full rounded-3xl pt-3 pl-4 text-xl'
                        placeholder='Write Text (Upto 32 Characters)' onChange={(e) => setContent((e.target.value).substring(0, 32))}></textarea>
                    </div>
                </div>
                <div className='h-[15%] w-[90%] flex justify-evenly items-center'>
                    <Link to='/blog/home'><button className='w-[25vh] h-[8vh] bg-[#303031] rounded-lg text-white text-xl font-medium mt-2'>
                      Cancel
                    </button></Link>
                    <button className='w-[40%] h-[70%] bg-[#81ffd9] rounded-lg text-black text-xl font-medium mt-2'
                        onClick={add}
                    >
                      Add Note
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddNote