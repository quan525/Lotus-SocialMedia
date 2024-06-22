import React, { useState }from 'react'
import Cropper from 'react-easy-crop'
import './ImageCropper.css'
const ImageCropper = ({ image, onCropDone, onCropCancel}) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  const [CroppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = (event) => {
    setAspectRatio(event.target.value);
  };
  
  return (
    <div className='cropper'>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Cropper
          image={image}
          aspect={1}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape="round" // circular crop mask
          style={{
            containerStyle: {
              width: '100%',
              height: '80%',
              backgroundImage: "#fff"
            },
          }}
        />
        <div className='btn-container' style={{ marginTop:"430px", display: "flex", justifyContent: "space-between", width: "210px", position:"absolute" }}>
          <button className='btn btn-outline' onClick={onCropCancel}>
            Cancel
          </button>
          <button
            className='btn'
            onClick={() =>{
              onCropDone(CroppedArea);          
            }}>
            Crop & Apply  
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper