import React, { useEffect, useState } from 'react'
import InputPost from '../Post/InputPost'
import Homepage from "../Home/Homepage"
import "../MiddleSide/Middle.css"
import axios from 'axios';


const Middle = ({handleSubmit,
                body,
                setBody,
                setImportFile,
                posts,
                setPosts,
                search,
                searchResults,
                setSearchResults,
                images,
                setImages,
                handleImageChange,
                emptImg,
                setEmptImg,
                setFriendsProfile
              }) => {
    
  

  useEffect(()=>{
    console.log("post", posts)
  },[posts])
  return (
    <div className='M-features'>
        <InputPost
        handleSubmit={handleSubmit}
        body ={body}
        setBody ={setBody}
        posts = { searchResults }
        setSearchResults = { setSearchResults }
        setPosts = { setPosts }
        setImportFile ={setImportFile}
        images={images}
        handleImageChange={handleImageChange}
        emptImg ={emptImg}
        setEmptImg={setEmptImg}
        setImages={setImages}
        />

        <Homepage 
        posts ={searchResults}
        setPosts={setPosts}
        setFriendsProfile={setFriendsProfile}
        images={images}
        />
    </div>
  )
}

export default Middle