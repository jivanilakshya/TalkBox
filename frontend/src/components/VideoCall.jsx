import React, { useEffect, useRef, useState } from 'react';
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiPhoneOff } from 'react-icons/fi';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

function VideoCall({ onClose, friendId, friendName }) {
    const [stream, setStream] = useState(null);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const ws = useRef(null);
    const { state } = useContext(AuthContext);
    const { user } = state;

    useEffect(() => {
        startLocalStream();
        setupWebSocket();
        return () => {
            stopLocalStream();
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const setupWebSocket = () => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            // Register with signaling server
            ws.current.send(JSON.stringify({
                type: 'register',
                userId: user.id
            }));
        };

        ws.current.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'offer':
                    await handleOffer(data.offer);
                    break;
                case 'answer':
                    await handleAnswer(data.answer);
                    break;
                case 'ice-candidate':
                    await handleIceCandidate(data.candidate);
                    break;
            }
        };
    };

    const startLocalStream = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(mediaStream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    const stopLocalStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const setupPeerConnection = () => {
        peerConnection.current = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        if (stream) {
            stream.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, stream);
            });
        }

        peerConnection.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                ws.current.send(JSON.stringify({
                    type: 'ice-candidate',
                    candidate: event.candidate,
                    target: friendId,
                    from: user.id
                }));
            }
        };
    };

    const initiateCall = async () => {
        setupPeerConnection();
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        ws.current.send(JSON.stringify({
            type: 'offer',
            offer: offer,
            target: friendId,
            from: user.id
        }));
    };

    const handleOffer = async (offer) => {
        setupPeerConnection();
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        ws.current.send(JSON.stringify({
            type: 'answer',
            answer: answer,
            target: friendId,
            from: user.id
        }));
    };

    const handleAnswer = async (answer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = async (candidate) => {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOn(!isVideoOn);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioOn(!isAudioOn);
        }
    };

    const endCall = () => {
        stopLocalStream();
        if (peerConnection.current) {
            peerConnection.current.close();
        }
        if (ws.current) {
            ws.current.close();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-secondary p-4 rounded-lg w-[90%] max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Call with {friendName}</h2>
                    <button onClick={endCall} className="text-red-500 hover:text-red-600">
                        <FiPhoneOff size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full rounded-lg bg-gray-800"
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm">
                            You
                        </div>
                    </div>
                    <div className="relative">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded-lg bg-gray-800"
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm">
                            {friendName}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full ${isVideoOn ? 'bg-primary' : 'bg-red-500'}`}
                    >
                        {isVideoOn ? <FiVideo size={24} /> : <FiVideoOff size={24} />}
                    </button>
                    <button
                        onClick={toggleAudio}
                        className={`p-3 rounded-full ${isAudioOn ? 'bg-primary' : 'bg-red-500'}`}
                    >
                        {isAudioOn ? <FiMic size={24} /> : <FiMicOff size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCall; 