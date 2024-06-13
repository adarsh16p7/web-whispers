import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserInfo } = useContext(UserContext);

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    async function login(evt) {
        evt.preventDefault();

        if (!username || !password) {
            setUsernameError(username ? '' : 'Username is required');
            setPasswordError(password ? '' : 'Password is required');
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, { 
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });

        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            response.json().then(errorData => {
                if (errorData === 'Invalid username or password') {
                    setErrorMessage('Invalid username or password');
                } else {
                    setErrorMessage('An error occurred');
                }
            });
        }
    };

    if (redirect) {
        return <Navigate to={'/'} />;
    };

    return (
        <div className="login-page">
            <form className="login" onSubmit={login}>
                <h1>LogIn</h1>
                <input 
                    type="text" 
                    placeholder="Username"
                    value={username}
                    onChange={evt => {
                        setUsername(evt.target.value);
                        setUsernameError(''); // Clear error when typing
                    }} 
                />
                {usernameError && <div className="error-message">{usernameError}</div>}
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={evt => {
                        setPassword(evt.target.value);
                        setPasswordError('');
                    }} 
                />
                {passwordError && <div className="error-message">{passwordError}</div>}
                <div className="click-buttons">
                    <button type="submit">Login</button>
                </div>
            </form>
            {errorMessage && (
                <div className="error-popup">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}
