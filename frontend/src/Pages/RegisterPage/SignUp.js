import React, { useEffect, useRef, useState, useContext } from 'react'
import "../RegisterPage/RegisterPage.css"
import {AiOutlineUser} from "react-icons/ai"
import {FiMail,  FiImage } from "react-icons/fi"
import {RiLockPasswordLine} from "react-icons/ri"
import { Link, useNavigate } from 'react-router-dom'
import validation from './Validation'
import FileInput from '../../Components/ImageInput/FileInput'
import ImageCropper from '../../Components/ImageInput/ImageCropper'
import axios from 'axios'
import { LoginContext } from '../../App'
import API_PATHS from '../../api/apiPath'
const SignUp = () => {

    const navigate =useNavigate()
    const {isLoggedIn, setLoggedIn} = useContext(LoginContext)
    const [error,setError] =useState({})
    const [submit,setSubmit] =useState(false)
    const [image, setImage] = useState(null)
    const [currentPage, setCurrentPage] = useState("choose-img")
    const [imgAfterCrop, setImgAfterCrop] = useState("")
    const [blob, setBlob] = useState(null)
    const onImageSelected = (selectedImage) => {
        setImage(selectedImage)
        setCurrentPage("crop-img")
    }

    //Callback function when cropping is done
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
 
    // const handleSignUp=(e)=>{
    //     e.preventDefault();
    //     setError(validation(data));

    //     if (!file || !file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
    //         console.log('Please select a valid image.');
    //         return;
    //     }

    //     setSubmit(true);

    //     const formData = new FormData();
    //     formData.append('image', file);
    //     formData.append('data', JSON.stringify(data)); 
    // }

    // useEffect(()=>{
    //     if(Object.keys(error).length === 0 && submit){
    //         navigate("/home")
    // },[error, submit])
    //     }

    function dataURLtoBlob(dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    const imageToDataUrl = (img) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/png');
    }
     
    function handleSignUp(e) {
        e.preventDefault();
        const errors = validation(data);
        setError(errors);

        // If there are any errors, return early to prevent the signup
        if (Object.keys(errors).length > 0) {
            return;
        }
        
        const formData = new FormData();
        if (blob) {  
            formData.append('file', blob);
        }        
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });

        // Post the form data to the backend
        axios.post(`${API_PATHS.api}/auth/register`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {                
            console.log(response.data);
            localStorage.setItem("data", JSON.stringify(response.data));
            const storedData = JSON.parse(localStorage.getItem("data"));
            console.log(storedData);
            setLoggedIn(true);
            navigate('/home')
            console.log(response.data);
            navigate("/home");
        })
        .catch(error => { console.log(error )})
    }   

    return (
         <div className="container">
         <div className="container-form">
            <form onSubmit={handleSignUp} >
                <h1>Create Account</h1>
                 <p>Please fill the input below here.</p>

                 <div className="inputBox">
                     <AiOutlineUser className='fullName'/>
                     <input type='text' 
                        name="username" 
                        id="fullname" 
                        onChange={handleChange}
                        placeholder='Full Name'
                 /> 
                </div>
                {error.username && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.username}</span>}
                <div className="inputBox">
                    <FiMail className='mail'/>
                    <input type="email"
                        name="email" 
                        id="email" 
                        onChange={handleChange}
                        placeholder='Email'
                    /> 
                </div>
                 {error.email && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.email}</span>}

                 <div className="inputBox">
                     <RiLockPasswordLine className='password'/>
                     <input type="password" 
                         name="password" 
                         id="password" 
                         onChange={handleChange}
                         placeholder='Password'
                    />
                </div>
                {error.password && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.password}</span>}


                <div className="inputBox">
                    <RiLockPasswordLine className='password'/>
                    <input type="password" 
                        name="confirmpassword" 
                        id="confirmPassword" 
                        onChange={handleChange}
                        placeholder='Confirm Password'
                />
                </div>
                {error.confirmpassword && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.confirmpassword}</span>}
                <div >
                    {currentPage === "choose-img" ? (
                        <FileInput onImageSelected={onImageSelected}/> 
                    ) : currentPage === "crop-img" ? (
                        <ImageCropper image={image} 
                          onCropDone = {onCropDone}
                          onCropCancel = {onCropCancel}
                        /> 
                    ): (
                    <div>
                        <div>
                          <img src={imgAfterCrop} alt="Cropped Image" style={{ width: "50%", height: "50%", borderRadius: "50%"}}/>
                        </div>                
                         <button onClick={()=> {
                          //Start over by choosing a new image
                          setCurrentPage("crop-img");
                        }}>
                          Crop 
                         </button>
                         <button onClick={()=> {
                          //Start over by choosing a new image
                          setCurrentPage("choose-img");
                          setImage("");
                        }}>
                          Choose Image
                        </button>
                    </div>
                    )}
                </div>
                <div className='divBtn'>
                    <button className='loginBtn' type='submit'>SIGN UP</button>
                </div>
            </form>

            <div className='dont'>
                <p>Already have a account? <Link to="/"><span>Sign in</span></Link></p>
            </div>
        </div>
    </div>
  )
}

export default SignUp