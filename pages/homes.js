import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '@/components/ThemeProvider';

import SwipeableDrawer from '@mui/material/SwipeableDrawer'; //mui

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Sidebar4homes from '../components/Sidebar4homes'

function Homes() {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userProfile, setUserProfile] = useState();
    const [showSidebar, setShowSidebar] = useState(true); //sidebar toggle


    // toggle the sidebar in small screens
    const toggleDrawer = (open) => (event) => {
        // ignore events from input, textarea and buttons inside the drawer
        if (
            event &&
            event.type === 'keydown' &&
            ((event).key === 'Tab' || (event).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };



    // getting the profile from localstorage
    useEffect(() => {
        const userProfile = JSON.parse(localStorage.getItem('userprofile'));
        setUserProfile(userProfile)
        console.log(userProfile)
    }, [])

    return (
        <div className={`min-h-screen w-screen ${theme.backgroundColor} ${theme.primaryTextColor}`}>
            <Header user={userProfile} setDrawerOpen={setDrawerOpen} />
            <div className="flex flex-wrap pt-10">

                {/* SIDE BAR WITH DRAWER */}
                <div className='hidden md:block md:w-[25%] xl:w-[20%] bg-white h-[90vh] rounded-lg shadow-lg mx-auto overflow-y-auto'>

                    <div className="md:hidden invisible">
                        {/* <Button onClick={() => setDrawerOpen(true)}>Open Profile</Button> */}
                        <SwipeableDrawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={toggleDrawer(false)}
                            onOpen={toggleDrawer(true)}
                            className="block md:hidden">
                            {/* {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} showprofile={false} />} */}
                            {userProfile && <Sidebar4homes homes={userProfile.homes} />}
                        </SwipeableDrawer>
                    </div>

                    <div>
                        {userProfile && <Sidebar4homes homes={userProfile.homes} />}
                        {/* {userProfile && <Sidebar userProfile={userProfile} showSidebar={showSidebar} showprofile={false} />} */}
                    </div>

                </div>

                {/* rest of contents */}
                <div className='w-[90%] md:w-[70%] xl:w-[75%] mx-auto'>

                </div>

            </div>
        </div>
    )
}

export default Homes
