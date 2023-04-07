import React from "react";

//Need to receive param from app.js
const FaceRecognition = ({ imageURL }) => {
    return (
        <div className='center'>
            <div className='absolute mt2'>
                <img id='inputimage' alt='' src={imageURL} width='500px' height='auto'/>
            </div>
        </div>
    );
}
// empty div for bounding box to be drawn via css

export default FaceRecognition;