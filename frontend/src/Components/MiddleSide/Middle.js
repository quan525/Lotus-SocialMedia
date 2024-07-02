import React, { useEffect, useState } from 'react'
import InputPost from '../Post/InputPost'
import Homepage from "../Home/Homepage"
import "../MiddleSide/Middle.css"


const Middle = ({handleSubmit,
                body,
                setBody,
                posts,
                setPosts,
                handleFileChange,
                handleImageClick,
                files,
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
        handleImageClick={handleImageClick}
        handleFileChange={handleFileChange}
        files={files}
        handleSubmit={handleSubmit}
        body ={body}
        setBody ={setBody}
        posts = { searchResults }
        setSearchResults = { setSearchResults }
        setPosts = { setPosts }
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