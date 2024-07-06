import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {

    const [age, setAge] = useState('');
    const [dob, setDOB] = useState('');
    const [height, setHeight] = useState('');
    const [from, setFrom] = useState('');
    const [work, setWork] = useState('');
    const [image, setImage] = useState({});
    const [filename, setFileName] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const email = JSON.parse(localStorage.getItem('email'));
            let edited = {
                email,
                age,
                dob,
                height,
                from,
                work,
                filename
            }
            if(image){
                let formData = new FormData()
                const filename = Date.now() + image.name;
                console.log("NAME" + filename);
                formData.append('img', filename);
                formData.append('file', image)
                setFileName(filename);
                edited.filename = filename;
                console.log("IMAGE" + image);
                try{
                   const upload = await axios.post("http://localhost:5000/blog/upload", formData); 
                   localStorage.setItem('photo', JSON.stringify("../uploads/" + filename));
                }
                catch(error){
                    console.log(error);
                }
            }
            const result = await axios.post("http://localhost:5000/blog/edit", edited);
            navigate('/blog/account');
        }
        catch (error) {
            console.log(error)
            alert('Something Went Wrong!');
            navigate('/blog/account')
        }
    }
    const handle = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        setImageUrl(URL.createObjectURL(selectedImage));
    };

  return (
    <div className = 'w-[80%] h-[90vh] bg-[#161616]'>
        <div className='w-[90%] h-[15%] ml-4 border-b-2 border-white flex justify-start items-center text-white text-3xl font-bold'>
            Edit Profile
        </div>
        <div className='w-[95%] h-[80%] mt-2 flex justify-start items-center'>
            <div className='w-[45%] h-full  mr-5 flex flex-col justify-evenly items-center'>
                <div className='w-[90%] h-[18%] bg-[#303031] flex justify-evenly items-center text-white text-xl rounded-lg'>
                    Age : 
                    <input
                    type="Number"
                    placeholder=' Enter Age'
                    name = 'age'
                    onChange = {(e) => setAge(e.target.value)}
                    className='w-[70%] h-[50%] rounded-lg pl-2  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black'
                    />
                </div>
                <div className='w-[90%] h-[18%] bg-[#303031] flex justify-evenly items-center text-white text-xl rounded-lg'>
                    Height: 
                    <input
                    type="text"
                    placeholder=' Enter Height'
                    name = 'height'
                    onChange = {(e) => setHeight(e.target.value)}
                    className='w-[70%] h-[50%] rounded-lg pl-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black'
                    />
                </div>
                <div className='w-[90%] h-[18%] bg-[#303031] flex justify-evenly items-center text-white text-xl rounded-lg'>
                    DOB : 
                    <input
                    type="text  "
                    placeholder='Enter DOB'
                    name = 'dob'
                    onChange = {(e) => setDOB(e.target.value)}
                    className='w-[70%] h-[50%] rounded-lg pl-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black'
                    />
                </div>
                <div className='w-[90%] h-[18%] bg-[#303031] flex justify-evenly items-center text-white text-xl rounded-lg'>
                    Address : 
                    <input
                    type="text"
                    placeholder='Enter Address'
                    name = 'from'
                    onChange = {(e) => setFrom(e.target.value)}
                    className='w-[70%] h-[50%] rounded-lg pl-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black'
                    />
                </div>
                <div className='w-[90%] h-[18%] bg-[#303031] flex justify-evenly items-center text-white text-xl rounded-lg'>
                    Work : 
                    <input
                    type="text"
                    placeholder='Enter Work'
                    name = 'work'
                    onChange = {(e) => setWork(e.target.value)}
                    className='w-[70%] h-[50%] rounded-lg pl-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black'
                    />
                </div>
            </div>
            <div className='w-[45%] h-full ml-6 flex flex-col justify-evenly items-center'>
                <div className='w-[100%] h-[75%] flex flex-col justify-evenly items-center'>
                    <input type="file" name = "file" className ="text-sm text-white
                        file:mr-5 file:py-2 file:px-6
                        file:rounded-full file:border-0
                        file:text-sm file:font-medium
                      file:bg-[#303031] file:text-white
                        hover:file:cursor-pointer hover:file:bg-amber-50
                      hover:file:text-black"
                        onChange={handle}
                    />
                    <div className='w-[50%] h-[55%] rounded-full border-2 border-white' style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        
                    </div>
                </div>
                <div className='w-[100%] h-[15%] flex justify-evenly items-center'>
                    <Link to = '/blog/account'><button className='w-[20vh] h-[8vh] bg-[#303031] font-m text-white rounded-lg'>Cancel</button></Link>
                    <button
                    className='w-[20vh] h-[8vh] bg-[#81ffd9] text-black font-medium rounded-lg'
                    onClick={submit}
                    >
                    Update
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditProfile