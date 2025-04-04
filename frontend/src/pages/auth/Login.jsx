import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import login from "../../assets/loginchat.png";
import NavBar from '../../components/NavBar';
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import AuthContext from '../../contexts/AuthContext';

function Login() {
    const [text, setText] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        if (text.includes(".") && text.includes("@")) {
            setUserName("");
        } else {
            setEmail("")
        }
    }, [text])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(`http://localhost:5000/api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, userName})
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
        <>
            <NavBar />

            <div className='flex flex-wrap justify-around items-center mt-20 mb-8'>
                <div>
                    <img className='w-[340px]' src={login} alt="register" />
                    <p className='sm:text-2xl text-lg text-center'>Welcome back. Login your account to continue having fun.</p>
                </div>

                <div className='bg-navbg text-center sm:mt-0 mt-8 sm:w-96 h-[400px] flex flex-col rounded-lg p-6'>
                    <h2 className='text-2xl font-heading'>Login</h2>

                    <form onSubmit={handleSubmit} className='mt-6'>
                        <div className='flex items-center my-4 bg-gray-900 py-1 rounded-md'>
                            <p className='h-[40px] text-center flex items-center justify-center p-2'><AiOutlineUser size={20} /></p>
                            <input value={text} onChange={e => {
                                setText(e.target.value);
                                setEmail(e.target.value);
                                setUserName(e.target.value);
                            }} className='w-11/12 py-2 px-1 bg-gray-900' type="text" placeholder='Username or Email' />
                        </div>

                        <div className='flex items-center my-4 bg-gray-900 py-1 rounded-md'>
                            <p className='h-[40px] text-center flex items-center justify-center p-2'><RiLockPasswordFill size={20} /></p>
                            <input value={password} onChange={e => setPassword(e.target.value)} className='w-11/12 py-2 px-1 bg-gray-900' type="password" placeholder='Password' />
                        </div>

                        {
                            err && (
                                <div className='text-red-300'>
                                    { err }
                                </div>
                            )
                        }

                        <div className='w-full flex items-center justify-center'>
                            <button disabled={loading} className={`${loading ? "cursor-default" : "active:scale-75"} bg-login text-gray-600 px-4 py-2 rounded-lg font-bold flex items-center justify-center drop-shadow-2xl duration-300`}>
                                {
                                    loading ? <div className='animate-spin w-5 h-5 border-[2px] border-gray-600 rounded-full border-t-black mr-1'></div> : ""
                                } Login
                            </button>
                       </div>
                    </form>

                    <h3 className='mt-7'>Don't have an account? <Link className='text-register' to="/register">Register</Link></h3>
                </div>
            </div>
        </>
    );
}

export default Login; 