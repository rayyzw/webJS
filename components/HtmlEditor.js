import React from "react";

export default function HtmlEditor(props){
    const { value, onChange } = props;
    const textareaRef = React.useRef();
    const editorRef = React.useRef();
    const [loading, setLoading] = React.useState(true);
    const [editor, setEditor] = React.useState();
    const [loadingData, setLoadingData] = React.useState(true);
  
    React.useEffect(() => {
      editorRef.current = require("@ckeditor-linkpoint/ckeditor5-build-classic");
      setLoading(false);
    }, []);

    React.useEffect(() => {
        if(!loading){
            editorRef.current.create(textareaRef.current, {
                ckfinder: {
                    uploadUrl: "/api/images",
                },
            })
            .then((editor) => {
                editor.editing.view.change((writer) => {
                    writer.setStyle(
                        "height",
                        "calc(100vh/4)",
                        editor.editing.view.document.getRoot()
                    );
                });
                setEditor(editor);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [loading]);
  
    React.useEffect(() => {
        if(editor && loadingData){
            setLoadingData(false);
            editor.setData(value);
            editor.model.document.on('change:data', ()=>{
                onChange(editor.getData());
            });
        }
    }, [editor, value, onChange, loadingData]);

    return (        
        <textarea ref={textareaRef}/>
    );

};