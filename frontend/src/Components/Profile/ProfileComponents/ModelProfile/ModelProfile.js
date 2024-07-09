import { Modal, useMantineTheme } from '@mantine/core';
import "../ModelProfile/ModelProfile.css"

import { UserContext } from '../../../../App';
import { useContext, useState, useEffect} from 'react';

import { useAlert } from 'react-alert';
import { updateProfile } from '../../../../api/services/User';
import { UpdateProfileContext } from '../../../../App';
function ModelProfile({openEdit,setOpenEdit,handleModel,
                      name,setName,gender,
                      setGender,countryName,setCountryName,
                      email, setEmail
                      }) 
                      {
  const profileContext = useContext(UpdateProfileContext)
  const alert = useAlert();
  const theme = useMantineTheme();
  const userData = useContext(UserContext);
  const [profileName, setProfileName] = useState('')
  const [editGender, setEditGender] = useState('')
  const [editEmail, setEditEmail] = useState('')
  useEffect(()=> {
    if(userData){
      setProfileName(userData.profile_name)
      setEditGender(userData.gender == null ? null : userData.gender)
      setEditEmail(userData.email)
    }
  },[userData])

  const handleUpdateProfile = async (e) => {
  e.preventDefault();
  console.log(JSON.parse(localStorage.getItem('data')));
  await updateProfile(userData.token, { profileName : profileName , gender: editGender, email: editEmail })
    .then(res => {
      console.log(res)
      if(res.status === 200){
        const localStorageData = JSON.parse(localStorage.getItem('data'));
        localStorageData.profile_name = profileName;
        localStorageData.gender = editGender;
        localStorageData.email = editEmail;
        console.log(localStorageData);
        setGender(editGender)      
        alert.success(res.data)
        localStorage.setItem('data', JSON.stringify(localStorageData));
        setName(profileName);
        profileContext.setUpdateProfile(true);
      }else {
        alert.error(res?.data)
      }
      
      setOpenEdit(false);
    })
    .catch(err => {
      console.error(err);
    });
  }
  return (
    <>
      <Modal
        radius="8px"
        zIndex="1001"
        size="lg"
        opened={openEdit}
        title="Edit Info"
        onClose={()=>setOpenEdit(false)}
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
         
        }}
      >
        <form className='modelForm' onSubmit={handleModel}>
        <div className="row1">
          <div className="inputBox1">
            <input type="text" name="name" id="name" placeholder='Enter Name'
                  onChange={(e)=>setProfileName(e.target.value)}
                  value={profileName} 
                  required/>
          </div>
          <div className="inputBox1">
            {/* <input type="text" name="gender" id="name" placeholder='Choose Gender'
                    onChange={(e)=>setGender(e.target.value)}
                    value={gender}
                    /> */}
            <select name="cars" id="cars" onChange={(e)=> setEditGender(e.target.value)}>
              <option value="" disabled selected>Select your gender</option>
              
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="">Prefer not to say</option>
            </select>
          </div>
        </div>

          {/* <div className="inputBox1">
            <input type="text" name="countryname" id="name" placeholder='Enter Country'
                    onChange={(e)=>setCountryName(e.target.value)}
                    value={countryName}
                    />
          </div> */}

          <div className="inputBox1">
            <input type="text" name="Email" id="name" placeholder='Enter Email'
                   onChange={(e)=>setEditEmail(e.target.value)}
                   value={editEmail}
                   />
          </div>

          

          <button className='modelBtn' onClick={handleUpdateProfile}>Update</button>
        </form>
      </Modal>
    </>
  );
}


export default ModelProfile