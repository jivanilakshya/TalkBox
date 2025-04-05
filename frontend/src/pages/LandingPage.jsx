import React from 'react';
import { Link } from 'react-router-dom';
import chat from "../assets/chat.jpg";
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
                
                <Div headingText="User-friendly interface."
                    text='Simple and intuitive design for easy communication.' />
                
                <Div headingText="Secure communication."
                    text='Your messages are encrypted and secure.' />
                
                <Link to="/login" className='px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'>
                    Get Started
                </Link>
            </div>
        </div>
    );
}

export default LandingPage; 