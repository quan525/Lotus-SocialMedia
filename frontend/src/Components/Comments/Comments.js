import React, { useEffect, useState } from 'react'
import "../Comments/Comments.css"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { handleDateDiff } from '../../utils/utils.js';


const Comments = ({cmt}) => {
    const [booleonLike, setBooleonLike] = useState(false)
    const [likeCount, setLikeCount] = useState(cmt.likes)
    useEffect(()=> {
        console.log(cmt)
    })
    return (
      <div className="overAllCommentList">
          <div className="commentList">
              <div className='commentList1'>
                  <div className="commentHead">
                      <div><img src={cmt.avatar_url ? cmt.avatar_url : cmt.avatar_url} /></div>
                      <p><span>{cmt.username}</span><br></br>{cmt.content}</p>
                  </div>

                  <div className="commentFooter">
                      <p>{handleDateDiff(cmt.created_at)}</p>
                      <h4>{booleonLike ? likeCount +1 : likeCount} likes</h4>
                  </div>
              </div>
              <div className="commentList2">
                  <p 
                  className='cp'
                  onClick={()=>setBooleonLike(!booleonLike)}
                  style={{cursor:"pointer"}}
                  >
                      {booleonLike ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />}
                  </p>
              </div>
          </div>
      </div>
    )
}

export default Comments