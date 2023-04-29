import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { BACKEND } from './constant';

import Cookies from 'js-cookie';


import { useRouter } from 'next/router'




const LoginForm = ({useremail}) => {

    const router = useRouter();

    const { isDark, toggleTheme, theme } = useContext(ThemeContext)


    const [email, setEmail] = useState(useremail || '');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log({ email, password });
        // do something with the form data, such as sending it to a server

        try {
            const response = await fetch(BACKEND + '/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json()

            if (data.status === 200) {
                console.log(data)

                // Set the userId cookie
                Cookies.set('logintoken', data.user.logintoken);
                Cookies.set('userId', data.user._id);

                router.push({
                    pathname: '/dashboard',
                    query: { userId: data.user._id },
                }, '/dashboard', // "as" argument
                )

            } else {
                throw new Error('Failed to login');
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <form onSubmit={handleSubmit} className=" w-full rounded-lg">
            <h2 className={`text-2xl font-bold ${theme.primaryTextColor} text-center mb-4`}>Login</h2>
            <div className="mb-4">
                <label htmlFor="email" className={`${theme.secondaryTextColor} block mb-2`}>
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className={`${theme.secondaryTextColor} block mb-2`}>
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="flex justify-start">
                <button
                    type="submit"
                    className={`bg-blue-500 hover:${theme.accentColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                    Login
                </button>
            </div>

        </form>
    );
};

export default LoginForm;
