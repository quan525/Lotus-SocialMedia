import React, { useContext, useState } from 'react'
import "../Suggestion/Sugg.css"
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { addFriend } from '../../../../api/services/Friends'
import { UserContext } from '../../../../App'



const Sugg = ({friendsSuggestion}) => {
  const navigate = useNavigate()
  const [isClicked, setIsClicked] = useState({});

  const handleAddFriend = async (userId) => {
    await addFriend(userData.token, userId)
    .then(res => console.log(res));
    setIsClicked(prevState => ({...prevState, [userId]: true}));
  }

  const handleSeeInfo = (user) => {
    navigate(`/users/${user.user_id}`)
  }
  const userData = useContext(UserContext)

  return (
    <div className="Sugg-comp">
      <h2>Suggestion For You</h2>

      {friendsSuggestion.map((user) => {
        return (
          <div className="sugg-people" key={user.user_id}>
            <Link to={{ 
    pathname: `/users/${user.user_id}`, 
  }}  style={{textDecoration:"none", color: '#1C1C1C'}}>
              <div className="s-left">
                <img src={user.avatar_url} alt="" />
                <h3>{user.profile_name}</h3>
              </div>
            </Link>
            <div className="s-right">               {
                isClicked[user.user_id] 
                ? (
                    <>
                      <button style={{ display: 'block' }}>Added</button>
                    </>
                  ) 
                : (
                    <>
                      <button onClick={() => handleAddFriend(user.user_id)} style={{ display: 'block' }}>Add Friend</button>
                    </>
                  )
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Sugg