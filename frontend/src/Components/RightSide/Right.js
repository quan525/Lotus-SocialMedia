import React from 'react'
import Sugg from "./RightComponents/Suggestion/Sugg"
import Friends from "./RightComponents/Friends/Friends"
import FollowingU from "./RightComponents/Following/FollowingU"
import "../RightSide/Right.css"
import {GrFormClose} from "react-icons/gr"

import { useContext } from 'react'
import { FriendsContext } from '../../App'
const Right = ({showMenu,setShowMenu}) => {
  const { friendsSuggestion } = useContext(FriendsContext)
  return (
    <div className={showMenu ? "R-Side active" : "R-Side unActive"}>
      <GrFormClose 
      className='closeBurger'
      onClick={()=>setShowMenu(false)}/>
      <Sugg friendsSuggestion={friendsSuggestion}/>

      <Friends />

      <FollowingU />
    </div>
  )
}

export default Right