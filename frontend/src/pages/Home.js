import React, { useState } from 'react';
import { signUp } from '../api/initialmodel'; 

const Home = () => {
    // State variables for the input fields
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            userName,
            email,
            password,
        };

        try {
            await signUp(newUser); // Call the signUp function
            // Optionally, handle successful signup (e.g., redirect or show a message)
            console.log('User signed up successfully');
        } catch (error) {
            // Handle signup error (e.g., show an error message)
            console.error('Signup failed:', error);
        }
    };

    return (
        <div className="home">
            <h1>WELCOME TO TRIPAL</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Home;
