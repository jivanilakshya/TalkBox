import { useContext, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { FiVideo } from "react-icons/fi";
import more from "../assets/more.png";
import AuthContext from "../contexts/AuthContext";
import ChatContext from "../contexts/ChatContext";
import VideoCall from './VideoCall';

function Header({ toggleShow }) {
    const [showVideoCall, setShowVideoCall] = useState(false);
    const { chat } = useContext(ChatContext);
    const { state } = useContext(AuthContext);
    const { user } = state;

    const isMyId = chat?.friendDetails.friendId === user.id;
    const friendName = isMyId ? chat?.friendDetails.userName : chat?.friendDetails.friendUsername;
    const friendId = isMyId ? chat?.friendDetails.userId : chat?.friendDetails.friendId;

    return (
        <div className='bg-[#3e3c61] px-4 py-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <IoArrowBackSharp className='mobile:block hidden mr-2' onClick={toggleShow} size={23} cursor="pointer" />
                <img className='w-8 h-8 rounded-full object-cover' src={chat?.friendDetails.friendImage} alt="" />
                <p className="font-medium">{ friendName }</p>
            </div>

            <div className='flex items-center'>
                <button 
                    onClick={() => setShowVideoCall(true)}
                    className="p-2 rounded-full hover:bg-primary transition-colors"
                >
                    <FiVideo size={20} />
                </button>
            </div>

            {showVideoCall && (
                <VideoCall
                    onClose={() => setShowVideoCall(false)}
                    friendId={friendId}
                    friendName={friendName}
                />
            )}
        </div>
    );
}

export default Header; 