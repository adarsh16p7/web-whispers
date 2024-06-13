import { useState } from "react";

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    async function signup(evt) {
        evt.preventDefault();
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            const data = await response.json();
            console.log('Signup response:', data); // Log the response to inspect in browser console
    
            if (response.ok) {
                setSuccessMessage('Your registration was successful. Please proceed to login to start sharing your own posts.');
                setErrorMessage(''); // Clear any previous error messages
            } else {
                if (data.error && data.error.includes('Username already exists')) {
                    setErrorMessage('Username is already taken. Please choose another.');
                } else {
                    setErrorMessage('An error occurred. Please try again later.');
                }
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrorMessage('An unexpected error occurred. Please try again later.');
            setSuccessMessage('');
        };
    };
    
    return (
        <div className="signup-page">
            <form className="signup" onSubmit={signup}>
                <h1>Sign Up</h1>
                <input 
                    type="text" 
                    placeholder="Username"
                    value={username}
                    onChange={evt => setUsername(evt.target.value)} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={evt => setPassword(evt.target.value)} 
                    required
                />
                <div className="click-buttons">
                    <button type="submit">Sign Up</button>
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
