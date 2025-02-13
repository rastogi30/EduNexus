import React from 'react'

const HighlightText = ({text}) => {
    return(
    <span className="bg-gradient-to-b from-[#1f9eff] via-[#12d7fad7]  to-[#a6ffcb] text-transparent bg-clip-text font-bold">
    
        {text}
    </span>
    )
    
}

export default HighlightText