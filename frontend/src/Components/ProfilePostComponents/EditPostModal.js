import React, { useEffect, useState, useContext} from 'react';
import Modal from 'react-modal';
import './EditPostModal.css';
import "../Home/Post.css"
import "../Profile/ProfileComponents/InfoProfile/Info.css"
import { UserContext } from '../../App';
import { updatePost } from '../../api/services/Post';
import { useAlert } from 'react-alert';
const style = {
  content: {
    alignItems: 'center',
    top: '33%',
    left: '48%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '35%',
    height: "60%",
    transform: 'translate(-40%, -10%)'
  },
};

const EditPostModal = ({isOpen, onAfterOpen, onRequestClose, post, setFetchProfilePosts}) => {
  const user = useContext(UserContext)
  const alert = useAlert()
  const [editPostContent, setEditPostContent ] = useState(post?.content)
  const [editPostImages, setEditPostImages] = useState(post?.images_url || [])

  useEffect(() => {
    Modal.setAppElement('body');
  },[])
  const handleUpdatePost = async () => {
    console.log(editPostImages)
    const result = await updatePost(user.token, post.post_id, editPostContent, editPostImages)
    if(result.status === 200){
      setFetchProfilePosts(true)
      alert.success("Post Updated")
    }else{
      setEditPostContent(post.content)
      setEditPostImages(post.images_url)
      alert.error(`Status Code: ${result.status}, Error: ${result.data.message}`)
    }
    onRequestClose()
    return;
  }
  useEffect(() => {
    if(editPostImages){
      editPostImages.forEach(element => {
        console.log(element)
      });
    }
  },[editPostImages])

  return (
        <Modal
          isOpen={isOpen}
          onClose={onRequestClose}
          style={style}
        >
            <h2>Edit Post</h2>
            <textarea placeholder="post's content" value={editPostContent} onChange={(e)=> setEditPostContent(e.target.value)}/>
            {editPostImages?.length === 1 ? editPostImages.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt="" 
              className="post-img" 
            /> 
            )) : editPostImages.length === 2 ? (
            <div className="multi-img two-images">
                {editPostImages.map((img, index) => (
                    <div key={index} className="multi-image">
                        <img src={img} alt="" />
                    </div>
                ))}
            </div>
            ) : (
                <div className="multi-img more-three-images">
                    {editPostImages.map((img, index) => (
                        <img src={img} alt="" />
                    ))}
                </div>
            )}
            <div>
              {
                editPostImages?.length > 0 &&
                <>
                  <h2>Select image to delete</h2>
                  {
                    editPostImages.map((img, index) => {
                      return (
                        <div className='deleteButtons' key={index}>
                          <button className='deleteImageButton btn-outline btn' onClick={() => setEditPostImages(editPostImages.filter((_, i) => i !== index))}>
                            Image {index}
                          </button>
                        </div>
                      )
                    })
                  }
                </>
              }
            </div>
            <div className='optionButton'> 
              <button className='btn' onClick={onRequestClose}>Cancel</button>
              <button className='btn' onClick={handleUpdatePost}>Update</button>
            </div>
        </Modal>
  )
}

export default EditPostModal