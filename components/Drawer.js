import React from 'react';

export default function Drawer(props) {
    const [width, setWidth] = React.useState("100vw");
    const [height, setHeight] = React.useState("100vh");
    
    React.useEffect(() => {
        let size = 50;
        if(props.size){
            size = props.size;
        }
        if(props.position === "right"){
            setWidth(size + "vw");
        }
        else if(props.position === "left"){
            setWidth(size + "vw");
        }
        else if(props.position === "top"){
            setHeight(size + "vh");
        }
        else if(props.position === "bottom"){
            setHeight(size + "vh");
        }
        else{
            setWidth(Math.sqrt(size/100)*100 + "vw");
            setHeight(Math.sqrt(size/100)*100 + "vh");
        }
    },[props.size, props.position]);

    return (
        <>
        <div style={{
            position:"fixed",
            left:0,
            top:0,
            backgroundColor:"#CCCCCC",
            width:"100vw",
            height:"100vh",
            zIndex:3,
            opacity: "0.5"
        }} onClick={props.onClick}></div>

        {props.position === "right" &&
            <div style={{
                position:"fixed",
                right:0,
                top:0,
                backgroundColor:"#FFFFFF",
                width:width,
                height:"100vh",
                zIndex:4,
                padding:30,
                overflow: "auto",
            }}>{props.children}</div>
        }
        {props.position === "left" &&
            <div style={{
                position:"fixed",
                left:0,
                top:0,
                backgroundColor:"#FFFFFF",
                width:width,
                height:"100vh",
                zIndex:4,
                padding:30,
                overflow: "auto",
            }}>{props.children}</div>
        }
        {props.position === "top" &&
            <div style={{
                position:"fixed",
                left:0,
                top:0,
                backgroundColor:"#FFFFFF",
                width:"100vw",
                height:height,
                zIndex:4,
                padding:30,
                overflow: "auto",
            }}>{props.children}</div>
        }
        {props.position === "bottom" &&
            <div style={{
                position:"fixed",
                left:0,
                bottom:0,
                backgroundColor:"#FFFFFF",
                width:"100vw",
                height:height,
                zIndex:4,
                padding:30,
                overflow: "auto",
            }}>{props.children}</div>
        }
        {!["left","right","top","bottom"].includes(props.position) &&
            <div style={{
                position:"fixed",
                left:`calc((100vw - ${width})/2)`,
                top:`calc((100vh - ${height})/2)`,
                backgroundColor:"#FFFFFF",
                width:width,
                height:height,
                zIndex:4,
                padding:30,
                overflow: "auto",
            }}>{props.children}</div>
        }
        </>
    );
}