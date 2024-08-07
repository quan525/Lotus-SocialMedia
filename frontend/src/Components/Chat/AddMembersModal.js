import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { UserContext } from '../../App';
import { SearchUsers } from '../../api/services/User';

import { addMembers } from '../../api/services/Messages';
import { useAlert } from 'react-alert';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AddMembersModal = ({ open, handleClose, setFetchRooms, roomMembers, roomId, chatRoomUsers, setChatRoomUsers }) => {  
    const user = useContext(UserContext);
    const alert = useAlert();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
  
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        } 
        try {
          const response = await SearchUsers(user.token, query)
          if(response.status == 200){
            
          console.log(response);

          setSearchResult(response.data.rows.filter(user=> {
            return !chatRoomUsers.some(member => member.user_id == user.user_id)
          }));
          }else{
            console.log(response) 
          }
        } catch (error) {
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Note archived"/>
        }
    }
    useEffect(() => {
        console.log(selectedUsers)
    }, [selectedUsers])

    const handleSelectUser = (selectUser) => {
        if (selectedUsers.find(user => user.user_id === selectUser.user_id) || chatRoomUsers.find(member => member.user_id === selectUser.user_id) || selectUser.user_id === user.user_id) {
            console.log("User already added or is in the room.");
            return;
        }
        setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, selectUser]);
    }

    const handleAddMembers = async () => {
      handleClose()
      setSearchResult([])
      setSearch("")
      setSelectedUsers([])
      const result = await addMembers(user.token, selectedUsers, roomId)
      if(result.status === 200){
        alert.success("Members added successfully")
        setChatRoomUsers(chatRoomUsers => [...chatRoomUsers, ...selectedUsers])
        setFetchRooms(true)
      }else {
        alert.error("Error adding members" + result?.data)
      }
      console.log(result)
      // if(selectedUsers.length > 0) {
      //   const response = await addMembers(user.token, selectedUsers, roomId)
      // }

    }
    
    const handleDeleteUser = async (userId) => {
      setSelectedUsers(selectedUsers.filter((user) => user.user_id !== userId))
      return
    }
    return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
        <div>
        <Box sx={{ ...style, width: 500 }}>
            <h2 id="parent-modal-title">Add Member</h2>

            <TextField
                id="input-with-icon-textfield"
                label="Search Users"
                onChange={(e) => handleSearch(e.target.value)}
                fullWidth
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                }}
                variant="standard"
            /> 
            <Stack direction="row" spacing={1} style={{ marginTop: '10px' }}>
            {
                selectedUsers.slice(0, 3).map((user, index) => (
                    <Chip key={index} label={user.profile_name} onDelete={() => handleDeleteUser(user.user_id)} />
                ))
            }
            {
                selectedUsers.length > 3 && (
                    <Chip key="ellipsis" label={`+${selectedUsers.length - 3} more`} />
                )
            }
            </Stack>
            {
                searchResult.map((searchUser)=> {
                    if(searchUser.user_id != user.user_id)
                    return(
                        <ListItem button key={searchUser.user_id} onClick={()=> handleSelectUser(searchUser)}>
                            <ListItemIcon>
                                <Avatar alt={searchUser.user_profile_name} src={searchUser.avatar_url} />
                            </ListItemIcon>
                            <ListItemText primary={searchUser.profile_name} />
                        </ListItem>)
                })
            }
            <Button variant="contained" endIcon={<AddCircleIcon />} spacing={1} style={{ marginTop: '10px' }} onClick={()=> handleAddMembers()}>
              Add member
            </Button>
        </Box>      
      </div>
    </Modal>
  );
};

export default AddMembersModal;