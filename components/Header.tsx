import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import Link from 'next/link';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';

interface User {
    _id: string;
    avatar: string;
    email: string;
    homes: Home[];
    name: string;
    password: string;
    status: string;
    verification: {
        expiresAt: string;
        isVerified: boolean;
    };
}

interface Home {
    _id: string;
    name: string;
}

interface OnlyUser {
    user?: User;
}

interface Props {
    user?: User;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileDropdown: React.FC<Props> = ({ user, setDrawerOpen }) => {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter()

    const handleDropdownClick = () => {
        setIsOpen(!isOpen);
    };

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
        if (sessionStorage.getItem('userexpenses')) {
            console.log('logging out5')
            sessionStorage.removeItem('userexpenses');
        }

        sessionStorage.clear();


        router.push('/')
    };


    return (
        <div className="relative">
            <img
                src={user?.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => {
                    handleDropdownClick()
                    setDrawerOpen(true)
                }}
            />
            {isOpen && (
                <div className={`absolute hidden md:block right-0 mt-2 bg-white shadow-lg rounded-lg ${theme.primaryTextColor}`}>
                    <div className="p-2">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <hr />
                    <div className="p-2">
                        <p className="text-gray-500 font-medium">Homes:</p>
                        <ul className="list-disc list-inside">
                            {user?.homes.map((home) => (
                                <li key={home._id}>{home.name}</li>
                            ))}
                        </ul>
                    </div>
                    <hr />
                    <div className="p-2">
                        <p className="text-gray-500 font-medium">Account:</p>
                        <ul className="list-disc list-inside">
                            <li>Settings</li>
                            <li onClick={doLogOut} className='cursor-pointer'>Log Out</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const Header: React.FC<Props> = ({ user, setDrawerOpen }) => {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);

    return (
        <header className={`flex items-center justify-between ${theme.backgroundColor} px-2`}>
            <div></div>
            <div className="flex items-center space-x-4">
                <Link href="/dashboard" className={`${theme.primaryTextColor} hover:underline`}>
                    Dashboard
                </Link>
                {/* <Link href="/homes" className={`${theme.primaryTextColor} hover:underline`}>
                    Homes
                </Link> */}
                <Link href="/expense" className={`${theme.primaryTextColor} hover:underline`}>
                    Expenses
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <ProfileDropdown user={user} setDrawerOpen={setDrawerOpen} />
            </div>
        </header>
    );
};

export default Header;
