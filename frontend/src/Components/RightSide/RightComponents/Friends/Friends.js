import React, { useContext, useEffect } from 'react'
import "./Friends.css"
import { DisPlayPostData } from '../../../../Data/DisplayPostData'
import FriendsList from './FriendsList'

import { FriendsContext } from '../../../../App'
const Online = () => {
  const {friendsList, setFriendsList} = useContext( FriendsContext )
  return (
    <div className="online-comp">
      <h2>Friends</h2>

      {friendsList.map((value,user_id)=>(
        <FriendsList 
        value={value}
        key={user_id}
        />
      ))}

    </div>
  )
}

export default Online