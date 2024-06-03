import React, { useEffect } from 'react'
import '../FriendsList/FriendBox.css'
import FriendBox from './FriendBox'
const FriendsList = ({friendsList, setFriendsList}) => {
        useEffect(()=> {
        console.log("friends: ", friendsList)
    },[friendsList])
return (
    <>
        {friendsList?.length > 0 ?
            <div className='div-friends-list'>
                {friendsList.map((friend) => {
                    return <FriendBox friend={friend} friendsList={friendsList} setFriendsList={setFriendsList} />
                })}
            </div>
            :
            <p style={{textAlign:"center",marginBottom:"40px"}}>
                You have no friends yet
            </p>
        }
    </>
)
}

export default FriendsList 