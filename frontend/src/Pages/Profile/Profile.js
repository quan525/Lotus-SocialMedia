import { useContext, useEffect, useState } from 'react'
import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../../Components/Profile/ProfileMiddle'
import Right from '../../Components/RightSide/Right'
import Nav from '../../Components/Navigation/Nav'
import "../Profile/Profile.css"
import ProfileImg from "../../assets/profile.jpg"

import { UserContext } from '../../App'
const Profile = ({friendsList, setFriendsList, friendRequests}) => {
  const [search,setSearch] =useState("")

  const [showMenu,setShowMenu] =useState(false)
  const [images,setImages] =  useState(null)
  const [name,setName]= useState("")
  const [gender,setGender]= useState("")
  const [profileImg,setProfileImg] =useState(ProfileImg)
  
  const userData = useContext(UserContext)
  useEffect(() => {
    if(userData){
      setName(userData.profile_name)
      setGender(userData.gender)
    }
  },[userData])

  
  return (
    <div className='interface'>
        <Nav
        search={search}
        setSearch={setSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        profileImg={userData.image}
        friendRequests={friendRequests}
        />
      <div className="home">
        <Left 
        profileImg={profileImg}
        
        />

        <ProfileMiddle 
        search={search}
        images={images}
        setImages={setImages}
        name={name}
        setName={setName}
        gender={gender}
        setGender={setGender}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        friendsList={friendsList}
        setFriendsList={setFriendsList}
        />
        
        <Right 
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        />
      </div>
    </div>
  )
}

export default Profile