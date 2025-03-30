import React, { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import avatar from "../assets/avatar-food.png";

function Settings({ onClose }) {
    const { state, dispatch } = useContext(AuthContext);
    const { user } = state;
    const currentUser = user;
    const [displayPicture, setDisplayPicture] = useState(currentUser.displayPicture);
    const [userName, setUserName] = useState(currentUser.userName);
    const [email, setEmail] = useState(currentUser.email);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleUpload = async (e) => {
        if (e.target.files != null) {
            const file = e.target.files[0];
            const base64 = await convertToBase64(file);
            setDisplayPicture(base64);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`https://hawky.onrender.com/api/user/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ 
                    userName, 
                    email, 
                    displayPicture 
                })
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.error);
                return;
            }

            setSuccess("Settings updated successfully!");
            // Update local storage and context with new user data
            const updatedUser = { ...currentUser, ...json };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch({ type: "LOGIN", payload: updatedUser });
        } catch (err) {
            setError("Failed to update settings");
        }
    }

    return (
        <div className='fixed left-1/2 mobile:w-80 -translate-x-1/2 z-10 bg-primary px-6 py-4 rounded-md fill'>
            <h2 className='text-xl mb-4'>Settings</h2>
            
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block mb-2'>Profile Picture</label>
                    <div className='flex items-center gap-4'>
                        <img 
                            className='w-16 h-16 rounded-full object-cover' 
                            src={displayPicture || avatar} 
                            alt="Profile" 
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleUpload}
                            className='text-sm'
                        />
                    </div>
                </div>

                <div>
                    <label className='block mb-2'>Username</label>
                    <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className='w-full bg-secondary p-2 rounded'
                    />
                </div>

                <div>
                    <label className='block mb-2'>Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full bg-secondary p-2 rounded'
                    />
                </div>

                {error && <p className='text-red-500'>{error}</p>}
                {success && <p className='text-green-500'>{success}</p>}

                <div className='flex justify-end gap-4 mt-6'>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className='px-4 py-2 bg-secondary rounded'
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className='px-4 py-2 bg-blue-600 rounded'
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

// Helper function to convert file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export default Settings; 