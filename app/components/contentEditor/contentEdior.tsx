"use client"

import ReactQuill from 'react-quill';

interface Props {
    id?: string;
    titleValue: string;
    handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    contentValue: string;
    setContentValue: (value: string) => void;
    reset: () => void;
}

const ContentEditor: React.FC<Props> = ({id, titleValue, handleChangeTitle, contentValue, setContentValue, reset}) => {
    const uid = () => {
        return Date.now().toString(36) + Math.random().toString(36);
    }
    const localWiki = JSON.parse(localStorage.getItem('wiki') || '[]');

    const modifiedWiki = localWiki.map((obj: any) => {
        if (obj.id === id) {
            return { ...obj, title: titleValue, content: contentValue };
        }
        return obj;
    });

    return (
        <div>
           <input type="text" value={titleValue} onChange={handleChangeTitle} placeholder="add title" style={{marginBottom: "5px"}} />
            <ReactQuill theme="snow" value={contentValue} onChange={setContentValue} />
            <button
                onClick={() => reset()}>
                    Cancel
           </button>
           <button 
                onClick={() => { 
                    if (id) {
                        localStorage.setItem('wiki', JSON.stringify(modifiedWiki));
                    }
                    else {
                        localStorage.setItem('wiki', JSON.stringify([...localWiki, { id: uid(), content: contentValue, title: titleValue }]));
                    }
                    reset();
                }}>
                Save
            </button>
        </div>
    );
};

export default ContentEditor;