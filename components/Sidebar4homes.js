import { useState } from 'react';
import InviteMembersDialog from './reusable/InviteMembersDialog';
import Cookies from 'js-cookie'

const Sidebar4homes = ({ homes }) => {

    const [isHomeMembersVisible, setIsHomeMembersVisible] = useState(false);
    const [isInviteMembersDialogOpen, setIsInviteMembersDialogOpen] = useState(false);

    const [selectedHomeId, setSelectedHomeId] = useState(null);

    const handleHomeSelection = (homeId) => {
        setSelectedHomeId(homeId);
        Cookies.set('homeid', homeId)
        console.log(homeId)
    };

    const handleMembersToggle = () => {
        setIsHomeMembersVisible(!isHomeMembersVisible);
    };

    const handleInviteMembersClick = () => {
        setIsInviteMembersDialogOpen(true);
    };

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
                    <div>
                        <span className='text-green-500'>created by - {homes.find((home) => home._id === selectedHomeId).owner.name}</span>
                        <h3>Members</h3>
                        <ul>
                            {homes.find((home) => home._id === selectedHomeId).invitedusers.map((users, index) => (
                                <li key={index}>{users.name}</li>
                            ))}
                        </ul>
                        <button
                            onClick={handleInviteMembersClick}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Invite Member
                        </button>

                    </div>

                </div>
            )}
            {isInviteMembersDialogOpen && <InviteMembersDialog onClose={() => setIsInviteMembersDialogOpen(false)} />}
        </div>
    );
};

export default Sidebar4homes;
