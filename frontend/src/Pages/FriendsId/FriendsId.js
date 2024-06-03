import React, { useContext } from 'react'
import Nav from '../../Components/Navigation/Nav'
import Left from '../../Components/LeftSide/Left'
import FriendsProfileMiddle from '../../Components/FriendsProfile/FriendsProfileMiddle'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Right from '../../Components/RightSide/Right'
import "../FriendsId/FriendsId.css"

import { getSingleUser } from '../../api/services/User'
import { UserContext } from '../../App'
const FriendsId = ({friendProfile, friendRequests}) => {

  const [otherUserProfile, setOtherUserProfile] = useState(null)
  const { userId } = useParams();
  useEffect(()=> {

    console.log("userId: ", userId)
  }, [userId])

  useEffect (() => {
    const getUser = async () => {
      const token = JSON.parse(localStorage.getItem("data")).token;
      const result =  await getSingleUser(token, userId)
      setOtherUserProfile(result.data)
    }
    getUser()
  }, [userId])

  useEffect(() => {
    console.log(otherUserProfile)
  }, [otherUserProfile])
  const [search,setSearch] =useState("")

  const [showMenu,setShowMenu] =useState(false)
  const [following,setFollowing] =useState("")

  return (
    <div className='interface'>
        <Nav 
             search={search}
             setSearch={setSearch}
             showMenu={showMenu}
             setShowMenu={setShowMenu}
             friendRequests={friendRequests}
             />
        <div className="home">
            <Left />
            <FriendsProfileMiddle userId={userId} friendProfile={otherUserProfile}/>
            <Right
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              following={following}
              setFollowing={setFollowing}
            />
        </div>
    </div>
  )
}

export default FriendsId