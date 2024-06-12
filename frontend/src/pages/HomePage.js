import Post from "../Post";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);

    return (
        <>
          {posts.length > 0 && posts.map(post => (
            <Post key={post._id} {...post} />
          ))}  
        </>
    );
};
