import React, { useState, useEffect, createContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './Pages/Home/Home'
import Profile from './Pages/Profile/Profile'
import FriendsId from "./Pages/FriendsId/FriendsId"
import Notification from './Pages/Notification/Notification'
import Login from './Pages/RegisterPage/Login'
import SignUp from './Pages/RegisterPage/SignUp'
import PrivateRoute from './PrivateRoute/privateroute'
import FriendRequests from './Pages/FriendRequests/FriendRequests'
// import OTPInput from './Pages/RegisterPage/OTPInput';
import  { jwtDecode } from 'jwt-decode';

import Chat from './Pages/Chat/Chat'
import axios from 'axios'
import { requestNotification, requestNotificationOnLogin } from './api/services/Notification'
import { getFriends } from './api/services/Friends'
import { GetFriendsSuggestion } from './api/services/User'
import VideoCall from './Pages/VideoCall/Call'
// import ChatBox from './Components/ChatBoxComponent/ChatBox'
export const UserContext = createContext()
export const LoginContext = createContext()
export const FriendsContext = createContext()
export const NotificationsContext = createContext()
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

const App = () => {

  const [isLoggedIn, setLoggedIn] = useState(() => {
    const user = JSON.parse(localStorage.getItem('data'));
    const token = user?.token
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        return true;
      }else {
        return false;
      }
    }else {
      return false
    }
  });

  const [friendProfile, setFriendsProfile] = useState([]);
  const [items, setItems] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [friendsSuggestion, setFriendsSuggestion] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const endChat = (userId) => {
    setActiveChats(activeChats.filter(id => id !== userId));
  };


  useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === "data") { 
      console.log(JSON.parse(localStorage.getItem('data')));
      setItems(JSON.parse(localStorage.getItem('data')));
    }
  };

  // Subscribe to future changes
  window.addEventListener('storage', handleStorageChange);

  // Cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}); 

  useEffect(() => {
    console.log(isLoggedIn)
    if (isLoggedIn) {
      const userData = localStorage.getItem('data')
      if (userData) {
        setItems(JSON.parse(localStorage.getItem("data")));
      }else {
      setItems({});
      setFriendsProfile([]);
      localStorage.removeItem('data');
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log("new token")
    const fetchFriends = async () => {
      try {
        const response = await getFriends(items.token)
        if (response.data) {
          setFriendsList(response.data);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    if (items.token) {
  const token = items.token;
  const getNotificationsOnLogin = async () => {
    try {
      const res = await requestNotificationOnLogin(token)
      setNotifications(prevNoti => [...prevNoti, ...res.data]);

      console.log(res)
      setTimeout(getNotifications, 3000);
    } catch (err) {
      console.log(err);
    }
  }

  const getNotifications = async () => {
    try {
      const res = await requestNotification(token);
      console.log(res);
      setNotifications(prevNoti => [...prevNoti, ...res.data]);
      setTimeout(getNotifications, 5000);
    } catch (err) {
      console.log(err);
    }
  }

      const getFriendsSuggestion = async () => {
        await GetFriendsSuggestion(items.token).then((response) => {
          setFriendsSuggestion(response.data)
          console.log(response)
        })
      }
      fetchFriends();
      getNotificationsOnLogin();
      getFriendsSuggestion()
    } 
  }, [items.token]);

// var es = new EventSource(sse);
// es.onmessage = function (event) {
//   console.log(event.data);
// };
  // useEffect(() => {
  //   if(items.token){
    
  //   const getNotifications = async () => {
  //     try {
  //       const token = items.token;
  //       await requestNotification(token).then((response) => {
  //         console.log('notification: ', response)
  //       })
  //     } catch (err) {
  //       console.log(err) 
  //     }
  //   }
  //   getNotifications()
  //   console.log(notifications)
  //   }
  // },[items])
  useEffect(() => {
    notifications.map((noti) => {
      if(noti.noti_type === "FRIEND_REQUEST" )
      {
        const request = {
          "avatar_url" : noti.avatar_url,
          "created_at" : noti.created_at,
          "profile_name" : noti.sender_name,
          "user_id" : noti.sender_id
        }
        setFriendRequests((prev) => [...prev, request])
        setNotifications((prev) => prev.filter((item) => item !== noti))
      }
    })
  },[notifications])
  return (    
    <UserContext.Provider value={items}>
      <LoginContext.Provider value={{isLoggedIn, setLoggedIn}}>
        <NotificationsContext.Provider value={notifications}>
          <FriendsContext.Provider value={{friendsList, setFriendsList, friendsSuggestion}}>
            <div className='App'>
              <Routes>
                <Route path='/home' element={<PrivateRoute><Home setFriendsProfile={setFriendsProfile} friendRequests={friendRequests}/></PrivateRoute>} />

                <Route path='/profile' element={<PrivateRoute><Profile friendsList={friendsList} setFriendsList={setFriendsList} friendRequests={friendRequests}/></PrivateRoute>} />

                <Route path='/users/:userId' element={<PrivateRoute><FriendsId friendProfile={friendProfile} friendRequests={friendRequests}/></PrivateRoute>} />

                <Route path='/friendRequests' element={<PrivateRoute><FriendRequests setFriendsProfile={setFriendsProfile}  friendRequests={friendRequests} setFriendRequests={setFriendRequests}/></PrivateRoute>} />

                <Route path='/notification' element={<PrivateRoute><Notification notifications={notifications}/></PrivateRoute>} />

                <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>} />

                <Route path='/' element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />

                <Route path='/signup' element={isLoggedIn ? <Navigate to="/home" /> : <SignUp />} />

                <Route path='/passwordReset' element={isLoggedIn ? <Navigate to="/home" /> : <SignUp />} />
                {/* <Route path='/SendOtp'   element={isLoggedIn ? <Navigate to="/home"/> : <OTPInput/> } /> */}

                <Route path='/videocall' element={<PrivateRoute><VideoCall/></PrivateRoute>} />
              </Routes>
            </div>
          </FriendsContext.Provider >
        </NotificationsContext.Provider>
      </LoginContext.Provider>
    </UserContext.Provider >

  )
}

export default App
