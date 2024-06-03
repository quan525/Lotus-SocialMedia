import React, { useState } from 'react';
import { Modal } from '@mantine/core';
const FollowingMore = ({showMore,setShowMore}) => {
    
   
    
    


  return (
    
    <>
      <Modal
      className='modelShowMore'
      radius="8px"
      opened={showMore}
      onClose={()=>setShowMore(false)}
      transitionProps={{ transition: 'fade', duration: 200 }}
      title="Who Is Following You"
      centered
      padding="20px"
      zIndex={2000}
      
    >
        {/* {FollowingRemainingData.map((val)=>(
                  <div key={val.id} style={{marginTop:"20px"}} className="following-people">
                  <div className="following-details">
                    <img src={val.img} alt="" />
                      <div className="following-name-username">
                        <h3>{val.name}</h3>
                        <p>{val.username}</p>
                      </div>
                  </div>
        
                  <button className='Rbtn' style={{background:"linear-gradient(107deg, rgb(255, 67, 5) 11.1%, rgb(245, 135, 0) 95.3%)"}}>Follow</button>
            </div>
        
        ))} */}

    
    </Modal>
    </>

  
  )
}

export default FollowingMore