import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import axios from 'axios';
import { UserContext } from '../../App';
import { SearchUsers } from '../../api/services/User';
import { CreateSingleChat, CreateGroupChat  } from '../../api/services/Messages';

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

const ariaLabel = { 'aria-label': 'description' };

const AddGroupChat = ({ open, handleClose, setChatRooms, chatRooms, setFetchRooms }) => {  
    const user = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [chatName, setChatName] = useState('')

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        } 
        try {
          const response = await SearchUsers(user.token, query)
          if(response.status == 200){
            
          console.log(response);
          setSearchResult(response.data.rows);
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

    const handleSelectUser = (user) => {
        if(selectedUsers.includes(user)){
            console.log("already added");
            return;
        }
        console.log(selectedUsers.map(user => user.user_id))
        setSelectedUsers([user,...selectedUsers ])
    }

    const handleCreateGroupChat = async () => {
      const addPerson = selectedUsers[0]
      const groupName = selectedUsers.length >= 2 && chatName !== ''  ? chatName : ""
      if(!selectedUsers.some(selectedUser => selectedUser.user_id === user.user_id)){
        setSelectedUsers([ ...selectedUsers])
      }
      console.log(selectedUsers[0])
      if(selectedUsers.length == 1){
        await CreateSingleChat(user.token, addPerson.user_id)
        .then((res)=> {
          console.log(res)
          if(res.status == 200){
            setFetchRooms(true)
          }
        })

      }else if(selectedUsers.length >= 2) {
        await CreateGroupChat(user.token, selectedUsers.map(user => user.user_id), groupName)
        .then((res) => {
          console.log(res)         
          if(res.status == 200){
            setFetchRooms(true)
          }
        })
      }
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
            <h2 id="parent-modal-title">Add Group Chat</h2>

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
            {
                selectedUsers.length >= 2 && (
                  <FormControl variant="standard" style={{ marginTop: '10px' }}>
                    <InputLabel htmlFor="component-simple">Chat name(optional)</InputLabel>
                    <Input id="component-simple" defaultValue="" onChange={(e) => setChatName(e.target.value)}/>
                  </FormControl>
                )
            }
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
                searchResult.map((user)=> {
                    return(
                        <ListItem button key={user.user_id} onClick={()=> handleSelectUser(user)}>
                            <ListItemIcon>
                                <Avatar alt={user.user_profile_name} src={user.avatar_url} />
                            </ListItemIcon>
                            <ListItemText primary={user.profile_name} />
                        </ListItem>)
                })
            }
            <Button variant="contained" endIcon={<AddCircleIcon />} spacing={1} style={{ marginTop: '10px' }} onClick={()=> handleCreateGroupChat()}>
              Create Group
            </Button>
        </Box>      
        <Card
            sx={{
              width: 600,
              height: 300,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
        >
        <TextField
            sx={{
              width: 300,
              input: { textAlign: 'center', padding: 1, fontSize: 20 },
            }}
            placeholder='My Awesome Org 🙂'
        />
        </Card>
      </div>
    </Modal>
  );
};

export default AddGroupChat;