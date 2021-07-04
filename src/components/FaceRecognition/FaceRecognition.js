import React from 'react';
import './FaceRecognition.css'
const FaceRecognition = ({imageUrl, box}) => {

    return (
       <div className='center ma'>
            <div className='absolute mt2 '>
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
                <div className='bounding-box' style={{top: 64, right: 100, bottom: 100, left: 130}} ></div>
           </div>
       </div>
    )
}

export default FaceRecognition;