import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom"
import register from "../../assets/registerchat.png";
import NavBar from "../../components/NavBar";
import avatar from "../../assets/addAvatar.png";
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAlternateEmail } from "react-icons/md";
import AuthContext from "../../contexts/AuthContext";

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        }

        fileReader.onerror = (error) => {
            reject(error);
        }
    })
}

function Register() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [displayPicture, setDisplayPicture] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const { dispatch } = useContext(AuthContext);

    const handleUpload = async (e) => {
        if (e.target.files != null) {
            const file = e.target.files[0];
            const base64 = await convertToBase64(file);
            setDisplayPicture(base64);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const res = await fetch(`http://localhost:5000/api/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, userName, displayPicture})
        });

        const json = await res.json();

        if (!res.ok) {
            setErr(json.error);
            setLoading(false);
            setTimeout(() => {
                setErr("");
            }, 3000);
        }

        if (res.ok) {
            setLoading(false);
            dispatch({type: "LOGIN", payload: json});
            localStorage.setItem("user", JSON.stringify(json));
        }
    }

    return (
        <div className='pb-10'>
            <NavBar />

            <div className='flex flex-wrap justify-around items-center mt-20'>
                <div>
                    <img className='w-[340px]' src={register} alt="register" />
                    <p className='sm:text-2xl text-lg text-center'>Register with us to enjoy realtime chats like no other.</p>
                </div>

                <div className='bg-navbg text-center sm:mt-0 mt-8 sm:w-96 h-[500px] flex flex-col rounded-lg p-6'>
                    <h2 className='text-2xl font-heading'>Register</h2>

                    <form onSubmit={handleSubmit} className='mt-6'>
                        <div className='flex items-center my-4 bg-gray-900 py-1 rounded-md'>
                            <p className='h-[40px] text-center flex items-center justify-center p-2'><AiOutlineUser size={20} /></p>
                            <input value={userName} onChange={e => setUserName(e.target.value)} className='w-11/12 py-2 px-1 bg-gray-900' type="text" placeholder='Username' />
                        </div>

                        <div className='flex items-center my-4 bg-gray-900 py-1 rounded-md'>
                            <p className='h-[40px] text-center flex items-center justify-center p-2'><MdOutlineAlternateEmail size={20} /></p>
                            <input value={email} onChange={e => setEmail(e.target.value)} className='w-11/12 py-2 px-1 bg-gray-900' type="email" placeholder='Email' />
                        </div>

                        <div className='flex items-center my-4 bg-gray-900 py-1 rounded-md'>
                            <p className='h-[40px] text-center flex items-center justify-center p-2'><RiLockPasswordFill size={20} /></p>
                            <input value={password} onChange={e => setPassword(e.target.value)} className='w-11/12 py-2 px-1 bg-gray-900' type="password" placeholder='Password' />
                        </div>

                        <div className='my-2'>
                            <label className='flex items-center justify-center cursor-pointer gap-2' htmlFor="image">
                                <img className='w-8' src={displayPicture || avatar} alt="display picture" />
                                <p>Add an avatar (optional)</p>
                            </label>
                            <input onChange={e => handleUpload(e)} type="file" id='image' className='hidden' />
                        </div>

                        {
                            err && (
                                <div className='text-red-300'>
                                    { err }
                                </div>
                            )
                        }

                        <div className='w-full flex items-center justify-center mt-6'>
                            <button disabled={loading} className={`${loading ? "" : "active:scale-75"} bg-register text-gray-600 px-6 py-2 rounded-lg font-bold flex items-center justify-center drop-shadow-2xl duration-300`}>
                                {
                                    loading ? 
                                    <div className='animate-spin w-5 h-5 border-[2px] border-gray-600 rounded-full border-t-black mr-1'></div> : ""
                                } Register
                            </button>
                       </div>
                    </form>

                    <h3 className='mt-7'>Already have an account? <Link className='text-login' to="/login">Login</Link></h3>
                </div>
            </div>
        </div>
    );
}

export default Register; 