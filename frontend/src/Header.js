import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';

export default function Header() {
    const {userInfo, setUserInfo} = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials:'include',    //indicates that cookies should be included with the request
        }).then(response => {
            response.json().then((userInfo) => {
            setUserInfo(userInfo);
            });
        });
    }, [setUserInfo]);
    
    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    };

    const username = userInfo?.username;

    return (
        <header>
          <Link to="/" className="logo">WebWhispers</Link>
          <nav>
            {username && (
                <>
                  <>Hello, {username}  |</>
                  <Link to="/addPost">Add Post</Link>
                  <a href="#" className="logout" onClick={logout}>Logout</a>
                </>
            )}
            {!username && (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">SignUp</Link>
                </>
            )}
          </nav>
        </header>
    );
};