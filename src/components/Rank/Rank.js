import React from "react";

const Rank = ({name, entries}) => {
    return (
        <div>
            <div className='white f3'>
                {`${name}, you've currently generated...`}
            </div>
            <div className='white f1'>
                {entries}
            </div>
            <div className='white f3'>
                {"AI photos!"}
            </div>
        </div>
    );
}


export default Rank;
