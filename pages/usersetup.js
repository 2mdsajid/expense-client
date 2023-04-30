import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

import { ThemeContext } from '../components/ThemeProvider'

function Usersetup() {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext)

    const [showLoginForm, setShowLoginForm] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const { tologin } = router.query;
        if (tologin) {
            console.log(router.query)
            setShowLoginForm(tologin === 'true');
        }
    }, [router.query]);

    return (
        <div className='w-screen min-h-screen py-20'>
            <div className={`w-[95%] sm:w-4/5 mx-auto md:w-1/2 lg:w-1/3 p-4 ${theme.boxbg} rounded-lg shadow-lg`}>
                <div className='my-5'>
                    <p className='text-center'>{showLoginForm ? 'Please login to continue' : 'Please sign up to continue'}</p>
                </div>
                {showLoginForm ? <LoginForm useremail={router.query.email} /> : <SignupForm username={router.query.name} useremail={router.query.email} userhomeid={router.query.homeid} />}
            </div>
        </div>
    );
}

export default Usersetup;
