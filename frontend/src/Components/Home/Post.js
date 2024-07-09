import React, { useContext, useEffect } from 'react'
import "../Home/Post.css"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import ImageIcon from '@mui/icons-material/Image';
import EmojiPicker, { Emoji } from 'emoji-picker-react';

import {PiSmileySad} from "react-icons/pi"
import {MdBlockFlipped} from "react-icons/md"
import {MdReportGmailerrorred} from "react-icons/md"

import PostAddIcon from '@mui/icons-material/PostAdd';
import {FiInstagram} from "react-icons/fi"
import { useState } from 'react';
import Comments from '../Comments/Comments';
import SharedPost from '../Share/SharedPost'
import ShareBoxModal from '../Share/ShareBoxModal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../App';
import { commentOnPost, fetchPostComments } from '../../api/services/Comments';
import { handleDateDiff  } from '../../utils/utils';
import { sharePost } from '../../api/services/Post';
import API_PATHS from '../../api/apiPath';



//{post.images.map((img, index) => (
//<img 
//  key={index} 
//  src={img} 
//  onClick={() => handleZoomImage(img)} 
//  alt="" 
//  className={`post-img ${img === zoomedImage ? 'post-img-zoomed' : ''}`} 
///>
//)}

const Post = ({post,posts,setPosts,setFriendsProfile,images}) => {
  const [totalComment,setTotalComment] = useState(post.comments_count)
  const [comments,setComments] =useState([])
  const user = useContext(UserContext)
  const [like,setLike] = useState(parseInt(post.like_count))
  const [unlike,setUnlike] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [filledLike,setFilledLike] = useState(<FavoriteBorderOutlinedIcon />)
  const [unFilledLike,setUnFilledLike] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const closeShareModal = () => setOpenShareModal(false);

  useEffect(()=>{
    if(post.user_like_ids.includes(user.user_id)){
      setUnlike(true)
      setFilledLike( <FavoriteRoundedIcon /> )
      setUnFilledLike(true)
    }else{
      setUnlike(false)
      setFilledLike( <FavoriteBorderOutlinedIcon /> )
      setUnFilledLike(false)
    }
  }, [post?.user_like_ids, user])


  const handlelikes = async (postId)=>{
    setLike(unlike ? like -1 : like +1)
    setUnlike(!unlike)
    setFilledLike(unFilledLike ?   <FavoriteBorderOutlinedIcon /> : <FavoriteRoundedIcon />)
    setUnFilledLike(!unFilledLike)
    const url = `${API_PATHS.api}/like/${postId}`
    console.log(postId)
    const config = {
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    }
    try {
      if (unlike) {
        // Unlike the post
        await axios.delete(url, config).then((response) => console.log(response));
        console.log("Post unliked successfully");
        // Perform any additional actions if needed
      } else {
        // Like the post
        await axios.post(url, {}, config).then((response) => console.log(response));
        console.log("Post liked successfully");
        // Perform any additional actions if needed
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error if needed
    }
  }

  useEffect(()=>{
    console.log("check user", user)
    console.log(post)
  },[user])

  const [showDelete,setShowDelete] = useState(false)
  const [showComment,setShowComment] = useState(false)

 useEffect(() => {
  if(showComment && user.token && post.post_id ){
    const fetchData = async () => {
      try {
        const comment = await fetchPostComments(user.token, post.post_id);
        if (comment) {
          setComments(comment);
        }
      } catch (error) {
        console.error('Error fetching post comments:', error);
      }
    };

    fetchData();
  }}, [showComment, user.token, post.post_id])

  useEffect(() => {
    console.log("shared post: ", post?.shared_post)
  },[post])

  const handleSharePost = async (postId, content) => {
    await sharePost(user.token, postId, content);
  }

  const handleDelete=(id)=>{
    const url = `${API_PATHS.api}/post/${id}` 
    const token = JSON.parse(localStorage.getItem("data")).token
    const config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    axios.delete( url, config)
    .then((response) => {
      console.log(response)
      if(response?.status === 200) {
        const deleteFilter =posts.filter(val=> val.post_id !== id)
        setPosts(deleteFilter)
        setShowDelete(false)
      }
    })
  }
  
  const [commentInput,setCommentInput] = useState("")
  const [commentImages, setCommentImages] = useState({});
  const onEmojiClick = (emojiObject) => {
    setCommentInput((prevInput) => prevInput + emojiObject.emoji);
  };


  const onCommentImageChange = (postId) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImages(prevCommentImages => ({
          ...prevCommentImages,
          [postId]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setCommentImages(prevCommentImages => ({
        ...prevCommentImages,
        [postId]: null
      }));
    }
  };

  const deleteCommentImage = (postId) => () => {
    setCommentImages(prevCommentImages => ({
      ...prevCommentImages,
      [postId]: null
    }));
  };

  const handleCommentInput = async (e)=>{
    e.preventDefault()
    const avatar_url = user.image
    const profile_name = user.profile_name
    const content = commentInput
    const created_at = new Date(Date.now())
    const image = commentImages[post.post_id]
    const commentObj ={
      avatar_url: avatar_url,
      likes: 0,
      username: profile_name,
      content: content,
      created_at: created_at
    }
    const response = await commentOnPost(user.token, post.post_id, commentInput, image);
    console.log(response)
    if(response?.status === 201){
      const insert =[commentObj, ...comments]
      setTotalComment (totalComment + 1)
      setComments(insert)
      setCommentInput("")
      setCommentImages(prevCommentImages => ({ // Reset the image for the current post
        ...prevCommentImages,
        [post.post_id]: null
      }));
    }
  }

   const handleFriendsId=(id)=>{
      const friendsIdFilter = posts.filter(val => {
        return val.user_id === id;
      })
      setFriendsProfile(friendsIdFilter)
   }

   const [socialIcons,setSocialIcons] = useState(false)



  const handleMediaUrls = (mediaUrls) => {
    return mediaUrls.map((url, idx) => 
    <img key={idx} src={url} alt="" style={{width: '100%', height: '600px'}}/>);
  }

  return (
    <div className='post'>
      <div className='post-header'>
        <Link to={`/users/${post.user_id ? post.user_id : null}`} style={{textDecoration:"none"}}>
        <div className='post-user'style={{cursor:"pointer"}}>
            <img src={post.profilepicture ? post.profilepicture : post.avatar_url} className='p-img' alt="" />
            <h2>{post.profile_name }</h2>
            <p className='datePara'>{post.datetime ? post.datetime : handleDateDiff(post.created_at)}</p>
        </div>
        </Link>
         
         <div className='delete'>
         {showDelete && (<div className="options">
            <button><PiSmileySad />Not Interested in this post</button>
            <button><MdBlockFlipped />Block this user</button>
            <button><MdReportGmailerrorred />Report post</button>
         </div>
        
         )}
          <MoreVertRoundedIcon className='post-vertical-icon' onClick={()=>setShowDelete(!showDelete)}/>
         </div>
       </div>

      <p className='body'>
          {
            post.content && post.content.length <= 500 ? post.content :
            post.content
          }
      </p>    
      {
        post.shared_post_details && <SharedPost post={post} token={user.token} />
      }
      {post.images_url.length == 1 ? post.images_url.map((img, index) => (
      <img 
        key={index} 
        src={img} 
        alt="" 
        className={`post-img`} 
      /> 
      )) : post.images_url.length === 2 ? (
      <div className="multi-img two-images">
          {post.images_url.map((img, index) => (
              <div key={index} className="multi-image">
                  <img src={img} alt="" />
              </div>
          ))}
      </div>
      ) : post.images_url.length >= 3 ? (
          <div className="multi-img more-three-images">
              {post.images_url.map((img, index) => (
                  <img src={img} alt="" />
              ))}
          </div>
      ) : null}
      <div className="post-footer">
        <div className="like-icons">
          <p className='heart' 
            onClick={() => handlelikes(post.post_id)}
            style={{marginTop:"5px"}}
          >
              {filledLike}
          </p>

          <MessageRoundedIcon 
            onClick= {()=>setShowComment(!showComment)}
            className='msg'  
          />

          <ShareOutlinedIcon 
            onClick={()=>setSocialIcons(!socialIcons)}
            className='share'  
          />
          <ShareBoxModal isOpen={openShareModal} onClose={closeShareModal} postId={post.post_id}>
        {/* You can put the content of the modal here */}
          </ShareBoxModal>
          {socialIcons && (
          
              <div className="social-buttons">        
                <a className="social-margin">
                  <div className="social-icon facebook">
                    <PostAddIcon className='social-links' onClick={() => {setOpenShareModal(!openShareModal); 
                      setSocialIcons(!socialIcons)}
                    }/>
                  </div>             
                </a>
                <a href="https://www.instagram.com/" target="blank"  className="social-margin">
                  <div className="social-icon instagram">
                    <FiInstagram className='social-links'/>
                  </div>
                </a>
               
           </div>
          )}
        </div>
        

        <div className="like-comment-details">
          { like > 1 ? <span className='post-like'>{like} likes</span>  
          : like === 1 ? <span className='post-like'>{like} like</span> 
          : <></> }
          <span className='post-comment'>{totalComment} comments</span>
        </div>
        
       {showComment && (<div className="commentSection">
        <form onSubmit={handleCommentInput} style={{position:"relative"}}>
          <div className="cmtGroup">
            <SentimentSatisfiedRoundedIcon  className='emoji' onClick={()=> setShowEmojiPicker(!showEmojiPicker)} />
            <label htmlFor={`commentFile-${post.post_id}`}>
              <ImageIcon className='image'/>
              <input 
                type="file" 
                accept='image/*'
                id={`commentFile-${post.post_id}`} 
                onChange={onCommentImageChange(post.post_id)} 
                style={{ display: 'none' }} 
              />
            </label>
                
            <input 
              type="text" 
              id="commentInput"
              required
              placeholder='What are you thinking...'
              onChange={(e)=>setCommentInput(e.target.value)}
              value={commentInput}
            />
            
            <button type='submit'><SendRoundedIcon className='send' /></button> 
          </div>            
          {showEmojiPicker && (
              <EmojiPicker style={{position:'absolute', zIndex:"10"}} onEmojiClick={onEmojiClick} />
          )}
         {commentImages[post.post_id] && (
            <div className="commentImage">
              <img src={commentImages[post.post_id]} alt=""  style={{ 
                position: 'relative',
                width: '80%', 
                height: '80%',
                objectFit: 'contain', 
                overflow: 'hidden'
              }}  />
              <button onClick={deleteCommentImage(post.post_id)}>Delete Image</button>
            </div>
          )}
        </form>

        <div className="sticky">         
          {comments.map((cmt)=>(
            <Comments 
            className="classComment"
            cmt={cmt}
            key={cmt.comment_id}
            />
          ))}
          </div>
        </div>
        )}

      </div>     
    </div>
  )
}
export default Post