"use client"
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';

interface Props {
    id?: string;
    titleValue: string;
    handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    contentValue: string;
    setContentValue: (value: string) => void;
    reset: (id: string) => void;
}

const ContentEditor: React.FC<Props> = ({id, titleValue, handleChangeTitle, contentValue, setContentValue, reset}) => {
    const [tempId, setTempId] = useState("");
    const uid = () => {
        return Date.now().toString(36) + Math.random().toString(36);
    }
    const localWiki = typeof document !== 'undefined' && JSON.parse(localStorage.getItem('wiki') || '[]');

    const modifiedWiki = localWiki.map((obj: any) => {
        if (obj.id === id) {
            return { ...obj, title: titleValue, content: contentValue };
        }
        return obj;
    });

    useEffect(() => {
        setTempId(uid());
      },[]);

    return (
        <div>
           <input type="text" value={titleValue} onChange={handleChangeTitle} placeholder="add title" style={{marginBottom: "5px"}} />
            <ReactQuill theme="snow" value={contentValue} onChange={setContentValue} />
            <button
                onClick={() => reset(id || "")}>
                    Cancel
           </button>
        <button 
            onClick={() => { 
                if (id) {
                    typeof document !== 'undefined' && localStorage.setItem('wiki', JSON.stringify(modifiedWiki));
                    reset(id);
                }
                else {
                    typeof document !== 'undefined' && localStorage.setItem('wiki', JSON.stringify([...localWiki, { id: tempId, content: contentValue, title: titleValue }]));
                    reset(tempId);
                }
            }}>
            Save
        </button>
        </div>
    );
};

export default ContentEditor;