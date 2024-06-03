import { Label } from '@mui/icons-material';
import React, { useRef } from 'react'
import { RiImageAddFill } from "react-icons/ri";

const FileInput = ({ onImageSelected }) => {
    const inputRef = useRef();

    const handleOnChange = (event) => {
        if( event.target.files && event.target.files.length > 0){
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageSelected(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const onChooseImg = () => {
        inputRef.current.click();
    }

    return (
        <div className="inputBox" style={{display:"flex", justifyContent: "space-between"}}>
        <RiImageAddFill className='image' style={{ marginRight: "10px", width:"30px", height:"30px" }} onClick={onChooseImg}/>            <input 
                type="file" 
                accept="image/*" 
                onChange={handleOnChange} 
                ref={inputRef} 
                style={{display: 'none'}}
            />
        </div>
    );
}

export default FileInput;