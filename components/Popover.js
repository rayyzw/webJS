import React from 'react';

export default function Popover(props) {
    const popover = React.useRef(null);
    const [anchorTimeout, setAnchorTimeout] = React.useState();
    const [left, setLeft] = React.useState();
    const [top, setTop] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const {anchor, setAnchor} = props;

    React.useEffect(() => {
        if(anchor){
            if(popover.current.getBoundingClientRect().right > window.innerWidth){
                setLeft(anchor.getBoundingClientRect().right-popover.current.getBoundingClientRect().width);
            }
            else{
                setLeft(anchor.getBoundingClientRect().left);
            }
            if(popover.current.getBoundingClientRect().bottom > window.innerHeight){
                setTop(anchor.getBoundingClientRect().top-popover.current.getBoundingClientRect().height);
            }
            else{
                setTop(anchor.getBoundingClientRect().bottom);
            }
            setLoading(false);
            let ato = setTimeout(() => {
                setAnchor(null);
            }, 3000);
            setAnchorTimeout(ato);
            return () => {
              clearTimeout(ato);
            };
        }
    },[anchor, setAnchor]);

    return (
        <div 
            style={{
                position:"fixed",
                top:top,
                left:left,
                backgroundColor:"#FFFFFF",
                padding:10,
                border:"1px solid #CCCCCC",
                borderRadius: ".25rem",
                color:"#494949",
                opacity: loading?0:1
            }}
            onMouseEnter={(e)=>{
                clearTimeout(anchorTimeout);
            }}
            onMouseLeave={(e)=>{
                let ato1 = setTimeout(() => {
                    props.setAnchor(null);
                }, 1000);
                setAnchorTimeout(ato1);
                return () => {
                  clearTimeout(ato1);
                };
            }}
            ref={popover}
        >
            {props.children}
        </div>
    );
}