import { useState } from "react";

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    async function signup(evt) {
        evt.preventDefault();

        const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            setSuccessMessage('Your registration was successful. Please proceed to login to start sharing your own posts.');
            setErrorMessage(''); // Clear any previous error messages
        } else {
            response.json().then(errorData => {
                if (errorData.errorResponse && errorData.errorResponse.code === 11000) {
                    setErrorMessage('User already exists.');
                } else {
                    setErrorMessage('An error occurred. Please try again later.');
                }
                setSuccessMessage('');
            });
        }
                
    };

    return (
        <div className="signup-page">
            <form className="signup" onSubmit={signup}>
                <h1>SignUp</h1>
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
                    <button type="submit">Signup</button>
                </div>
            </form>
            {errorMessage && (
                <div className="error-popup">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="success-popup">
                    {successMessage}
                </div>
            )}
        </div>
    );
}
