import React, { useState, useEffect, useContext } from 'react'
import { Dispatch, SetStateAction } from 'react';

import { useRouter } from 'next/router'
import Cookies from 'js-cookie';
import { BACKEND } from '@/components/constant';

import Header from '@/components/Header';
import { ThemeContext } from '@/components/ThemeProvider';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';

import { format } from 'date-fns';

// websocket io
// import io from 'socket.io-client';

import BarCharts from '../components/charts/BarCharts'
import PieCharts from '../components/charts/PieCharts'
import LineCharts from '../components/charts/LineCharts'


// dummy data ------------------------------
import { expenses_data } from '@/components/constant';
// dymmu data-----------------remove later


// sidebar
import Sidebar from '../components/Sidebar'
import ExpenseTable from '../components/reusable/ExpenseTable'
import ExpenseDialog from '../components/reusable/ExpenseDialog'
import Sidebar4expenses from '../components/Sidebar4expenses';




// expenses dialog function



function Dashboard() {




    const router = useRouter();

    // const [socket, setSocket] = useState()


    const { isDark, toggleTheme, theme } = useContext(ThemeContext)
    const [userId, setUserId] = useState() //userid after fetching from cookies-url


    const [userProfile, setUserProfile] = useState({}); //user profile after fetch
    const [userexpenses, setuserExpenses] = useState([]) //all expenses after fetch



    const [profiledrawer, setprofileDrawer] = useState(false);
    const [expensedrawer, setexpenseDrawer] = useState(false);

    const [currentpage, setcurrentPage] = useState('dashboard')

    const [showSidebar, setShowSidebar] = useState(true); //sidebar toggle

    const [currentexpenses, setcurrentExpenses] = useState([])


    const [homeid, sethomeId] = useState()

    // const socket = io(BACKEND)
    // to join the current room
    // socket.emit('join-expense', homeid);

    // toggle the sidebar in small screens
    const toggleprofileDrawer = (open) => (event) => {
        // ignore events from input, textarea and buttons inside the drawer
        if (
            event &&
            event.type === 'keydown' &&
            ((event).key === 'Tab' || (event).key === 'Shift')
        ) {
            return;
        }
        setprofileDrawer(open);
    };

    // toggle the sidebar in small screens
    const toggleexpenseDrawer = (open) => (event) => {
        // ignore events from input, textarea and buttons inside the drawer
        if (
            event &&
            event.type === 'keydown' &&
            ((event).key === 'Tab' || (event).key === 'Shift')
        ) {
            return;
        }
        setexpenseDrawer(open);
    };
    // fetch home expenses for sesion storage
    async function fetchhomeExpenses(homeId) {
        try {
            const response = await fetch(BACKEND + '/gethomeexpenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ homeId })
            });

            if (!response.ok) {
                throw new Error('Failed to retrieve expenses');
            }

            const data = await response.json();
            // console.log('home expense from in dashboard', data)
            sessionStorage.setItem(`homeexpenses-${homeId}`, JSON.stringify(data.expenses));
            return data.expenses;

        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // fetch the expenses by user
    const fetchUserExpenses = async (userId) => {
        try {
            const res = await fetch(`${BACKEND}/getuserexpenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();
            setuserExpenses(data.expenses);
            // console.log('expenses of user', data)
            sessionStorage.setItem('userexpenses', JSON.stringify(data.expenses));
        } catch (err) {
            console.error(err);
        }
    };

    // fetch user profile 
    const fetchUserProfile = async (userId) => {
        console.log('fetching user profile')
        try {
            const res = await fetch(`${BACKEND}/getuserprofile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();
            setUserProfile(data.user);
            // console.log('userprofile loaded..........', data.user)
            sessionStorage.setItem('userprofile', JSON.stringify(data.user));

            if(data.user.homes.length>0){
                Cookies.set('homeid', data.user.homes[0]._id)
                sethomeId(data.user.homes[0]._id)
                console.log('homeid', data.user.homes[0]._id)
            }
            return null;

        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // getting the userId from the req.query
    useEffect(() => {
        const { userId } = router.query;
        if (userId) {
            setUserId(userId);
        } else {
            const loginToken = Cookies.get('logintoken');
            if (loginToken) {
                const userId = Cookies.get('userId');
                if (userId) {
                    setUserId(userId);
                }
            } else {
                router.push({
                    pathname: '/usersetup',
                    query: {
                        tologin: true,
                        email: ''
                    },
                }, '/login',)
            }
        }
    }, [router.query]);

    // fetching the user profile
    useEffect(() => {
        if (userId) {
            const userprofile = sessionStorage.getItem('userprofile');
            if (userprofile && userprofile._id === userId && userprofile !== 'undefined') {
                // console.log('from local storage', userprofile);
                setUserProfile(JSON.parse(userprofile))
            } else {
                fetchUserProfile(userId);
            }

            if (Cookies.get('homeid')) {
                fetchhomeExpenses(Cookies.get('homeid'))
            }

            const cachedExpenses = sessionStorage.getItem('userexpenses')
            if (cachedExpenses && cachedExpenses!=='undefined') {
                setuserExpenses(JSON.parse(cachedExpenses));
                // console.log('expenses in session storage', cachedExpenses)
            } else {
                fetchUserExpenses(userId);
            }
        }
    }, [userId]);


    // seting the websocket
    // useEffect(() => {
    //     const socket = io("http://localhost:4009", {
    //         withCredentials: true,
    //         extraHeaders: {
    //             "my-custom-header": "abcd"
    //         }
    //     });

    //     setSocket(socket)
    // }, [])


    return (
        <div className={`min-h-screen w-screen ${theme.backgroundColor} ${theme.primaryTextColor}`}>
            <Header user={userProfile} setprofileDrawer={setprofileDrawer} setexpenseDrawer={setexpenseDrawer} currentpage={currentpage} />
            <div className="flex pt-10">

                {/* SIDE BAR WITH DRAWER */}
                <div className={`hidden md:block md:w-[25%] xl:w-[20%]  ${theme.boxbg} ${theme.primaryTextColor} h-[90vh] rounded-lg shadow-lg mx-auto overflow-y-auto`}>

                    <div className="md:hidden invisible">
                        {/* <Button onClick={() => setDrawerOpen(true)}>Open Profile</Button> */}
                        <SwipeableDrawer
                            anchor="right"
                            open={profiledrawer}
                            onClose={toggleprofileDrawer(false)}
                            onOpen={toggleprofileDrawer(true)}
                            className="block md:hidden">
                            {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} />}
                        </SwipeableDrawer>
                    </div>

                    <div>
                        {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} />}
                    </div>

                </div>

                {/* REMAINING COMPONENT */}
                {userexpenses.length>0 ? <div className='w-[90%] md:w-[45%] xl:w-[55%] mx-auto'>
                    {/* Recent expenses section */}

                    <div>
                        <ExpenseTable userexpenses={userexpenses} head={'Your Recent Expenses'} />
                    </div>

                    <div className="flex flex-wrap mx-auto lg:justify-evenly">
                        {/* Graphs section */}
                        <div className={`w-full mx-auto lg:w-[49%] p-4 ${theme.boxbg}  ${theme.primaryTextColor} rounded-lg shadow-lg mb-4`}>
                            <h2 className="text-lg font-bold mb-4">Expenses by month</h2>
                            <BarCharts expensesData={userexpenses} head={'Expenses by category'} />
                        </div>
                        <div className={`w-full mx-auto lg:w-[49%] p-4 ${theme.boxbg}  ${theme.primaryTextColor} rounded-lg shadow-lg mb-4`}>
                            <h2 className="text-lg font-bold mb-4">Expenses by category</h2>
                            <PieCharts data={userexpenses} head={'Expenses by category'} />
                        </div>
                        {/* <div className={`w-full mx-auto lg:w-[49%] p-4 ${theme.boxbg}  ${theme.primaryTextColor} rounded-lg shadow-lg mb-4`}>
                            <h2 className="text-lg font-bold mb-4">Expenses by month</h2>
                            <PieCharts data={userexpenses} />
                        </div>
                        <div className={`w-full mx-auto lg:w-[49%] p-4 ${theme.boxbg}  ${theme.primaryTextColor} rounded-lg shadow-lg mb-4`}>
                            <h2 className="text-lg font-bold mb-4">Expenses by month</h2>
                            <PieCharts data={userexpenses} />
                        </div> */}
                    </div>

                </div> : <div className='w-[80%] md:w-[40%] xl:w-[50%] mx-auto'>
                    <p className='p-1 text-center font-semibold text-lg '>{(userProfile.homes && userProfile.homes.length) > 0  ? 'Please add expenses! you do nat have any expenses to show' : 'Please add a new home from profile section to start adding your expenses !'}</p>
                </div>}

                {/* SIDE BAR FOR HOMES */}
                <div className={`hidden mb-10 md:block  md:w-[25%] xl:w-[20%]  ${theme.boxbg} ${theme.primaryTextColor} h-[90vh] rounded-lg shadow-lg mx-auto overflow-y-auto`}>

                    <div className="md:hidden invisible">
                        {/* <Button onClick={() => setDrawerOpen(true)}>Open Profile</Button> */}
                        <SwipeableDrawer
                            anchor="left"
                            open={expensedrawer}
                            onClose={toggleexpenseDrawer(false)}
                            onOpen={toggleexpenseDrawer(true)}
                            className="block md:hidden">
                            {/* {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} showprofile={false} />} */}
                            {userProfile && <Sidebar4expenses setcurrentExpenses={setcurrentExpenses} setuserExpenses={setuserExpenses} homes={userProfile.homes} sethomeId={sethomeId} />}
                        </SwipeableDrawer>
                    </div>
                    <div>
                        {userProfile && <Sidebar4expenses setcurrentExpenses={setcurrentExpenses} setuserExpenses={setuserExpenses} homes={userProfile.homes} sethomeId={sethomeId} />}
                        {/* {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} showprofile={false} />} */}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Dashboard
