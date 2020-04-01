import React from "react";
import SvgIcon from '@material-ui/core/SvgIcon';

function PinIcon(props) {
    const marker = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
    
    return (
        <SvgIcon {...props}>
            <path fill="currentColor" d={marker} /> />
        </SvgIcon>
    );
}


export default ({color, onClick}) => (
    <PinIcon 
        style={{color: color, fontSize: 30}} 
        onClick={onClick} 
    />
);
;
