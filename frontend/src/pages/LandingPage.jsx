import React from 'react';
import { Link } from 'react-router-dom';
import chat from "../assets/chat.jpg";
import groupchat from "../assets/groupchat.jpg";
import videochat from "../assets/video-chat.jpg";
import audiochat from "../assets/audiochat.jpg";
import NavBar from '../components/NavBar';
import Div from '../components/Div';

function LandingPage() {
    return (
        <div className='min-h-screen bg-[#2f2d52]'>
            <NavBar />
            <div className='flex flex-col items-center justify-center gap-10 p-10'>
                <h1 className='text-4xl font-bold text-center text-white'>Welcome to TalkBox</h1>
                <p className='text-xl text-center text-gray-300'>A real-time chat application for seamless communication</p>
                
                <Div img={chat} headingText="Real-time messaging."
                    text='Send and receive messages instantly with our real-time chat system.' />
                
                <Div img={groupchat} headingText="Integrated Group chat" 
                     text='Creating a group chat for any purpose.' />
                
                <Div img={videochat} headingText="Video call system." 
                    text='Video calling is also available for communication for all users.' />
                
                <Div img={audiochat} headingText="Audio call system." 
                    text='Audio calling is also available for communication for all users.' />
                
                <Link to="/login" className='px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'>
                    Get Started
                </Link>

                <div className='w-3/4 m-auto h-[2px] bg-white'></div>

            </div>
        </div>
    );
}

export default LandingPage; 