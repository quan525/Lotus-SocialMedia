import Info from './ProfileComponents/InfoProfile/Info'
import UserHome from '../UserHome/UserHome'
import FriendsList from '../FriendsList/FriendsList'
import { createContext, useContext, useEffect, useState } from 'react'
import "../Profile/ProfileMiddle.css"
import ProfileInputPost from './ProfileComponents/ProfileInputPost'

import axios from 'axios'
import API_PATHS from '../../api/apiPath'
import { UserContext } from '../../App'

const ProfileMiddle = ({
                        search,
                        images,
                        setImages,
                        profileImg,
                        setProfileImg,
                        name,
                        setName,
                        gender,
                        setGender,
                        friendsList,
                        setFriendsList}) => {
  const [showFriendsList, setShowFriendsList] = useState(false)
  const [userPostData ,setUserPostData] =useState([])
  const [body,setBody] =useState("")
  const [importFile,setImportFile] =useState("")
  const userData = useContext(UserContext)
  const [fetchProfilePosts, setFetchProfilePosts] = useState(false)
  const fetchSelfPosts = async () => {
    if (!userData || !userData.token) {
      console.error("User data or user token not available");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    }

    try {
      const response = await axios.get(`${API_PATHS.api}/post/my-posts`, config);  
      console.log(response)
      setUserPostData(response?.data);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      if (error.response) {
        console.error("Server responded with status: ", error.response.status);
        console.error("Error response data: ", error.response.data);
      }
    }
    setFetchProfilePosts(false)
  }


  useEffect(() => {
    if (userData || fetchProfilePosts === true) {
      fetchSelfPosts();
    }
  }, [userData, fetchProfilePosts]);

  const handleSubmit = async (e)=>{
    e.preventDefault()
    const config = {
        headers: {
          Authorization: `Bearer ${ userData.token }`
        }
      }
    const url = `${API_PATHS.api}/post/posts`
    try {
      const response =  await axios.post(url, { content : body}, config);
      setBody("")
      setImages(null)
      if(response.status === 200){
        fetchSelfPosts();
      }
    } catch (error) {
      console.error("Error submitting post: ", error);
    }
  }

  

  const [searchResults,setSearchResults] =useState("")
    
    useEffect(()=>{
      // const searchData = userPostData.filter((val)=>(
      //   (val.body.toLowerCase().includes(search.toLowerCase()))
      //  ||
      //  (val.username.toLowerCase().includes(search.toLowerCase()))
      //  ))
      //  setSearchResults(searchData)
       
    },[userPostData,search])



  return (
    <div className='profileMiddle'>
        <Info 
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        userPostData={userPostData}
        name={name}
        setName={setName}
        gender={gender}
        setGender={setGender}
        friendsList={friendsList}
        setShowFriendsList={setShowFriendsList}
        />
        
        <ProfileInputPost
        handleSubmit={handleSubmit}
        body ={body}
        setBody ={setBody}
        importFile ={importFile}
        setImportFile ={setImportFile}
        images={images}
        setImages={setImages}
        />
        {
          showFriendsList ? <FriendsList friendsList={friendsList} setFriendsList={setFriendsList}/>
          :
            <UserHome 
              profileImg={profileImg}
              setUserPostData={setUserPostData}
              userPostData={userPostData}
              images={images}
              setFetchProfilePosts={setFetchProfilePosts}
            />
        }
    </div>
  )
}

export default ProfileMiddle