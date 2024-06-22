import {  useState, useEffect, createContext, useContext } from 'react';


import "../Home/Home.css"

import Left from "../../Components/LeftSide/Left"
import Middle from "../../Components/MiddleSide/Middle"
import Right from '../../Components/RightSide/Right'
import Nav from '../../Components/Navigation/Nav'
import SearchResultsList from '../../Components/Navigation/SearchResultsList'

import axios from 'axios'
import { UserContext } from '../../App';
import API_PATHS from '../../api/apiPath';

const Home = ({setFriendsProfile, friendRequests}) => {

  const [searchResults,setSearchResults] =useState("")
  const [posts,setPosts] = useState([])
  const [files, setFiles] = useState(null)
  const [imagefiles, setImageFiles] = useState(null)
  const user = useContext(UserContext)

  const [body,setBody] =useState("")
      
  const [images,setImages] =  useState(null)
  const items = useContext(UserContext);
  const handleFileChange = (event) => {

    const files = Array.from(event.target.files);
    const fileURLs = files.map(file => URL.createObjectURL(file));
    console.log(fileURLs)
    setImageFiles(files);
    setFiles(fileURLs);
  };
  
  const handleImageClick = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    const newImageFiles = [...imagefiles];
    newImageFiles.splice(index, 1);
    setFiles(newFiles);
  };
  const fetchPosts = async () => {
    const token = user.token;
    // Define the request headers including the Authorization header with the token
    const config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    try {
      const response = await axios.get(`${API_PATHS.api}/post/posts`, config);
      console.log(response.data)
      setPosts([...response.data]);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  }

  const handleSubmit =(e)=>{
    e.preventDefault()
    setBody("")
    const token = JSON.parse(localStorage.getItem("data")).token;
    // Define the request headers including the Authorization header with the token
    const config = {
        headers: {
            'Content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
        }
    };
    
    // Define the URL where you want to post the data
    const url = `${API_PATHS.api}/post/posts`;
    console.log(files)
    const formData = new FormData();
    formData.append('content', body);
    imagefiles.forEach(element => {
      formData.append('media',element)
    });
    // Make a POST request to the URL using Axios
    axios.post(url, formData, config)
        .then((response) => {
            console.log("Response:", response.data);
            alert.success("Posted successfully");
            setImageFiles(null);
            setFiles(null);
            fetchPosts();
        })
        .catch((error) => {
            console.error("Error:", error);
            alert.error("Error posting");
            // Handle errors if needed
    });
  }
      
  useEffect(() => {
      fetchPosts().then(() => {
    });
  }, [items]);


 
      
    // const id =posts.length ? posts[posts.length -1].id +1 :1
    // const username="Vijay"
    // const profilepicture=Profile
      // const datetime=moment.utc(new Date(), 'yyyy/MM/dd kk:mm:ss').local().startOf('seconds').fromNow()
      // const img =images ? {img:URL.createObjectURL(images)} : null
      
      // const obj ={id:id,
      //            profilepicture:profilepicture,
      //            username:username,
      //            datetime:datetime,
      //            img:img && (img.img),
      //            body:body,
      //            like:0,
      //            comment:0
      //           }
      
      // const insert =[...posts]
      // const insert =[...posts,obj]
      // setPosts(insert)

  useEffect(() => {
      // Update searchResults with all posts fetched from the API
      setSearchResults(posts);  
  }, [posts]);
    
   const [search,setSearch] =useState("")

    
  const [following,setFollowing] =useState("")
        
  const [showMenu,setShowMenu] =useState(false)

  const userData = useContext(UserContext)
  return (
   
    <div className='interface'>
        <Nav 
        friendRequests={friendRequests}
        search={search}
        setSearch={setSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        />        

    <div className="home">
   
        <Left />

        <Middle                 
          handleFileChange={handleFileChange}
          handleImageClick={handleImageClick}
          files={files}
          handleSubmit={handleSubmit}
          body ={body}
          searchResults = { searchResults }
          setSearchResults = { setSearchResults }
          setBody ={setBody}
          posts={posts}
          setPosts={setPosts}
          search={search}
          setFriendsProfile={setFriendsProfile}
          images={images}
          setImages={setImages}
        />

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

export default Home