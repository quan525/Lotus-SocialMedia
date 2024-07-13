import React, { useContext, useEffect, useState } from 'react'
import "../InfoProfile/Info.css"
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import Modal from 'react-modal';
import { UpdateAvatar } from '../../../../api/services/User.js';
import {LiaEdit} from "react-icons/lia"
import '../../../Modals/PostBoxModal.css'
import {IoCameraOutline} from "react-icons/io5"

import {BiLogOut} from "react-icons/bi"
import { useRef } from 'react';
import ModelProfile from '../ModelProfile/ModelProfile.js';
import { Link } from 'react-router-dom';
import FileInput from '../../../ImageInput/FileInput.js'
import ImageCropper from '../../../ImageInput/ImageCropper.js';
import { UserContext, LoginContext, UpdateProfileContext} from '../../../../App';
import "../../../ImageInput/ImageCropper.css"
import { useAlert } from 'react-alert';
export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '600px',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
  }
};
const Info = ({userPostData,
              profileImg,
              setProfileImg,
              name,
              setName,
              gender,
              setGender,
              friendsList,
              setShowFriendsList}) => {
  const alert = useAlert()
  const profileContext =  useContext(UpdateProfileContext)
  const {isLoggedIn, setLoggedIn} = useContext(LoginContext)
  const [coverImg,setCoverImg] =useState()
  const [openProfileImageEdit,setOpenProfileImageEdit] =useState(false)
  const importProfile=useRef()
  const importCover =useRef()
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [image, setImage] = useState(null)
  const [currentPage, setCurrentPage] = useState("choose-img")
  const [imgAfterCrop, setImgAfterCrop] = useState("")
  const [blob, setBlob] = useState(null)
  const onImageSelected = (selectedImage) => {
      setImage(selectedImage)
      setCurrentPage("crop-img")
  }

const onCropDone = (imgCroppedArea) => {
        const canvasEle = document.createElement('canvas');
        const context = canvasEle.getContext("2d");

        // Load the selected image
        let imageObj1 = new Image();
        imageObj1.src = image;
        imageObj1.onload = () => {
        const diameter = Math.min(imgCroppedArea.width, imgCroppedArea.height);
        const radius = diameter / 2;

        // Set the canvas dimensions to the diameter of the circle
        canvasEle.width = diameter;
        canvasEle.height = diameter;

        // Create a circular clipping path
        context.beginPath();
        context.arc(radius, radius, radius, 0, Math.PI * 2, false);
        context.closePath();
        context.clip();

        // Draw the image onto the canvas
        context.drawImage(
            imageObj1,
            imgCroppedArea.x,
            imgCroppedArea.y,
            imgCroppedArea.width,
            imgCroppedArea.height,
            0,
            0,
            diameter,
            diameter
        );

        // Convert the data content to a data URL {JPEG format}
        const dataURL = canvasEle.toDataURL("image/jpeg");
        
        setImgAfterCrop(dataURL);
        setCurrentPage("img-cropped");
        
        // Convert dataURL to Blob
        const blob = dataURLtoBlob(dataURL);
        setBlob(blob);
        }
    }
    function dataURLtoBlob(dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    const onCropCancel = () => { 
        setCurrentPage("choose-img");
    }

    const [data,setData] =useState({
        username:"",
        email:"",
        password:"",
        confirmpassword:"",
    })

    const handleChange=(e)=>{
        const newObj={...data,[e.target.name]:e.target.value}
        setData(newObj)
    }

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setImage("")
    setBlob("")
    setCurrentPage("choose-img")
    setImgAfterCrop("")
  };

  const handleFile1=(e)=>{
    if(e.target.files && e.target.files[0]){
      let img =e.target.files[0]
      const imgObj= {image:URL.createObjectURL(img)}
      const profileImg= imgObj.image
      setProfileImg(profileImg)
    }
  }

  const handleFile2 =(e)=>{
    if(e.target.files && e.target.files[0]){
      let img =e.target.files[0]
      const imgObj ={image:URL.createObjectURL(img)}
      const coverImg =imgObj.image
      setCoverImg(coverImg)
    }
  }

  const handleUpdateAvatar = async (blob) => {
    const result = await UpdateAvatar(userData?.token, blob );
    if(result.status === 200){      
        const localStorageData = JSON.parse(localStorage.getItem('data'));
        localStorageData.image = result.data.avatar_url;
        localStorage.setItem('data', JSON.stringify(localStorageData));
        profileContext.setUpdateProfile(true)
        alert.success("Avatar updated succesfully")
    }else {
      console.log(result)
      alert.error("Avatar update failed")
    }
  }
  const [openEdit,setOpenEdit] =useState(false)
  const [countryName,setCountryName]= useState("")
  const [email,setEmail]= useState("")
  const userData = useContext(UserContext)

const handleLogOut = () => {
  console.log("Logging out...");
  localStorage.removeItem("data")
  console.log("Removed user data from local storage");
  setLoggedIn(false)
  console.log("Set isLoggedIn to false");
  console.log("Navigated to home page");
}

  useEffect(()=> {
    setCoverImg(userData.cover_url)
    setProfileImg(userData.image)
    setEmail(userData.email)
  },[userData])
  
  return (
    <div className='info'>
        <div className="info-cover">
            <img src={coverImg} alt="cover image" />
            <img src={profileImg} alt="" />
            <div className='coverDiv'><IoCameraOutline className='coverSvg' onClick={()=>importCover.current.click()}/></div>
            {/* <div className='profileDiv'><IoCameraOutline className='profileSvg' onClick={()=>importProfile.current.click()}/></div> */}
            <div className='profileDiv'><IoCameraOutline className='profileSvg'onClick={openModal}/></div>
        </div>
        
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles} 
        >
          <h2>Creete New Avatar</h2>
          {/* <textarea style={{width:'450px',height:'200px', borderWidth:'0 0 2px'
            ,textAlign:'start', outline:'none', fontSize:"18px"
          }} type='text' placeholder="What's on your mind?" /> */}
          {currentPage === "choose-img" ? (
              <FileInput onImageSelected={onImageSelected}/> 
          ) : currentPage === "crop-img" ? (
              <ImageCropper image={image} 
                onCropDone = {onCropDone}
                onCropCancel = {onCropCancel}
              /> 
          ): (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={imgAfterCrop} alt="Cropped Image" style={{ width: "50%", height: "50%", borderRadius: "50%" }}/>
            </div>    
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "220px", height:"100px", marginTop: "20px" }}>        
              <button className="btn" style={{width:"65px"}} onClick={() => {
                // Start over by choosing a new image
                setCurrentPage("crop-img");
              }}
              >
                Crop 
              </button>
              <button className="btn " onClick={() => {
                // Start over by choosing a new image
                setCurrentPage("choose-img");
                setImage("");
              }}>
                Choose Image
              </button>              
              <button className="btn " onClick={() => {
                // Start over by choosing a new image
                setCurrentPage("choose-img");
                setImage("");
                closeModal();
                handleUpdateAvatar(blob);
              }}>
                Upload
              </button>
            </div>    
          </div>
          )}
        </Modal >
        <input type="file" 
          accept="image/*"
          alt="cover_img"
          ref={importProfile}
          onChange={handleFile1}
          style={{display:"none"}}
        />

        <input type="file" 
          accept="image/*"
          alt="profile_img"
          ref={importCover}
          onChange={handleFile2}
          style={{display:"none"}}
        />

        <div className="info-follow">
            <h1>{ name ? userData.profile_name : "Guest"}</h1>
            <p>{}</p>

            <Link to="/" className='logout'  onClick={()=> handleLogOut()}>
              <BiLogOut/>Logout
            </Link>

            <button onClick={()=>setOpenEdit(true)}><LiaEdit />Edit Profile</button>
            <ModelProfile 
              name={ name }
              setName={setName}
              gender={gender}
              setGender={setGender}
              countryName={countryName}
              setCountryName={setCountryName}
              email={email}
              setEmail={setEmail}
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
            />
          

          <div className="info-details">
            <div className="info-col-1">
              {
                userData?.location && 
                <div className="info-details-list">
                  <LocationOnOutlinedIcon />
                  <span>{userData.location}</span>
                </div>
              }

              <div className="info-details-list">
                <EmailOutlinedIcon />
                <span>{email}</span>
              </div>

              <div className="info-details-list">
                <CalendarMonthRoundedIcon />
                <span>Joined on {userData.created_at}</span>
              </div>
            </div>

            <div className="info-col-2">
              {
                gender && 
                <div>
                  <span>Gender</span>
                  <h4>{gender}</h4>
                </div>
              }
              <div onClick={() => setShowFriendsList(true)}>
                <span>Friends</span>
                <h3>{friendsList?.length}</h3>
              </div>
              <div onClick={() => setShowFriendsList(false)}>
                <span>Post</span>
                <h3>{userPostData.length}</h3>
              </div>
            </div>

          </div>


        </div>
    </div>
  )
}

export default Info