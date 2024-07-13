import React, { useContext, useEffect } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { useState } from 'react';

import PostAddIcon from '@mui/icons-material/PostAdd';
import {AiFillYoutube} from "react-icons/ai"

import SharedPost from '../../Share/SharedPost'
import Comments from '../../Comments/Comments';
import { UserContext } from '../../../App';
import { LikePost, UnLikePost } from '../../../api/services/Likes';
import { fetchPostComments, commentOnPost } from '../../../api/services/Comments';
const InfoFriendPost = ({val}) => {

  const [comments,setComments] =useState([])
    
  const [totalComments,setTotalComments] = useState(val.comments_count)
  const user = useContext(UserContext)
  const [like,setLike] = useState(val.likes_count)
  const [unlike,setUnlike] =useState(false)

  const [filledLike,setFilledLike] =useState(<FavoriteBorderOutlinedIcon />)
  const [unFilledLike,setUnFilledLike] =useState(false)

  const [openShareModal, setOpenShareModal] = useState(false)
  const closeShareModal = () => setOpenShareModal(false);

  const handlelikes= async (postId)=>{
    setLike(unlike ? like -1 :like +1)
    setUnlike(!unlike)
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
  const handleCommentInput = async (e)=>{
     e.preventDefault()

    
    const avatar_url = user.image
    const profile_name = user.profile_name
    const content = commentInput
    const created_at = new Date(Date.now())
    const commentObj ={
      avatar_url: avatar_url,
      likes: 0,
      username: profile_name,
      content: content,
      created_at: created_at
    }
    const response = await commentOnPost(user.token, val.post_id, commentInput);
    if(response?.status === 201){
      const insert =[commentObj, ...comments]
      setTotalComments (totalComments + 1)
      setComments(insert)
      setCommentInput("")
    }
  }
  useEffect(() => {
    console.log(val)
    if(val?.user_like_ids.includes(user.user_id)){
      setFilledLike(<FavoriteRoundedIcon />)
      setUnFilledLike(true)
      setUnlike(true)
    }
  },[val])

 useEffect(() => {
  if(showComment && user.token && val.post_id ){
    const fetchData = async () => {
      try {
        const comments = await fetchPostComments(user.token, val.post_id);
        if (comments) {
          setComments(comments);
        }
      } catch (error) {
        console.error('Error fetching post comments:', error);
      }
    };
    console.log("fetching comments")
    fetchData();
  }}, [showComment])
  
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
      ) : val.images_url.length > 3 ? (
          <div className="multi-img">
              {val.images_url.map((img, index) => (
                  <div key={index} className="multi-image">
                      <img src={img} alt="" />
                  </div>
              ))}
          </div>
      ) : null}     

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
                <PostAddIcon className='social-links' onClick={() => {setOpenShareModal(!openShareModal); 
                  setSocialIcons(!socialIcons)}
                }/>
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
        <span className='post-like'>{like} people like it,</span>
        <span className='post-comment'>{totalComments} comments</span>
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