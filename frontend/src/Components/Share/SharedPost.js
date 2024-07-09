import React, { useEffect, useState } from 'react'
import "../Home/Post.css"

const SharedPost = ({post={post}}) => {
    const [sharedPost, setSharedPost] = useState()
    const [imagesUrl, setImagesUrl] = useState()
    useEffect(() => {
        console.log(post.shared_post_details)
        console.log(typeof(post.shared_post_details))
        console.log(JSON.parse(post.shared_post_details).avatar_url)
        setSharedPost(JSON.parse(post.shared_post_details))
    },[post])

    useEffect( () => {
        console.log(imagesUrl)

    },[imagesUrl])

    useEffect(() => {
        if(sharedPost?.images_url){
            const jsonString = sharedPost?.images_url.replace(/^{/g, '["').replace(/}$/g, '"]').replace(/,/g, '","');
            const images = JSON.parse(jsonString);
            console.log(images)
            if(images != ''){
                setImagesUrl(images);
            } 
        }
    }, [sharedPost?.images_url])
    if(!sharedPost) return null
    return (
         <div className='post'>
            <div className='post-user' style={{cursor:"pointer"}}>
                <img src={sharedPost?.avatar_url} className='p-img' alt="" />
                <h2>{sharedPost?.profile_name}</h2>
                <p className='datePara'>{new Date(sharedPost?.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }).replace(',', '')}</p>            
            </div>  
            
           {
        }
        <p className='body'>{
            sharedPost?.content
            // post.content.length <= 300 ? post.content : ""
            // : `${post.content ? post.content.slice(0,300) : ''}...`
        }</p>
        {/* {
          post.shared_post && 
        } */}
        {/* {post.img && (<img src={post.img} alt="" className="post-img" />)} */}
        {imagesUrl && imagesUrl?.length == 1 ? imagesUrl.map((img, index) => (
        <img 
          key={index} 
          src={img} 
          alt="" 
          className={`post-img`} 
        /> 
        )) : imagesUrl && imagesUrl?.length === 2 ? (
            <div className="multi-img two-images">
                {imagesUrl.map((img, index) => (
                    <div key={index} className="multi-image">
                        <img src={img} alt="" />
                    </div>
                ))}
            </div>
        ) : imagesUrl && imagesUrl?.length >= 3 ? (
            <div className="multi-img">
                {imagesUrl.map((img, index) => (
                    <div key={index} className="multi-image">
                        <img src={img} alt="" />
                    </div>
                ))}
            </div>   
        ) : null} 
    </div>
  )
}

export default SharedPost