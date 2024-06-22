import React from 'react'
import "../Home/Post.css"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';

import {PiSmileySad} from "react-icons/pi"
import {IoVolumeMuteOutline} from "react-icons/io5"
import {MdBlockFlipped} from "react-icons/md"
import {AiOutlineDelete} from "react-icons/ai"
import {MdReportGmailerrorred} from "react-icons/md"

import {FiInstagram} from "react-icons/fi"
import {BiLogoLinkedin} from "react-icons/bi"
import {AiFillYoutube} from "react-icons/ai"
import PostAddIcon from '@mui/icons-material/PostAdd';
import {FiGithub} from "react-icons/fi"
import axios from 'axios';
import { useState, useContext } from 'react';
import Comments from '../Comments/Comments';
import moment from 'moment';
import { UserContext } from '../../App';

import SharedPost from '../Share/SharedPost';
import API_PATHS from '../../api/apiPath';
import { handleDateDiff } from '../../utils/utils'
import { commentOnPost } from '../../api/services/Comments';

import { useAlert } from 'react-alert'
const PostUser = ({posts,post,setPosts,profileImg,modelDetails,images}) => {
  const userData = useContext(UserContext)
  const [comments,setComments] =useState([])
  const [totalComment,setTotalComment] = useState(post?.comments_count || 0)

  const [like,setLike] = useState(post.like)
  const [unlike,setUnlike] =useState(false)

  const [filledLike,setFilledLike] =useState(<FavoriteBorderOutlinedIcon />)
  const [unFilledLike,setUnFilledLike] =useState(false)

  const alert = useAlert()

  const handlelikes=()=>{
    setLike(unlike ? like -1 :like +1)
    setUnlike(!unlike)

    setFilledLike(unFilledLike ?   <FavoriteBorderOutlinedIcon /> : <FavoriteRoundedIcon />)
    setUnFilledLike(!unFilledLike)
  }
  

  const [showDelete,setShowDelete] = useState(false)
  const [showComment,setShowComment] = useState(false)


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
      if(response.status === 200) {
        const deleteFilter = posts.filter(val=> val.post_id !== id)
        alert.success("Post deleted successfullyb ")
        setPosts(deleteFilter)
        setShowDelete(false)
      }else {
        alert.show(response?.data)
      }
    })
  const deleteFilter = posts.filter(val=> val.id !== id)
    setPosts(deleteFilter)
    setShowDelete(false)
  }
 
  const [commentInput,setCommentInput] =useState("")

  const handleCommentInput = async (e)=>{
     e.preventDefault()

    
    const avatar_url = userData.image
    const profile_name = userData.profile_name
    const content = commentInput
    const created_at = new Date(Date.now())
    const commentObj ={
      avatar_url: avatar_url,
      likes: 0,
      username: profile_name,
      content: content,
      created_at: created_at
    }
    const response = await commentOnPost(userData.token, post.post_id, commentInput);
    console.log(response)
    if(response?.status === 201){
      const insert =[commentObj, ...comments]
      setTotalComment (totalComment + 1)
      setComments(insert)
      setCommentInput("")
    }
    
  }

  const [socialIcons,setSocialIcons] = useState(false)

  return (
    <div className='post'>
      <div className='post-header'>
        <div className='post-user' style={{cursor:"pointer"}}>
            <img src={userData.image} className='p-img' alt="" />
            <h2>{userData.profile_name}</h2>
            <p className='datePara'>{handleDateDiff(new Date(post.created_at))}</p>            
        </div>  
         <div className='delete'>
         {showDelete && (
         <div className="options">
         <button onClick={()=>handleDelete(post.post_id)}><AiOutlineDelete />Delete</button>
         </div>
         )}
          <MoreVertRoundedIcon className='post-vertical-icon' onClick={()=>setShowDelete(!showDelete)}/>
         </div>
       </div>
       {
    }
    <p className='body'>{
        post?.content
        // post.content.length <= 300 ? post.content : ""
        // : `${post.content ? post.content.slice(0,300) : ''}...`
    }</p>
    {
      post.shared_post && <SharedPost post={post} />
    }
      {/* {post.img && (<img src={post.img} alt="" className="post-img" />)} */}
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
      ) : (
          <div className="multi-img">
              {post.images_url.map((img, index) => (
                  <div key={index} className="multi-image">
                      <img src={img} alt="" />
                  </div>
              ))}
          </div>
      )}      
      <div className="post-foot">
       <div className="post-footer">
        <div className="like-icons">
          <p className='heart' 
            onClick={handlelikes}
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

        {socialIcons && (
          
          <div className="social-buttons">        
    
            <a className="social-margin">
              <div className="social-icon facebook">
                {/* <PostAddIcon className='social-links' onClick={() => {setOpenShareModal(!openShareModal); 
                  setSocialIcons(!socialIcons)}
                }/> */}
                <PostAddIcon className='social-links'/>
              </div>             
            </a>
            
            <a href="http://youtube.com/" target="blank"  className="social-margin">
              <div className="social-icon youtube">
              <AiFillYoutube className='social-links'/>
              </div> 
            </a>
       </div>
      )}
    </div>
        

        <div className="like-comment-details">
          <span className='post-like'>{post?.likes_count} likes,</span>
          <span className='post-comment'>{post?.comments_count} comments</span>
        </div>
        
       {showComment && (<div className="commentSection">
        <form onSubmit={handleCommentInput}>
          <div className="cmtGroup">
              <SentimentSatisfiedRoundedIcon className='emoji'
              />
              
              <input 
              type="text" 
              id="commentInput"
              required
              placeholder='Add a comment...'
              onChange={(e)=>setCommentInput(e.target.value)}
              value={commentInput}
               />
              
              <button type='submit'><SendRoundedIcon className='send' /></button> 
          
          </div>
        </form>

        <div className="sticky">
          {comments.map((cmt)=>(
            <Comments 
            modelDetails={modelDetails}
            className="classComment"
            cmt={cmt}
            key={cmt.id}
            />
          ))}
          </div>
        </div>
        )}

      </div>     
    </div>
  </div>
  )
}

export default PostUser
