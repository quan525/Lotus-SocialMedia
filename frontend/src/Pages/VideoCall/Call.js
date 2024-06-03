import React, { useEffect, useRef, useState } from 'react';
import './Call.css';
import { BsFillTelephoneXFill, BsFillCameraVideoOffFill, BsFillCameraVideoFill  } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";


const VideoCall = () => {
  const localVideoRef = useRef();
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    let stream = null;

    if(cameraOpen) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(mediaStream => {
          stream = mediaStream;
          localVideoRef.current.srcObject = stream;
        });
    } else {
      if (localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getVideoTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOpen]);

  const handleCameraOpen = () => {
    setCameraOpen(prevState => !prevState);
  }

  return (
    <div>
        <div className="videoContainer">
          <div className="videoWrapper">        
          </div>
          <div className="videoWrapper">        
            <video ref={localVideoRef} className='video' autoPlay muted></video>      
          </div>
        </div>
        <div className='selfVideo'>
        </div>
        <div className='buttons'>
          <button className="button" onClick={() => handleCameraOpen()}>
            {cameraOpen ? <BsFillCameraVideoFill size="1.5em"/> : <BsFillCameraVideoOffFill size="1.5em"/>}
          </button>
          <button className="button" onClick={() => handleCameraOpen()}>
            <FaUsers size="1.5em"/>
          </button>
          <button className="button">
            <BsFillTelephoneXFill size="1.5em"/>
          </button>
        </div>
    </div>
  );
};

export default VideoCall;