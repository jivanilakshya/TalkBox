import { useContext } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import more from "../assets/more.png";
import avatar from "../assets/avatar-food.png";
import AuthContext from "../contexts/AuthContext";
import ChatContext from "../contexts/ChatContext";

function Header({ toggleShow }) {
    const { chat } = useContext(ChatContext);
    const { state } = useContext(AuthContext);
    const { user } = state;

    const isMyId = chat?.friendDetails.friendId === user.id;
    const friendName = isMyId ? chat?.friendDetails.userName : chat?.friendDetails.friendUsername;

    const handleImageError = (e) => {
        e.target.src = avatar;
    };

    return (
        <div className='bg-[#3e3c61] px-4 py-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <IoArrowBackSharp className='mobile:block hidden mr-2' onClick={toggleShow} size={23} cursor="pointer" />
                <img 
                    className='w-8 h-8 rounded-full object-cover' 
                    src={chat?.friendDetails.friendImage || avatar} 
                    alt={friendName || "User"} 
                    onError={handleImageError}
                />
                <p className="font-medium">{ friendName }</p>
            </div>
        </div>
    );
}

export default Header; 