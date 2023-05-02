import React, { useContext, useEffect, useState } from 'react'
// import ExpenseDialog from './reusable/ExpenseDialog'
import Cookies from 'js-cookie'

import ExpenseForm from './reusable/ExpenseForm';
import InviteMembersDialog from './reusable/InviteMembersDialog';

import { ThemeContext } from './ThemeProvider';

function Sidebar4expenses({ setcurrentExpenses, setuserExpenses, socket, homes, sethomeId }) {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isHomeMembersVisible, setIsHomeMembersVisible] = useState(false);
    const [isInviteMembersDialogOpen, setIsInviteMembersDialogOpen] = useState(false);
    const [selectedHomeId, setSelectedHomeId] = useState(null);

    const handleHomeSelection = (homeId) => {
        setSelectedHomeId(homeId);
        Cookies.set('homeid', homeId)
        sethomeId(homeId)
        console.log(homeId)
    };

    // TOGGLE NEW EXPENSE DIALOG
    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    // TOGGLE INVITE MEMBER DIALOG
    const handleMembersToggle = () => {
        setIsHomeMembersVisible(!isHomeMembersVisible);
    };

    const handleInviteMembersClick = () => {
        setIsInviteMembersDialogOpen(true);
    }

    // SETTING A DEFAULT HOME
    useEffect(() => {

        if (homes) {
            const homeid = Cookies.get('homeid')
            if (homeid) {
                return setSelectedHomeId(homeid)
            }

            if (!selectedHomeId && homes.length > 0) {
                handleHomeSelection(homes[0]._id)
            }
        }
    }, [homes])


    return (
        <div className={`${theme.boxbg} w-full h-full`}>

            {(homes && homes.length > 0) ? <div className={`${theme.boxbg} p-4`}>
                <h2 className={`${theme.primaryTextColor} font-bold text-2xl mb-4`}>Homes List</h2>

                <div className="flex flex-col">
                    {homes.map((home) => (
                        <button
                            key={home.id}
                            onClick={() => handleHomeSelection(home._id)}
                            className={`w-fit rounded-md py-2 px-4 flex items-center ${selectedHomeId === home._id && 'font-bold'} ${theme.primaryTextColor}`}>
                            {selectedHomeId === home._id && <span className={`${theme.primaryTextColor}`}>&#9658;</span>}
                            <span className="ml-5">{home.name}</span>
                        </button>
                    ))}
                </div>

   
                {selectedHomeId && ( 
                    <div className="mt-4 border-t ">
                        <span className={`${theme.secondaryTextColor} block mb-2`}>
                            created by - {homes.find((home) => home._id === selectedHomeId).owner.name}
                        </span>
                        <h3 className={`${theme.primaryTextColor} font-bold text-lg mb-2`}>Members</h3>
                        <ul className="space-y-2 mb-5">
                            {homes
                                .find((home) => home._id === selectedHomeId)
                                .members.map((users, index) => (
                                    <li key={index} className={`${theme.primaryTextColor} font-medium`}>
                                        {users.user.name}
                                    </li>
                                ))}
                        </ul>
                        <div className='flex flex-wrap space-x-1 space-y-1 '>
                            <button
                                className={`${theme.primaryBtn} hover:${theme.hoverBtn} text-white font-bold py-2 px-4 rounded`}
                                onClick={handleOpenDialog}>
                                Add Expense
                            </button>
                            <button
                                onClick={handleInviteMembersClick}
                                className={`${theme.primaryBtn} hover:${theme.hoverBtn} text-white font-bold py-2 px-4 rounded ml-2`}>
                                Invite Member
                            </button>
                        </div>
                    </div>
                )}
            </div> : <p className={` ${theme.primaryTextColor} p-4 text-center font-semibold text-lg`}>
                Please add a home to add expenses!
            </p>}

            {isDialogOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div
                            className={`inline-block align-bottom ${theme.boxbg} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full`}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={handleCloseDialog}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-6 h-6">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 0a10 10 0 100 20 10 10 0 000-20zm2.93 13.07a1 1 0 11-1.41 1.41L10 11.41l-1.52 1.52a1 1 0 11-1.41-1.41L8.59 10 7.07 8.48a1 1 0 111.41-1.41L10 8.59l1.52-1.52a1 1 0 111.41 1.41L11.41 10l1.52 1.52z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className={`${theme.boxbg} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                                {homes && <ExpenseForm setcurrentExpenses={setcurrentExpenses} setuserExpenses={setuserExpenses} socket={socket} handleCloseDialog={handleCloseDialog} members={homes.find((home) => home._id === selectedHomeId).invitedusers} />}
                            </div>


                        </div>
                    </div>
                </div>
            )}

            <div>
                {isInviteMembersDialogOpen && <InviteMembersDialog onClose={() => setIsInviteMembersDialogOpen(false)} />}
            </div>
            {/* Other components */}
        </div>
    )
}

export default Sidebar4expenses
