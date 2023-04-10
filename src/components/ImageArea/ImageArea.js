import React from "react";

//Need to receive param from app.js
const ImageArea = ({ imageURL }) => {
    return (
        <div className='center'>
            <div className='absolute mt2 pa4'>
                <img id='inputimage' alt='' src={imageURL} width='500px' height='auto'/>
            </div>
        </div>
    );
}
// empty div for image to appear

export default ImageArea;