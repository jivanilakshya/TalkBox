import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from "../assets/avatar-food.png";
import { AiOutlineMail, AiOutlineDelete } from "react-icons/ai";
import { RiUserSettingsLine } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";
import AuthContext from '../contexts/AuthContext';
import FriendContext from '../contexts/FriendContext';
import Message from './Message';
import Settings from './Settings';

function SideBar() {
    const navigate = useNavigate();
    const [display, setDisplay] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { dispatch, state } = useContext(AuthContext);
    
    const [friend, setFriend] = useState(null);

    const div = useRef(null);
    const side = useRef(null);

    const { user } = state;

    const currentUser = user;

    const isEmpty = currentUser.displayPicture === "";

    const { dispatch: friendDispatch } = useContext(FriendContext);

    const handleLogout = () => {
        dispatch({type: "LOGOUT", payload: {}});
        localStorage.removeItem("user");
        navigate('/login');
    }

    const handleDelete =  () => {
        setDisplay(true);
    }

    const handleSettings = () => {
        setShowSettings(true);
    }

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (div.current.contains(e.target)) {
                return;
            }

            setDisplay(false);
        })
    } , []);

    const deleteAccount = async () => {
        const res = await fetch(`http://localhost:5000/api/user/delete/` + currentUser.id, {
            method: "DELETE"
        });

        if (!res.ok) {
            console.log("Cannot delete account");
        }
        
        if (res.ok) {
            localStorage.removeItem("user");
            dispatch({type: "LOGOUT", payload: {}});
        }
    }

    useEffect(() => {
        const getFriends = async () => {
          const res = await fetch(`http://localhost:5000/api/friend`, {
            headers: {
              "Authorization": `Bearer ${currentUser.token}`
            }
          });
          const json = await res.json();
  
          if (!res.ok) {
            console.log(json.error);
          }
  
          if (res.ok) {
            friendDispatch({type: "FETCH", payload: json});
          }
        }
        getFriends();
    }, []);

    const toggleShow = () => {
        if (side.current.classList.contains("mobile:invisible")) {
            side.current.classList.remove("mobile:invisible");
        } else {
            side.current.classList.add("mobile:invisible");
        }
    }

    return (
        <div className='flex items-start justify-center'>
            <div ref={side} className='bg-[#3e3c61] p-5 w-fit h-[500px] rounded-bl-lg rounded-tl-lg mobile:invisible mobile:absolute z-40 mobile:right-[50%]'>
                <div className='flex items-center gap-1'>
                    <img className='w-10 rounded-full object-cover' src={isEmpty ? avatar : currentUser.displayPicture} alt="" />
                    <p>{ currentUser.userName }</p>
                </div>

                {
                    display && (
                        <div className='fixed left-1/2 mobile:w-80 -translate-x-1/2 z-10 bg-primary px-6 py-4 rounded-md fill'>
                            <p className='text-lg'>Are you sure you want to delete account?</p>
                            
                            <div className='flex items-center justify-end gap-4 mt-3 p-2'>
                                <button onClick={deleteAccount}>Yes</button>
                                <button onClick={() => setDisplay(false)}>Cancel</button>
                            </div>
                        </div>
                    )
                }
                
                {showSettings && (
                    <Settings onClose={() => setShowSettings(false)} />
                )}
                
                <div className='mt-10'>
                    <div className='flex items-center gap-2 mb-10 cursor-pointer'>
                        <AiOutlineMail size={25} />
                        <p>Messages</p>
                    </div>
                    <div onClick={handleSettings} className='flex items-center gap-2 mb-10 cursor-pointer'>
                        <RiUserSettingsLine size={25} />
                        <p>Settings</p>
                    </div>
                    <div ref={div} onClick={handleDelete} className='flex items-center gap-2 mb-10 cursor-pointer'>
                        <AiOutlineDelete size={25} />
                        <p>Delete account</p>
                    </div>
                    <div onClick={handleLogout} className='flex items-center gap-2 mb-10 cursor-pointer'>
                        <HiOutlineLogout size={25} />
                        <p>Logout</p>
                    </div>
                </div>
            </div>

           <Message setFriend={setFriend} friend={friend} toggleShow={toggleShow} />

        </div>
    );
}

export default SideBar; 