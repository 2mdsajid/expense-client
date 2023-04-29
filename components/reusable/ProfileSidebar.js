import { Router, useRouter } from 'next/router';
import React from 'react'
import Cookies from 'js-cookie';

function ProfileSidebar({ userprofile }) {

    const router = useRouter()


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

        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Profile</h2>
            <div className="flex items-center mb-4">
                <img
                    src={userprofile?.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                    <p className="text-sm font-bold">{userprofile?.name}</p>
                    <p className="text-sm text-gray-600">{userprofile?.email}</p>
                </div>
            </div>
            <div className="flex items-center mb-4">
                <p className="text-sm font-bold mr-2">Status:</p>
                <p className="text-sm">{userprofile?.status}</p>
            </div>
            <div className="flex items-center">
                <p className="text-sm font-bold mr-2">Verification:</p>
                <p
                    className={`text-sm ${userprofile?.verification.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                    {userprofile?.verification.isVerified ? 'Verified' : 'Not verified'}
                </p>
                <p onClick={doLogOut}>logout</p>
            </div>
        </div>

    )
}

export default ProfileSidebar
