import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import { useSocket } from '../utils/socket';

const VideoCall = ({ roomId, onClose, isInitiator }) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const myVideo = useRef();
  const remoteVideo = useRef();
  const peerRef = useRef();
  const socket = useSocket();
  const [visible, setVisible] = useState(false);
  const [callStart, setCallStart] = useState(null);
  const [duration, setDuration] = useState('00:00');
  const [connected, setConnected] = useState(false);
  // Example avatars/names, replace with real data if available
  const myAvatar = 'https://ui-avatars.com/api/?name=You&background=0072ff&color=fff';
  const partnerAvatar = 'https://ui-avatars.com/api/?name=Partner&background=00c6ff&color=fff';
  const myName = 'You';
  const partnerName = 'Partner';

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
        // Setup peer
        peerRef.current = new Peer({
          initiator: isInitiator,
          trickle: false,
          stream: currentStream
        });
        // Signal exchange
        peerRef.current.on('signal', data => {
          socket.emit('video-signal', { roomId, signal: data });
        });
        socket.on('video-signal', ({ signal }) => {
          peerRef.current.signal(signal);
        });
        // Remote stream
        peerRef.current.on('stream', remoteStream => {
          setRemoteStream(remoteStream);
          if (remoteVideo.current) {
            remoteVideo.current.srcObject = remoteStream;
          }
          setConnected(true);
          setCallStart(Date.now());
        });
      });
    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (stream) stream.getTracks().forEach(track => track.stop());
      socket.off('video-signal');
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!callStart) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - callStart) / 1000);
      const min = String(Math.floor(diff / 60)).padStart(2, '0');
      const sec = String(diff % 60).padStart(2, '0');
      setDuration(`${min}:${sec}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStart]);
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 60px 10px #222 inset',
      overflow: 'hidden',
      transition: 'opacity 0.5s, transform 0.5s',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.95)'
    }}>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 400); }} style={{ position: 'absolute', top: 32, right: 40, fontSize: 32, color: '#fff', background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', boxShadow: '0 2px 8px #0003', transition: 'background 0.3s' }}>✖</button>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '2vw',
        width: '80vw',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '2vw',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 32,
        boxShadow: '0 8px 32px #0004',
        position: 'relative'
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <img src={myAvatar} alt="You" style={{ width: 64, height: 64, borderRadius: '50%', boxShadow: '0 2px 8px #0006', position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ color: '#fff', fontWeight: 500, fontSize: 18, letterSpacing: 1, marginBottom: 8, textShadow: '0 2px 8px #0008', marginTop: -8 }}>{myName}</div>
          <video ref={myVideo} autoPlay muted style={{ width: '22vw', minWidth: 180, maxWidth: 320, height: '28vh', borderRadius: 24, marginBottom: 16, background: '#222', boxShadow: '0 4px 24px #0006' }} />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <img src={partnerAvatar} alt="Partner" style={{ width: 64, height: 64, borderRadius: '50%', boxShadow: '0 2px 8px #0006', position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ color: '#fff', fontWeight: 500, fontSize: 18, letterSpacing: 1, marginTop: -8, marginBottom: 8, textShadow: '0 2px 8px #0008' }}>{partnerName}</div>
          <video ref={remoteVideo} autoPlay style={{ width: '40vw', minWidth: 320, maxWidth: 600, height: '40vh', borderRadius: 24, background: '#222', boxShadow: '0 4px 32px #0008' }} />
        </div>
        {/* Connection status and duration */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontWeight: 500, fontSize: 18, background: 'rgba(0,0,0,0.4)', padding: '8px 24px', borderRadius: 16, boxShadow: '0 2px 8px #0006', letterSpacing: 1 }}>
          {connected ? `Connected • ${duration}` : 'Connecting...'}
        </div>
      </div>
      <div style={{ color: '#fff', marginTop: 32, fontSize: 28, fontWeight: 600, letterSpacing: 2, textShadow: '0 2px 12px #0008' }}>
        <span style={{ background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Live Video Call</span>
      </div>
    </div>
  );
};

export default VideoCall;
