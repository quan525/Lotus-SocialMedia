import React from 'react'

import { Link } from 'react-router-dom'
const FriendsList = ({value}) => {
  return (
    <div className='online-people' >
        <img src={value.avatar_url} alt="" />
        <p>{value.profile_name}</p>
    </div>
  )
}

export default FriendsList