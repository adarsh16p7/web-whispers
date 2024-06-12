import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserInfo } = useContext(UserContext);

    async function login(evt) {
        evt.preventDefault();

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
                setErrorMessage(errorData);
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
                    placeholder="username"
                    value={username}
                    onChange={evt => setUsername(evt.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="password"
                    value={password}
                    onChange={evt => setPassword(evt.target.value)} 
                />
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
};
