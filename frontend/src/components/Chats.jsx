import React, { useContext, useEffect, useState, useRef } from 'react';
import avatar from "../assets/avatar-food.png";
import AuthContext from '../contexts/AuthContext';
import ChatContext from '../contexts/ChatContext';
import MessageContext from '../contexts/MessageContext';
import imagechat from "../assets/imagechat.png";
import FriendContext from '../contexts/FriendContext';

const Chats = ({ friend }) => {
    const isEmpty = friend.friendDetails.friendImage === "";

    const { state } = useContext(AuthContext);
    const { setChat, chatDiv, showChat } = useContext(ChatContext);
    const { setMessages, messages, setLoading } = useContext(MessageContext);
    const { friends } = useContext(FriendContext);

    const [lastMessage, setLastMessage] = useState("");
    const [isOnline, setIsOnline] = useState(null);

    const { user } = state;

    const currentUser = user;

    const isEqual = currentUser.userName === friend.friendDetails.friendUsername;

    const userId = currentUser.id;
    const isMyId = friend.friendDetails.friendId === currentUser.id;
    const friendId = isMyId ? friend.friendDetails.userId : friend.friendDetails.friendId;

    const handleClick = async () => {
        setChat(friend);

        const req = new XMLHttpRequest();
        req.open("GET", `http://localhost:5000/api/message/` + userId + "/" + friendId);
        req.setRequestHeader("Authorization", `Bearer ${currentUser.token}`)
        req.addEventListener("progress", e => {
            // console.log((e.loaded / e.total) * 100 + "%");
        });
        req.addEventListener("load", () => {
            setLoading(true);
            setMessages(JSON.parse(req.response));
        })
        req.send();

        if (window.innerWidth <= 1200) {
            showChat();
        }
    }

    useEffect(() => {
        const getLastMessage = async () => {
            const res = await fetch(`http://localhost:5000/api/message/lastMessage/` + userId + "/" + friendId, {
                headers: {
                    "Authorization": `Bearer ${currentUser.token}`
                }
            });

            const json = await res.json();
  
            if (!res.ok) {
                console.log(json.error)
            }
    
            if (res.ok) {
                setLastMessage(json?.text);
            }
        }

        getLastMessage();
    }, [messages]);

    return (
        <div ref={chatDiv} onClick={handleClick} className='flex pr-8 items-start justify-between cursor-pointer l'>
            <div className='flex gap-3 l'>
                <img src={isEmpty ? avatar : friend.friendDetails.friendImage} className='w-12 rounded-full object-cover l' alt="avatar" />
                <div>
                    <p className='font-bold capitalize l'>{isEqual ? friend.friendDetails.userName : friend.friendDetails.friendUsername }</p>
                    
                    <div>
                        {
                            lastMessage ? 
                            <div>
                                {
                                    lastMessage === "media-alt-send" ?  <p className='flex items-center text-red-400 l'> <img className='w-5 l' src={imagechat} alt="image" /> media</p> :
                                    <p className='text-sm w-16 overflow-hidden whitespace-nowrap italic text-orange-400 text-ellipsis l'>{ lastMessage  }</p>
                                }
                            </div> : <p className='italic text-sm text-gray-400'>empty chat</p>
                        }
                    </div>
                </div>
            </div>
            <p className='text-gray-300 l'>
                {
                    // isOnline?.includes(friend.friendDetails.userId) ? "online" : "offline"
                }
            </p>
        </div>
    );
}

export default Chats; 