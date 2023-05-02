import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import Link from 'next/link';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';

import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';

const ProfileDropdown = ({ user, setDrawerOpen }) => {
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


const Header = ({ user, setprofileDrawer, setexpenseDrawer, currentpage }) => {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);



    return (
        <header className={`flex items-center justify-between md:justify-center ${theme.backgroundColor} px-8 border-b py-2`}>
            <div className="md:hidden">
                <img
                    src={user?.avatar}
                    alt="Avatar"
                    className={`w-8 h-8 rounded-full cursor-pointer border border-gray-800 ${theme.primaryColor}`}
                    onClick={() => {
                        setprofileDrawer(true);

                    }}
                />

            </div>
            <div className="flex items-center space-x-4">
    <Link href="/dashboard" className={`${theme.primaryTextColor} hover:underline ${currentpage === 'dashboard' && 'underline'}`} >
        Dashboard
    </Link>
    <Link href="/expense" className={`${theme.primaryTextColor} hover:underline ${currentpage === 'expense' && 'underline'}`} >
        Expenses
    </Link>
</div>



            <div className="md:hidden">
                <AddHomeWorkIcon
                    fontSize="medium"
                    className={`${theme.secondaryTextColor} cursor-pointer`}
                    onClick={() => {
                        // handleDropdownClick()
                        setexpenseDrawer(true);
                    }}
                />
            </div>

            {/* <div className="flex items-center space-x-4">
          <ProfileDropdown user={user} setDrawerOpen={setDrawerOpen} />
        </div> */}
        </header>
    );
};


export default Header;
