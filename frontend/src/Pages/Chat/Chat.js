import React, { useContext, useEffect, useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@mui/material/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Badge from '@material-ui/core/Badge';
import Collapse from '@mui/material/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import InputAdornment from '@mui/material/InputAdornment';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NavChat from '../../Components/Chat/NavChat';
import AddGroupChat from '../../Components/Chat/AddGroupChatModal'
import AddMembersModal from '../../Components/Chat/AddMembersModal';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { styled } from '@mui/material/styles';
import { BsTelephoneFill } from "react-icons/bs";
import { handleDateDiff } from '../../utils/utils';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import EmojiPicker from 'emoji-picker-react';

import './Chat.css';

import { UserContext } from '../../App';
import { leaveChatRoom, fetchChatRooms, loadChatMessage, sendMessage, removeParticipant, deleteChatMessage} from '../../api/services/Messages';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles({
  paperEnd: {
    display: 'flex',
  },
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80%'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  borderLeft500: {
      borderLeft: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '77vh',
    overflowY: 'auto'
  }
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  maxWidth: 'auto',
  width: 'fit-content',
  color: theme.palette.text.primary,
}));

const Chat = ({socket}) => {
    const scrollRef = useRef(null);
    const connection = useRef(null)
    const classes = useStyles();
    const userData = useContext(UserContext)
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [fetchRooms, setFetchRooms] = useState(true)
    const [chatRooms, setChatRooms] = useState([])
    const [currentRoomId, setCurrentRoomId] = useState(null)
    const [chatMessage, setChatMessage] = useState([])
    const [currentRoomAdmin, setCurrentRoomAdmin] = useState(null)
    const [chatRoomUsers, setChatRoomUsers] = useState([])
    const [onlineRoom, setOnlineRoom] = useState([])
    const [openAddChat, setOpenAddChat] = useState(false);
    const [onWaitMessage, setOnWaitMessage] = useState({})
    const apiSendMessage = {
        "type" : 'message',
        "payload" : {
            'profile_name': userData.profile_name,
            'avatar_url' : userData.avatar_url,
            'room_id' : currentRoomId,
            'content' : message,
            'sender_id' : userData.user_id,
            'created_at' : new Date(Date.now()).toLocaleString()
        }
    }
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const onEmojiClick = (emojiObject) => {
    console.log(emojiObject);
        setMessage((prevInput) => prevInput + emojiObject.emoji);
    };

    useEffect(() => {
        console.log(chatRoomUsers)
        
    }, [chatRoomUsers])
    // function setRoomOnline(online,room_id) {
    //     for(const room in chatRooms){
    //         if(chatRooms[room].room_id === currentRoomId){
    //             chatRooms[room].online = online
    //         }
        
    // }
    //   connection.current.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     if(data.online){
    //         console.log("online", data)
    //         setRoomOnline(data.online,data.room_id)

    //         // chatRooms[data.room_id]["online"] = data.online
    //         return;
    //     }
    //     console.log("new message", data)
    //     setChatMessage((prevChatMessage) => [...prevChatMessage, data]);
    //   };
    const currentRoomIdRef = useRef(currentRoomId);

    useEffect(() => {
      currentRoomIdRef.current = currentRoomId;
    }, [currentRoomId]);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behaviour: "smooth" });
      }
      console.log(chatMessage)
    }, [chatMessage]);

    
    useEffect(() => {
        const socket = new WebSocket(`wss://lotus-api-n5eq.onrender.com?token=${userData.token}` );
        
        socket.onopen = (event) => { 
          console.log("Joining room", currentRoomId);
        };
        let setOnlineStatus;
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          function setRoomOnline()  {
            setOnlineRoom(prevState => ({
                ...prevState,
                [data.room_id] : false
            }) ) 
          }
          if(data.online){
            console.log(data)
            clearTimeout(setOnlineStatus)
            // console.log("online", data)
            setOnlineRoom(prevState => ({
              ...prevState,
              [data.room_id]: data.online
            }));
            setOnlineStatus = setTimeout(setRoomOnline, 60000)
              // chatRooms[data.room_id]["online"] = data.online
            return;
          }else if(data.peerId ){
            console.log("peer", data)
            return;
          } else if(data.content && data.room_id === currentRoomIdRef.current){
            setChatMessage((prevChatMessage) => [...prevChatMessage, data]);
          } else if(data.content && data.room_id !== currentRoomIdRef.current){
            setOnWaitMessage(prevState => ({
              ...prevState,
              [data.room_id]: (prevState[data.room_id] || 0) + 1
            }));          
        }
          console.log("new message", data)
        };
        
        connection.current = socket;
      
        // Clean up the effect
        return () => {
            socket.close();    
            clearTimeout(setOnlineStatus);
        }
    }, [userData.token]); 
    
    useEffect(()=>{
        if (fetchRooms || userData.token) {
            console.log("fetching room");
            const fetchData = async () => {
                try {
                    const result = await fetchChatRooms(userData.token);
                    console.log("result", result)
                    if(result === undefined) return;
                    setChatRooms([...result.data.rooms])
                } catch (error) {
                    console.error("Error fetching chat rooms:", error);
                }
            };
            fetchData();
            setFetchRooms(false);
        }       
    },[fetchRooms, userData.token])

    useEffect(()=> {
        
        const sendOnlineNotify = () => {
            connection.current.send(JSON.stringify({"type": "online", 
                                                    "payload": {
                                                        "user_id": userData.user_id
            }}))

        }
        if (connection.current && connection.current?.readyState === WebSocket.OPEN) {
            chatRooms.map((room) => {             
            const joinRoomMessage = {
              "type" : "join",
              "payload" : { "room_id" : room.room_id}   
            }    
            connection.current.send(JSON.stringify(joinRoomMessage))
            sendOnlineNotify()
            })
        } 

    },[chatRooms, connection.current.readyState])

    useEffect(()=> {
        console.log(onWaitMessage)
    },[onWaitMessage])

    useEffect(() => {        
        function sendOnlineStatus(){
            let online = navigator.onLine;
                console.log("send online")
            if(connection.current.readyState === WebSocket.OPEN && online)
            {
                connection.current.send(JSON.stringify({"type": "online", 
                                                        "payload": {"user_id": userData.user_id
                                                        }}))
            }else{
                console.log("The WebSocket connection is not open. Current state: " + connection.current.readyState);
                return;
            }
        }
        const intervalId = setInterval(sendOnlineStatus, 10000);
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [connection.current ? connection.current.readyState : null, navigator.onLine]);

    useEffect(()=> {
        console.log(currentRoomId)
        if(chatRooms && currentRoomId != null){ 
        
            const room = chatRooms.find(room => room.room_id === currentRoomId);
            if(room){
                const users = [...room.users]
                setOnWaitMessage(prevState => ({
                  ...prevState,
                  [room.room_id]: 0
                }));          
                setChatRoomUsers(users)
            }
        }
    },[currentRoomId])

    const handleLoadChat = async (roomId) => {
        try {

            const res = await loadChatMessage(userData.token, roomId)
            .then(res => {
                console.log(res.data)
                return res
            });
            setChatMessage([...res.data])
            setCurrentRoomId(roomId)
            setCurrentRoomAdmin(chatRooms.find(room => room.room_id === roomId)?.admin)
        } catch (error) {
            console.error('Error loading chat messages:', error);
        }
    };

    const handleClick = () => {
      setOpen(!open); 
    };
 
    const handleSendMessage = () => {
      console.log('Message:', message);
      if(message === '') {
        return;    
        }
      connection.current.send(JSON.stringify(apiSendMessage))
      setChatMessage([...chatMessage, apiSendMessage.payload])
      sendMessage(userData.token, currentRoomId, apiSendMessage.payload)
      setMessage('');
    } 

    const handleLeaveChat = async (roomId) => {
        try {
            const res = await leaveChatRoom(userData.token, userData.user_id, roomId);
            console.log(res)
            if(res.status === 200) {
                setChatRooms(chatRooms.filter((room) => room.room_id !== currentRoomId))
                setCurrentRoomId(null)
                setChatRoomUsers([])
                setFetchRooms(true)
                setCurrentRoomAdmin(null)
                setChatMessage([])
            }
        } catch (error) {
            console.error('Error leaving chat room:', error);
        }
    }

    const handleDeleteChat = async (roomId) => {
        try {
            const res = await deleteChatMessage(userData.token, roomId);
            if(res.status === 200) {
                setCurrentRoomId(null)
                setChatRoomUsers([])
                setFetchRooms(true)
                setCurrentRoomAdmin(null)
                setChatMessage([])
            }
        }
        catch(error) {
            console.log(error)
        }
    }

    const [openAddMembers, setOpenAddMembers] = useState(false);
    const handleOpenAddMembers = () => {
      setOpenAddMembers(true);
    };
    const handleCloseAddMembers = () => {
      setOpenAddMembers(false);
    }
    const handleRemoveMember = async (userId) => {
        try{
            const memberId = userId
            const res = await removeParticipant(userData.token, memberId, currentRoomId) 

            if(res.status === 200) {
                
                setChatRoomUsers(chatRoomUsers.filter(user => user.user_id != memberId))
                setFetchRooms(true)
                connection.current.send(JSON.stringify({"type": "removeMember", 
                                        "payload": {
                                            "room_id": currentRoomId,
                                            "user_id": memberId
                                        }}))
            }
        }catch (err){
            console.log(err)
        }
    }
    
    const handleCall = async (roomId) => {
        window.open('/Lotus/videocall', '_blank')
    }

    useEffect(() => {
        console.log("current room:" ,currentRoomId)
    }, [currentRoomId])
    
    const handleOpen = () => {
      setOpenAddChat(true);
    };
    const handleClose = () => {
      setOpenAddChat(false);
    };

    useEffect(()=> {
        console.log(openAddChat)
    },[openAddChat])
    return (
      <div>
		<NavChat user={userData} />
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
					<TextField
        				id="input-with-icon-textfield"
        				label="Search Users"
						fullWidth
        				InputProps={{
        			 	startAdornment: (
            				<InputAdornment position="start">
              					<SearchIcon />
           					</InputAdornment>
      					) ,
      				}}
      				variant="standard"
      			/>  
                </Grid>
                <Grid item xs={12} style={{padding: '10px'}}>
					<Button variant="outlined" startIcon={<GroupIcon />} onClick={()=> handleOpen()}>
                      Add chat
                    </Button>        
                    <AddGroupChat open={openAddChat} handleClose={handleClose} setChatRooms={setChatRooms} chatRooms={chatRooms} setFetchRooms={setFetchRooms}/>
                </Grid>                    

                <Divider />
                <List>
                    {
                        chatRooms.map((room) => {
                                let roomName = room?.name 
                                                || (room.users && room.users.length === 2 
                                                    ? room.users.find((user) => user.profile_name !== userData.profile_name).profile_name 
                                                    : (room.users && room.users.length > 0 
                                                        ? room.users.map((user,idx) =>idx < 3 ? user.profile_name : null).join(',') + "..." 
                                                        : ''));
                            return (
                                <ListItem button key={room.room_id} onClick={() =>handleLoadChat(room.room_id)}>
                                    <ListItemIcon>
                                        <Avatar alt={roomName} src={room.users.find((user) => user.profile_name !== userData.profile_name)?.avatar_url} />
                                    </ListItemIcon>
                                    <ListItemText primary={roomName} />
                                    {
                                      onWaitMessage[room.room_id] > 0 && currentRoomId != room.room_id && <Badge 
                                      color="secondary" 
                                      badgeContent={onWaitMessage[room.room_id]} 
                                      invisible={onWaitMessage[room.room_id] <= 0}
                                    >
                                    </Badge>     
                                    }                   
                                    <ListItemText secondary={onlineRoom[room.room_id] == true ? "online" : "offline"} align='right' />
                                </ListItem>
                            );
                        })
                    }
                </List>
            </Grid>
            <Grid item xs={6}>
                
                {
                    chatRooms.filter((room) => {
                        return room.room_id == currentRoomId
                    }).map((room) => {
                        return (
                            <ListItem button key={room.room_id}
                                            style={{ visibility: currentRoomId ? 'visible' : 'hidden' }} >
                                <ListItemIcon>
                                    <Avatar 
                                        alt={room.name} 
                                        src={room.users.find((user) => user.profile_name !== userData.profile_name)?.avatar_url} 
                                    />
                                </ListItemIcon>
                                <ListItemText primary={room?.name 
                                                || (room.users && room.users.length === 2 
                                                    ? room.users.find((user) => user.profile_name !== userData.profile_name).profile_name 
                                                    : (room.users && room.users.length > 0 
                                                        ? room.users.map((user,idx) =>idx < 3 ? user.profile_name : null).join(',') + "..." 
                                                        : ''))} />  
                                <IconButton onClick={() => handleCall()}>
                                    <BsTelephoneFill />
                                </IconButton>                        
                            </ListItem>
                        )
                    })
                }
                <Divider />
                <List className={classes.messageArea}>
                    {
                        chatMessage.map((msg,idx) => {
                            if(msg.sender_id === userData.user_id) {
                                return (
                                    <ListItem key={idx}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={5}>
                                            </Grid>
                                            <Grid item xs={6} style={{display: 'flex'}} justifyContent='flex-end' >
                                                <StyledPaper style={{
                                                  p: 2,
                                                  overflow: 'auto',
                                                  textAlign: 'right',
                                                }}>
                                                <Typography align="right" wrap="nowrap" >{msg.content}</Typography>
                                                </StyledPaper>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <ListItemIcon >
                                                    <Avatar alt={userData.profile_name} src={userData.avatar_url} />
                                                </ListItemIcon>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ListItemText align="right" secondary={handleDateDiff(msg.created_at)}></ListItemText>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                )
                            } else {
                                const user = chatRoomUsers.find(user=> user.user_id === msg.sender_id)
                                return (
                                    <ListItem key={idx}>
                                        <Grid container spacing={2} justifyContent='flex-start'>
                                            <Grid item xs={1}>
                                                <ListItemIcon>
                                                    <Avatar alt={user?.profile_name} src={user?.avatar_url} />
                                                </ListItemIcon>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="left">{user?.profile_name}</Typography>
                                                <StyledPaper style={{
                                                    p: 2,
                                                    overflow: 'auto',
                                                    textAlign: 'left',
                                                }}>
                                                    <Typography align="left" wrap="nowrap">{msg.content}</Typography>
                                                </StyledPaper>
                                            </Grid>        
                                            <Grid item xs={5}>    
                                            </Grid>        
                                            <Grid item xs={1}>    
                                            </Grid>
                                            <Grid item xs={11}>
                                                <ListItemText align="left" secondary={handleDateDiff(msg.created_at)}></ListItemText>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                )
                            }
                        })
                    }
                    
                    <h6 ref={scrollRef}></h6>
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>            
                        <div style={{position: 'relative'}}>
                            {showEmojiPicker && (
                                <EmojiPicker style={{position:'absolute', zIndex:"10", bottom: '50px'}} onEmojiClick={onEmojiClick} />
                            )}
                            <SentimentSatisfiedRoundedIcon  className='emoji' onClick={()=> setShowEmojiPicker(!showEmojiPicker)} style={{ visibility: currentRoomId ? 'visible' : 'hidden'}} />
                        </div>

                        <TextField id="outlined-basic-email" 
                        value = {message}
                        onChange= {(e)=>setMessage(e.target.value)}
                        fullWidth
                        style={{ visibility: currentRoomId ? 'visible' : 'hidden'}} />
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="primary" 
                            aria-label="add" 
                            onClick={()=> handleSendMessage(userData.token)}
                            style={{ visibility: currentRoomId ? 'visible' : 'hidden'}}><SendIcon /></Fab>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3} className={classes.borderLeft500}>
                <Grid container direction="column" alignItems='center' justifyContent='center'
                style={{ visibility: currentRoomId ? 'visible' : 'hidden' }}>
                    {
                        chatRooms.filter((room) => {
                            return room.room_id == currentRoomId
                        }).map((room) => {
                            return (
                                <>
                                    <Grid item xs={4}>
                                        <Avatar style={{ height: '70px', width: '70px', marginTop: '40px' }} src={room.users.find((user) => user.profile_name !== userData.profile_name)?.avatar_url} />
                                    </Grid>     
                                    <Grid item xs={4}>
                                        <Typography align="left" wrap="nowrap" >{room.name ? room.name : room.users.find((user) => user.profile_name !== userData.profile_name)?.profile_name }</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <NotificationsIcon style={{height: '30px', width:'30ox', marginTop:'20px'}}/>
                                    </Grid>      
                                </>
                            )
                        })
                    }
                    {
                        currentRoomAdmin != null || currentRoomAdmin != 'NULL' &&
                        <Grid item xs={12} style={{width: '100%'}}>
                            <ListItemButton onClick={handleOpenAddMembers} > 
                                <ListItemIcon>
                                    <PersonAddAlt1Icon/>
                                </ListItemIcon>
                                <ListItemText primary="Add Members" />
                            </ListItemButton>
                            <AddMembersModal open={openAddMembers} handleClose={handleCloseAddMembers} roomId={currentRoomId} roomMembers={chatRoomUsers} setFetchRooms={setFetchRooms}/>
                        </Grid>
                    }
                    <Grid item xs={12} style={{width: '100%'}}>
                        <ListItemButton onClick={handleClick}>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Member List" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            {
                                chatRooms.filter((room) => {
                                    return room.room_id === currentRoomId
                                }).map((room) => {
                                    return room.users.map((user) => {
                                        return (
                                            <List component="div" disablePadding style={{width: '100%'}}>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <Avatar alt={user.profile_name} src={user.avatar_url} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={user.profile_name} />
                                                    {currentRoomAdmin == userData?.user_id &&  user.user_id != userData.user_id &&
                                                        <PersonRemoveIcon style={{ color: 'red' }} onClick={() => handleRemoveMember(user.user_id)}/>
                                                    }
                                                </ListItemButton>
                                            </List>
                                        )
                                    })
                                })
                            }
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} style={{width: '100%'}}>     
                    {
                        chatRoomUsers?.length > 2 
                        ? 
                        <ListItemButton onClick={() => handleLeaveChat(currentRoomId)} style={{ visibility: chatRoomUsers.length > 2  ? 'visible' : 'hidden' }}>
                            <ListItemIcon>
                                <LogoutIcon/>                                                    
                            </ListItemIcon>
                            <ListItemText primary={"Leave Group Chat"} />
                        </ListItemButton> : chatRoomUsers.length <= 2 && chatRoomUsers.length > 0 
                        ? 
                        <ListItemButton onClick={() => handleDeleteChat(currentRoomId)} style={{ visibility: chatRoomUsers.length <= 2 && chatRoomUsers.length > 0 ? 'visible' : 'hidden' }}>
                            <ListItemIcon>
                                <LogoutIcon/>                                                    
                            </ListItemIcon>
                            <ListItemText primary={"Delete Chat"} />
                        </ListItemButton> : null
                    }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </div>
  );
}

export default Chat;