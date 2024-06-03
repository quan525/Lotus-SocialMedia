import React, { useContext, useEffect } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { useState } from 'react';
import moment from "moment"

import PostAddIcon from '@mui/icons-material/PostAdd';
import {FiInstagram} from "react-icons/fi"
import {BiLogoLinkedin} from "react-icons/bi"
import {FiGithub} from "react-icons/fi"

import SharedPost from '../../Share/SharedPost'
import Comments from '../../Comments/Comments';
import { UserContext } from '../../../App';
import { LikePost, UnLikePost } from '../../../api/services/Likes';

const InfoFriendPost = ({val}) => {

  const [comments,setComments] =useState([])
    
  useEffect((val)=> {
    console.log(val)
  },[val])
  const user = useContext(UserContext)
  const [like,setLike] = useState(val.likes_count)
  const [unlike,setUnlike] =useState(false)

  const [filledLike,setFilledLike] =useState(<FavoriteBorderOutlinedIcon />)
  const [unFilledLike,setUnFilledLike] =useState(false)

  const handlelikes= async (postId)=>{
    setLike(unlike ? like -1 :like +1)
    setUnlike(!unlike)
    console.log(postId)
    setFilledLike(unFilledLike ?   <FavoriteBorderOutlinedIcon /> : <FavoriteRoundedIcon />)
    setUnFilledLike(!unFilledLike)
    if(unlike){
      await UnLikePost(user.token, postId)
      .then((res) => console.log(res))
      setLike(like - 1)
    }else if(!unlike){
      await LikePost(user.token, postId)
      .then((res) => console.log(res))
      setLike(like + 1)
    }

  }

  const [showComment,setShowComment] = useState(false)

  const [commentInput,setCommentInput] =useState("")

  const handleCommentInput=(e)=>{
     e.preventDefault()

    const id=comments.length ? comments[comments.length -1].id +1 : 1
    const username="Vijay"
    const comment =commentInput
    const time= moment.utc(new Date(), 'yyyy/MM/dd kk:mm:ss').local().startOf('seconds').fromNow()

    const commentObj ={
      id:id,
      likes:0,
      username:username,
      comment:comment,
      time:time
    }
    const insert =[...comments,commentObj]
    setComments(insert)
    setCommentInput("")
  }

  const [socialIcons,setSocialIcons] = useState(false)

  return (
    <div className='post' style={{marginTop:"10px"}}>
    <div className='post-header'>

      <div className='post-user'>
          <img src={val.avatar_url} className='p-img' alt="" />
          <h2>{val.profile_name}</h2>
          <p  className='datePara'>{new Date(val.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
       
       
     </div>

      <p className='body'>{val.content}</p>
      {
        val.shared_post && <SharedPost post={val} />
      }
      {val.images_url.length == 1 ? val.images_url.map((img, index) => (
      <img 
        key={index} 
        src={img} 
        alt="" 
        className={`post-img`} 
      /> 
      )) : val.images_url.length === 2 ? (
          <div className="multi-img two-images">
              {val.images_url.map((img, index) => (
                  <div key={index} className="multi-image">
                      <img src={img} alt="" />
                  </div>
              ))}
          </div>
      ) : (
          <div className="multi-img">
              {val.images_url.map((img, index) => (
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
          onClick={() => handlelikes(val.post_id)}
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
                <PostAddIcon className='social-links'/>
              </div>
            </a>
            
            <a href="https://pinterest.com/" target="blank"  className="social-margin">
              <div className="social-icon instagram">
                <FiInstagram className='social-links'/>
              </div>
            </a>
            
            <a href="http://linkedin.com/" className="social-margin" target="blank">
              <div className="social-icon linkedin">
                <BiLogoLinkedin className='social-links'/>
              </div> 
            </a>
         
            <a href="https://github.com/"  target="blank"  className="social-margin">
              <div className="social-icon github">
                <FiGithub className='social-links'/>
              </div>
            </a>
            
       </div>
      )}
      </div>
      

      <div className="like-comment-details">
        <span className='post-like'>{val.likes_count} people like it,</span>
        <span className='post-comment'>{val.comments_count} comments</span>
      </div>
      
     {showComment && (<div className="commentSection">
      <form onSubmit={handleCommentInput}>
        <div className="cmtGroup">
            <SentimentSatisfiedRoundedIcon className='emoji'/>
            
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

export default InfoFriendPost