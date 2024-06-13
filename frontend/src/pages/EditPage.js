import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import PostEditor from "../PostEditor";

export default function EditPage() {
    const [title, setTitle] = useState('');
    const [highlight, setHighlight] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [highlightError, setHighlightError] = useState('');
    const [contentError, setContentError] = useState('');
    const { id } = useParams();

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

    const validateFields = () => {
        let valid = true;
        if (!title.trim()) {
            setTitleError('Title is required');
            valid = false;
        } else {
            setTitleError('');
        }

        if (!highlight.trim()) {
            setHighlightError('Highlight is required');
            valid = false;
        } else {
            setHighlightError('');
        }

        if (!content.trim()) {
            setContentError('Content is required');
            valid = false;
        } else {
            setContentError('');
        }

        return valid;
    };

    async function updatePost(evt) {
        evt.preventDefault();

        if (!validateFields()) {
            return; // Exit early if any field is empty
        }

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
        }
    };

    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    }

    return(
        <form onSubmit={updatePost}>
            <input 
                type="text" 
                placeholder={"Title"}
                value={title} 
                onChange={evt => setTitle(evt.target.value)} />
            {titleError && <div style={{ color: '#b30000' }}>{titleError}</div>}
            <input 
                type="text" 
                placeholder={"Highlight"}
                value={highlight} 
                onChange={evt => setHighlight(evt.target.value)} />
            {highlightError && <div style={{ color: '#b30000' }}>{highlightError}</div>}
            <input 
                type="file"
                onChange={evt => setFiles(evt.target.files)} />
            <PostEditor 
                onChange={setContent} 
                value={content} />
            {contentError && <div style={{ color: '#b30000' }}>{contentError}</div>}
            <div className="click-buttons">
                <button style={{ marginTop: '7px' }}>Update</button>
            </div>
        </form>
    );
};
