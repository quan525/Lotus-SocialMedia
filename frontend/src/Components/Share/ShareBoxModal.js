import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './ShareBoxModal.css'
import { customStyles } from '../Profile/ProfileComponents/InfoProfile/Info';

import { sharePost } from '../../api/services/Post';
import { UserContext } from '../../App';

const newStyles = {
  ...customStyles,
  content: {
    ...customStyles.content,
    height: '350px', // adjust this value as needed
  },
};

const ShareBoxModal = ({ isOpen, onClose, postId,  }) => {
  const user = useContext(UserContext)
  const [content, setContent] = useState('');
  const handleSharePost = async () => {
    console.log(user.token)
    const result = await sharePost(user.token, postId, content)
    .then(res => console.log(res))
    onClose()
  }
  if (!isOpen) {
    return null;
  }
  return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={newStyles} 
        >
          <h2>Share Post</h2>
          <textarea style={{width:'450px',height:'200px', borderWidth:'0 0 2px'
            ,textAlign:'start', outline:'none', fontSize:"18px"
          }} type='text' placeholder="What's on your mind?" onChange={(e) => setContent(e.target.value)}/>
          <button className='upload_button' onClick={handleSharePost}>Upload</button>
        </Modal >
  );
};

export default ShareBoxModal;
