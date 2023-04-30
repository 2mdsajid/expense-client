import React, { useEffect, useState } from 'react'
// import ExpenseDialog from './reusable/ExpenseDialog'
import Cookies from 'js-cookie'

import ExpenseForm from './reusable/ExpenseForm';
import InviteMembersDialog from './reusable/InviteMembersDialog';

function Sidebar4expenses({setcurrentExpenses,setuserExpenses, socket,homes, sethomeId }) {
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
        if (!selectedHomeId) {
            handleHomeSelection(homes[0]._id)
        }
    }, [])


    return (
        <div>

            <h2>Homes List</h2>
            <ul>
                {homes.map((home) => (
                    <li key={home.id}>
                        <label>
                            <input
                                type="radio"
                                name="home"
                                value={home.id}
                                checked={selectedHomeId === home._id}
                                onChange={() => handleHomeSelection(home._id)}
                            />
                            {home.name}
                        </label>

                    </li>
                ))}
            </ul>

            {selectedHomeId && (
                <div>
                    <span className='text-green-500'>created by - {homes.find((home) => home._id === selectedHomeId).owner.name}</span>
                    <h3>Members</h3>

                    <ul>
                        {homes.find((home) => home._id === selectedHomeId).invitedusers.map((users, index) => (
                            <li key={index}>{users.name}</li>
                        ))}
                    </ul>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleOpenDialog}>
                        Add Expense
                    </button>

                    <button
                        onClick={handleInviteMembersClick}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Invite Member
                    </button>
                </div>
            )}

            {isDialogOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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
