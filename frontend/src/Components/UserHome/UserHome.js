import React from 'react'
import FeedUser from './FeedUser'


const UserHome = ({setUserPostData,userPostData,profileImg,modelDetails,images, setFetchProfilePosts}) => {
  return (
    <div>
        {userPostData.length ? <FeedUser 
                               modelDetails ={modelDetails}
                               profileImg={profileImg}
                               posts={userPostData}
                               setPosts={setUserPostData}
                               images={images}
                               setFetchProfilePosts={setFetchProfilePosts}
                               /> 
        :
        (<p style={{textAlign:"center",marginBottom:"40px"}}>
            You have no posts yet
        </p>)
        }
    </div>
  )
}

export default UserHome 