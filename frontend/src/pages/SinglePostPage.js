import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";

export default function SinglePostPage() {
    const [postDetails, setPostDetails] = useState(null);
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();
    
    const goToEditPage = () => {
        navigate(`/edit/${postDetails._id}`);
    };

    const deletePost = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (confirmed) {
            const response = await fetch(`http://localhost:4000/post/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
    
            if (response.ok) {
                alert('Post deleted successfully.');
                navigate('/');
            } else {
                alert('Failed to delete the post.');
            }
        }
    };
    

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => response.json())
            .then(postDetails => setPostDetails(postDetails));
    }, [id]);

    if (!postDetails) {
        return null;
    }

    return (
        <div className="single-post-page">
            <h1>{postDetails.title}</h1>
            <time>{format(new Date(postDetails.createdAt), 'MMM d, yyyy | HH:mm')}</time>
            <div className="author">by @{postDetails.author.username}</div>
            <div className="backdrop">
                <img src={`http://localhost:4000/${postDetails.backdrop}`} alt='' />
            </div>
            <div dangerouslySetInnerHTML={{ __html: postDetails.content }} />
            
            {/* Providing edit and delete buttons if the author of this post is logged-in */}
            {userInfo && userInfo.id === postDetails.author._id && (
                <div className="edit-delete-buttons">
                    <button onClick={goToEditPage}>Edit</button>
                    <button onClick={deletePost}>Delete</button>
                </div>
            )}
        </div>
    );
};
