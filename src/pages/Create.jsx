import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Create() {

  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [filename, setFileName] = useState("");

  const navigate = useNavigate();

  const handle = (e) => {
    const selectedImage = e.target.files[0];
    setPhoto(selectedImage);
    setImageUrl(URL.createObjectURL(selectedImage));
  };

  const create = async (e) => {
    e.preventDefault();

    try{
      const email = JSON.parse(localStorage.getItem('email'));
      const name = JSON.parse(localStorage.getItem('name'));
      const img = JSON.parse(localStorage.getItem('photo'));

      let post = {
        email,
        name,
        content,
        filename,
        img
      }

      if(photo){
        let formData = new FormData()
        const filename = Date.now() + photo.name;
        formData.append('img', filename);
        formData.append('file', photo)
        setFileName(filename);
        post.filename = filename;
        try{
           const upload = await axios.post("http://localhost:5000/blog/upload", formData); 
        }
        catch(error){
            console.log(error);
        }
      }
      const result = await axios.post("http://localhost:5000/blog/post", post);
      navigate('/blog/home');
    }
    catch(error){
      console.log(error)
      alert('Blog Cannot Be Created');
      navigate('/blog/home')
    }

  }
  return (
    <div className='w-[80%] h-[90vh] bg-[#161616] flex flex-col'>
        <div className='w-[90%] h-[15%] ml-2 border-b-2 border-white flex justify-start items-center text-white text-3xl font-bold'>
            Create
        </div>
        <div className='w-[90%] h-[75%] flex justify-evenly items-center'>
            <div className='w-[50%] h-[100%] flex flex-col justify-evenly items-center'>
                <h3 className='text-2xl text-white border-b-2 p-4'>Write Content</h3>
                <textarea name="content" className='h-[60%] w-[80%] p-4 rounded-2xl text-xl'
                placeholder='Enter Text'
                  onChange={(e) => setContent(e.target.value)}
                >
                </textarea>
            </div>
            <div className='w-[50%] h-[100%] flex flex-col justify-evenly items-center'>
                <input type="file" name = "file" className ="text-sm text-white
                        file:mr-5 file:py-2 file:px-6
                        file:rounded-full file:border-0
                        file:text-sm file:font-medium
                      file:bg-[#303031] file:text-white
                        hover:file:cursor-pointer hover:file:bg-amber-50
                      hover:file:text-black"
                      onChange={handle}   
                />
                <div className='w-[65%] h-[60%] rounded-3xl border-2 border-white text-white' style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                </div>
            </div>
        </div>
            <div className='w-[90%] h-[15%] flex justify-evenly items-center pb-2'>
                  <Link to='/blog/home'><button className='w-[40vh] h-[8vh] bg-[#303031] rounded-lg text-white text-xl font-medium mt-2'>
                      Cancel
                  </button></Link>
                  <button className='w-[30%] h-[70%] bg-[#81ffd9] rounded-lg text-black text-xl font-medium mt-2'
                    onClick={create}
                  >
                      Create
                  </button>
            </div>
    </div>
  )
}

export default Create