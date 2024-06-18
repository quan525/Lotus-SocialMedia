import React, { useContext } from 'react'
import Feedposts from './Feedposts'
import "../Home/Homepage.css"
import { UserContext } from '../../App'

const Homepage = ({posts,setPosts,setFriendsProfile,images}) => {
  return (

    <main className='homepage'>
        
        {posts.length ? <Feedposts 
                        images={images}
                        posts={posts}
                        setPosts={setPosts}
                        setFriendsProfile={setFriendsProfile}
                        /> 
        :
        (<p style={{textAlign:"center",marginTop:"40px"}}>
            NO POST IS HERE
        </p>)
        }
    </main>
  )
}

export default Homepage