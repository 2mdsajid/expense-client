import { Router, useRouter } from 'next/router';
import React, { useContext } from 'react'
import Cookies from 'js-cookie';

import { ThemeContext } from '../ThemeProvider';


function ProfileSidebar({ userprofile }) {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);

    const router = useRouter()

    const handleVerification = () => {
        return
    }


    const doLogOut = () => {
        console.log('logging out')
        if (Cookies.get('logintoken')) {
            console.log('logging out1')
            Cookies.remove('logintoken');
        }
        if (Cookies.get('userId')) {
            console.log('logging out2')
            Cookies.remove('userId');
        }
        if (Cookies.get('homeid')) {
            console.log('logging out3')
            Cookies.remove('homeid');
        }
        if (localStorage.getItem('userprofile')) {
            console.log('logging out4')
            localStorage.removeItem('userprofile');
        }


        sessionStorage.clear();


        router.push('/')
    };

    return (

        <div className={`${theme.boxbg} p-4 rounded-md shadow-md h-full`}>
            <div className="flex justify-between items-center mb-5">
                <h2 className={`${theme.primaryTextColor} text-2xl py-3 font-bold`}>Profile</h2>
                <button
                    className={`rounded-full w-10 h-10 focus:outline-none border ${theme.boxbg}`}
                    onClick={toggleTheme}
                >
                    {isDark ? "🌞" : "🌙"}
                </button>
            </div>
            <div className="flex items-center justify-center mb-4">
                <img
                    src={userprofile?.avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                    <p className={`${theme.primaryTextColor} text-lg font-bold`}>
                        {userprofile?.name}
                    </p>
                    <p className={`${theme.secondaryTextColor} text-sm`}>
                        {userprofile?.email}
                    </p>
                </div>
            </div>
            <div className="flex items-center mb-4">
                <p className={`${theme.primaryTextColor} text-sm font-bold mr-2`}>Status:</p>
                <p className={`${theme.primaryTextColor} text-sm`}>{userprofile?.status}</p>
            </div>
            <div className="flex items-center mb-4">
                <p className={`${theme.primaryTextColor} text-sm font-bold mr-2`}>
                    Verification:
                </p>
                <p
                    className={`text-sm ${userprofile.verification.isVerified
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                >
                    {userprofile.verification.isVerified ? "Verified" : "Not verified"}
                </p>
                <button
                    onClick={handleVerification}
                    className={`${userprofile.verification.isVerified
                            ? theme.primaryBtn
                            : theme.accentColor
                        } ml-auto text-sm px-3 py-1 rounded-md font-bold`}
                >
                    {!userprofile.verification.isVerified && "Verify"}
                </button>
            </div>
            <button
                onClick={doLogOut}
                className={`${theme.primaryBtn} ${theme.hoverBtn} p-2 text-white font-bold flex flex-start justify-center mt-3 w-fit rounded cursor-pointer`}
            >
                Logout
            </button>
        </div>


    )
}

export default ProfileSidebar
