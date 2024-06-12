import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import PostEditor from "../PostEditor";

export default function EditPage() {
    const [title, setTitle] = useState('');
    const [highlight, setHighlight] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/post/${id}`)
            .then(response => {
                response.json().then(postDetails => {
                    setTitle(postDetails.title);
                    setHighlight(postDetails.highlight);
                    setContent(postDetails.content);
                });
            });
    }, [id]);

    async function updatePost(evt) {
        evt.preventDefault();

        const data = new FormData();
        data.set('title', title);
        data.set('highlight', highlight);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        };
    };

    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    };

    return(
        <form onSubmit={updatePost}>
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
            <PostEditor onChange={setContent} value={content}/>
            <div className="click-buttons"><button style={{marginTop:'7px'}}>Update</button></div>
        </form>
    );
};