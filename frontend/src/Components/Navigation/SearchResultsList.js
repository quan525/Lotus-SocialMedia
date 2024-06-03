import React from 'react'
import "../Navigation/SearchResultsList.css"
import { Link } from 'react-router-dom';


const SearchResultsList = ({searchResults}) => {
  return (
    
    <div className='result-list'>
        {
            searchResults && searchResults.map((val, index) => {
                return (
                    <Link to={`/users/${val.user_id ? val.user_id : null}`} style={{textDecoration:"none"}}>
                    <div className='result' key={val.user_id}>
                        <img src={val.avatar_url} alt="" />
                        <p>{val.profile_name}</p>
                    </div>
                    </Link>
                )
            
            })
        }
    </div>
  )
}

export default SearchResultsList