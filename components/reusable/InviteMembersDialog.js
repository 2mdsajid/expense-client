import { useState } from 'react';
import Cookies from 'js-cookie'
import {BACKEND} from '../constant'

const InviteMembersDialog = ({ onClose }) => {
    const [email, setEmail] = useState('');

    const [members, setMembers] = useState([{ name: "", email: "" }]);

    const addMember = () => {
        setMembers([...members, { name: "", email: "" }]);
    };

    const removeMember = (index) => {
        const updatedMembers = members.filter((member, i) => i !== index);
        setMembers(updatedMembers);
    };

    const handleMemberChange = (event, index) => {
        const { name, value } = event.target;
        const updatedMembers = [...members];
        updatedMembers[index][name] = value;
        setMembers(updatedMembers);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const homeid = Cookies.get('homeid');
        console.log('homeid', homeid);
        console.log(members);

        try {
            const endpointUrl = BACKEND+'/addinvitedusers'; // replace with your endpoint URL
            const invitedUsers = members.map(({ name, email }) => ({ name, email }));
            const response = await fetch(endpointUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ homeid, invitedUsers })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data); // do something with the response data
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

        setMembers([{ name: '', email: '' }]);
        onClose();
    };


    return (
        <div className={`fixed inset-0 z-10 block border border-red-500 overflow-y-auto h-fit `}>
            <div className="flex items-center justify-center min-h-screen overflow-y-auto max-h-[80vh]">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">Invite Member</h2>
                    <form onSubmit={handleSubmit}>
                        {members.map((member, index) => (
                            <div className="mt-4" key={index}>
                                <p className='block mb-2 font-bold text-sm text-gray-800'>
                                    Member {index + 1}
                                    <button
                                        className="ml-2 text-red-500"
                                        onClick={() => removeMember(index)}
                                    >
                                        x
                                    </button>
                                </p>
                                <input
                                    type="text"
                                    id={`memberName${index}`}
                                    name="name"
                                    placeholder='Name'
                                    value={member.name}
                                    onChange={(event) => handleMemberChange(event, index)}
                                    className="w-full px-3 py-2 mb-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                />

                                <input
                                    type="email"
                                    id={`memberEmail${index}`}
                                    name="email"
                                    placeholder='Email'
                                    value={member.email}
                                    onChange={(event) => handleMemberChange(event, index)}
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                        ))}

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                                onClick={addMember}
                            >
                                Add Member
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Invite
                            </button>
                            <button
                                className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default InviteMembersDialog;
