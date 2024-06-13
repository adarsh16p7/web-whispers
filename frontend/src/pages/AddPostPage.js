import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PostEditor from '../PostEditor';

export default function AddPostPage() {
    const [title, setTitle] = useState('');
    const [highlight, setHighlight] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    
    const [touched, setTouched] = useState({
        title: false,
        highlight: false,
        content: false,
        file: false
    });

    useEffect(() => {
        // Validate form and provide detailed error messages
        let error = '';
        if (!title.trim() && touched.title) error = 'Title is required';
        else if (!highlight.trim() && touched.highlight) error = 'Highlight is required';
        else if (!content.trim() && touched.content) error = 'Content is required';
        else if ((!files || files.length === 0) && touched.file) error = 'Backdrop file is required';
        else if (files && files[0] && !files[0].type.startsWith('image/')) error = 'The backdrop file should be an image';

        setErrorMessage(error);
        setIsFormValid(!error);
    }, [title, highlight, content, files, touched]);

    const handleBlur = (field) => {
        setTouched({
            ...touched,
            [field]: true
        });
    };

    async function addNewPost(evt) {
        evt.preventDefault();

        const data = new FormData();
        data.set('title', title);
        data.set('highlight', highlight);
        data.set('content', content);
        data.set('file', files ? files[0] : null);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.error || 'Failed to create post');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <form onSubmit={addNewPost}>
            {errorMessage && <div style={{color: '#b30000'}}>{errorMessage}</div>}
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={evt => setTitle(evt.target.value)} 
                onBlur={() => handleBlur('title')}
                required 
            />
            <input 
                type="text" 
                placeholder="Highlight" 
                value={highlight} 
                onChange={evt => setHighlight(evt.target.value)} 
                onBlur={() => handleBlur('highlight')}
                required 
            />
            <input 
                type="file" 
                onChange={evt => setFiles(evt.target.files)} 
                onBlur={() => handleBlur('file')}
                required 
            />
            <PostEditor value={content} onChange={setContent} onBlur={() => handleBlur('content')} required />
            <div className="click-buttons">
                <button type="submit" style={{ marginTop: '7px' }} disabled={!isFormValid}>
                    Upload
                </button>
            </div>
        </form>
    );
}
