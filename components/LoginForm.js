import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { BACKEND } from './constant';

import Cookies from 'js-cookie';

import { Alert, AlertColor } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


import { useRouter } from 'next/router'




const LoginForm = ({ useremail }) => {

    const router = useRouter();

    const { isDark, toggleTheme, theme } = useContext(ThemeContext)

    // dialogue box for messages
    const [alertseverity, setalertSeverity] = useState('warning');
    const [alertmessage, setalertMessage] = useState('Please provide an authentic email');
    const [showalert, setshowAlert] = useState(false)
    const [showprogress, setshowProgress] = useState(false)


    const [email, setEmail] = useState(useremail || '');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        setshowProgress(true)
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

            setshowAlert(true)
            setalertMessage(data.message)
            setshowProgress(false)

            if (data.status === 200) {
                // console.log(data)

                setalertSeverity('success')

                // Set the userId cookie
                Cookies.set('logintoken', data.user.logintoken);
                Cookies.set('userId', data.user._id);

                router.push({
                    pathname: '/dashboard',
                    query: { userId: data.user._id },
                }, '/dashboard', // "as" argument
                )

            } else {
                setalertSeverity('warning')
            }

            setTimeout(() => {
                setshowAlert(false)
            }, 2500);

        } catch (error) {
            console.error(error);
            return router.push({
                pathname: '/error',
            }, '/dashboard', // "as" argument
            )
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
                    id="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    placeholder="Email"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                {email.length > 0 && <p className="text-red-500">{!email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) && 'Please enter a valid email'}</p>}

            </div>
            <div className="mb-6">
                <label htmlFor="password" className={`${theme.secondaryTextColor} block mb-2`}>
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    placeholder="Password"
                    required
                    minLength="8"
                />
                {password.length > 0 && <p className="text-red-500">{password.length < 8 && 'Password must be at least 8 characters long'}</p>}
            </div>

            {showalert && <div className='my-1'><Alert severity={alertseverity} onClose={() => { setshowAlert(false) }}>{alertmessage}</Alert></div>}

            <div className={`bg-blue-500 hover:${theme.accentColor} text-white font-bold flex justify-center mt-3 w-1/2 mx-auto rounded`}>
                {showprogress ?
                    <div className='py-1'>

                        <CircularProgress
                            size={30}
                            sx={{ color: '#ffffff' }}
                        />

                    </div> :
                    <button
                        type="submit"
                        className={`w-full h-full rounded py-3 focus:outline-none focus:shadow-outline`}>
                        Login
                    </button>}
            </div>

        </form>
    );
};

export default LoginForm;
