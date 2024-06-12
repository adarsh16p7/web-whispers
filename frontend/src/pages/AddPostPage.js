import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PostEditor from '../PostEditor';

export default function AddPostPage() {
    const [title, setTitle] = useState('');
    const [highlight, setHighlight] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function addNewPost(evt) {
        const data = new FormData();
        data.set('title', title);
        data.set('highlight', highlight);
        data.set('content', content);
        data.set('file', files[0]);


        evt.preventDefault();
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        };
    };

    if (redirect) {
        return <Navigate to={'/'} />
    };

    return(
        <form onSubmit={addNewPost}>
            <input type="text" 
                   placeholder={"Title"}
                   value={title} 
                   onChange={evt => setTitle(evt.target.value)} />
            <input type="text" 
                   placeholder={"Highlight"}
                   value={highlight} 
                   onChange={evt => setHighlight(evt.target.value)} />
            <input type="file"
                   onChange={evt => setFiles(evt.target.files)}/>
            <PostEditor value={content} onChange={setContent}/>
            <div className="click-buttons"><button style={{marginTop:'7px'}}>Upload</button></div>
        </form>
    )
};