import React, { useContext, useState, useEffect } from 'react'
import { ThemeContext } from '@/components/ThemeProvider';
import Header from '../components/Header'


import SwipeableDrawer from '@mui/material/SwipeableDrawer'; //mui


import Cookies from 'js-cookie'

// import ExpenseForm from '../components/ExpenseForm';
import Sidebar4expenses from '../components/Sidebar4expenses';
import Sidebar from '../components/Sidebar';

import ExpenseTable from '../components/reusable/ExpenseTable'

import { BACKEND } from '../components/constant';

import io from 'socket.io-client';

function Expense() {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext)
    const [profiledrawer, setprofileDrawer] = useState(false);
    const [expensedrawer, setexpenseDrawer] = useState(false);
    const [userProfile, setUserProfile] = useState();

    const [currentexpenses, setcurrentExpenses] = useState([])
    const [userexpenses, setuserExpenses] = useState([]) //all expenses after fetch


    const [showDialog, setShowDialog] = useState(false);

    // HOMEID FOR EXPENSES
    const [homeid, sethomeId] = useState(Cookies.get('homeid'))

    // socket
    const socket = io("http://localhost:4009")

    // to join the current room
    socket.emit('join-expense', homeid);



    function openDialog() {
        setShowDialog(true);
    }

    function closeDialog() {
        setShowDialog(false);
    }

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

    // fetch the home expenses
    async function fetchExpenses(homeId) {
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
            setcurrentExpenses(data.expenses)
            console.log('home expense from req', data)
            sessionStorage.setItem(`homeexpenses-${homeId}`, JSON.stringify(data.expenses));
            return data.expenses;

        } catch (error) {
            console.error(error);
            return null;
        }
    }


    useEffect(() => {
        const logintoken = Cookies.get('logintoken');
        if (logintoken) {
            const userProfile = JSON.parse(localStorage.getItem('userprofile'));
            setUserProfile(userProfile)

            console.log('prof in exp from local storage', userProfile)
        } else {
            router.push({
                pathname: '/usersetup',
                query: {
                    tologin: true,
                    email: ''
                },
            }, '/login',)
        }
    }, [])

    useEffect(() => {

        // const homeid = Cookies.get('homeid');
        if (homeid) {

            const cachedhomeExpenses = sessionStorage.getItem(`homeexpenses-${homeid}`);
            if (cachedhomeExpenses) {
                console.log('expenses in session storage', JSON.parse(cachedhomeExpenses))
                setcurrentExpenses(JSON.parse(cachedhomeExpenses));
            } else {
                fetchExpenses(homeid)
            }

        }

    }, [homeid])


    // useEffect(() => {
    //     // Listen for changes to the logintoken cookie
    //     const handleCookieChange = () => {
    //         sethomeId(Cookies.get('homeid'));
    //         console.log('homeid in event cookie change',homeid)
    //         // fetchExpenses(homeid)
    //     };

    //     window.addEventListener('storage', handleCookieChange);

    //     return () => window.removeEventListener('storage', handleCookieChange);
    // }, [])


    return (
        <div className={`min-h-screen w-screen ${theme.backgroundColor} ${theme.primaryTextColor}`}>
            <Header user={userProfile} setprofileDrawer={setprofileDrawer} setexpenseDrawer={setexpenseDrawer} />
            <div id='othercontents' className="flex flex-wrap pt-10">

                {/* SIDE BAR WITH PROFILE */}
                <div className='hidden md:block md:w-[25%] xl:w-[20%] bg-white h-[90vh] rounded-lg shadow-lg mx-auto overflow-y-auto'>

                    <div className="md:hidden invisible">
                        {/* <Button onClick={() => setDrawerOpen(true)}>Open Profile</Button> */}
                        <SwipeableDrawer
                            anchor="right"
                            open={profiledrawer}
                            onClose={toggleprofileDrawer(false)}
                            onOpen={toggleprofileDrawer(true)}
                            className="block md:hidden">
                            {userProfile && <Sidebar userProfile={userProfile} />}
                        </SwipeableDrawer>
                    </div>

                    <div>
                        {userProfile && <Sidebar userProfile={userProfile} />}
                    </div>

                </div>

                {/* REST OMPONENTS */}
                <div className='w-[90%] md:w-[70%] xl:w-[75%] mx-auto'>

                    {/* expense table */}
                    {currentexpenses && <ExpenseTable userexpenses={currentexpenses} />}

                </div>

                {/* SIDEBAR FOR EXPENSE */}
                <div className='hidden md:block md:w-[25%] xl:w-[20%] bg-white h-[90vh] rounded-lg shadow-lg mx-auto overflow-y-auto'>
                    <div className="md:hidden invisible">
                        {/* <Button onClick={() => setDrawerOpen(true)}>Open Profile</Button> */}
                        <SwipeableDrawer
                            anchor="left"
                            open={expensedrawer}
                            onClose={toggleexpenseDrawer(false)}
                            onOpen={toggleexpenseDrawer(true)}
                            className="block md:hidden">
                            {/* {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} showprofile={false} />} */}
                            {userProfile && <Sidebar4expenses setcurrentExpenses={setcurrentExpenses} setuserExpenses={setuserExpenses} socket={socket} homes={userProfile.homes} sethomeId={sethomeId} />}
                        </SwipeableDrawer>
                    </div>
                    <div>
                        {userProfile && <Sidebar4expenses setcurrentExpenses={setcurrentExpenses} setuserExpenses={setuserExpenses} socket={socket} homes={userProfile.homes} sethomeId={sethomeId} />}
                        {/* {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} showprofile={false} />} */}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Expense
