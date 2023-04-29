import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { BACKEND } from '../constant'


const DialogBox = ({ onClose, onJoinHome }) => {

    const [showform, setshowForm] = useState(false)

    const [homeName, setHomeName] = useState("");
    const [members, setMembers] = useState([{ name: "", email: "" }]);

    const addMember = () => {
        setMembers([...members, { name: "", email: "" }]);
    };

    const removeMember = (index) => {
        const updatedMembers = members.filter((member, i) => i !== index);
        setMembers(updatedMembers);
    };


    const createHome = () => {
        setshowForm(true)
    }

    const handleMemberChange = (event, index) => {
        const { name, value } = event.target;
        const updatedMembers = [...members];
        updatedMembers[index][name] = value;
        setMembers(updatedMembers);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userId = Cookies.get('userId');
        const data = { homeName, members };
        console.log('members', userId);

        try {
            const res = await fetch(BACKEND + '/createhome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ownerId: userId,
                    name: homeName,
                    invitedUsers: members
                })
            });

            const data = await res.json();
            console.log(data);

            // Get the existing userProfile from localStorage
            const userProfile = JSON.parse(localStorage.getItem('userProfile'));

            // Update the homes property of the userProfile
            userProfile.homes.push(data.home);

            // Set the updated userProfile back to localStorage
            localStorage.setItem('userProfile', JSON.stringify(userProfile));


            setHomeName('')
            setMembers([{ name: "", email: "" }])
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 bg-gray-700">
            <div className="relative bg-white rounded-lg w-4/5 sm:w-1/3 md:w-1/4 min-h-auto max-h-[80vh] overflow-y-scroll">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 0a10 10 0 100 20 10 10 0 000-20zm2.93 13.07a1 1 0 11-1.41 1.41L10 11.41l-1.52 1.52a1 1 0 11-1.41-1.41L8.59 10 7.07 8.48a1 1 0 111.41-1.41L10 8.59l1.52-1.52a1 1 0 111.41 1.41L11.41 10l1.52 1.52z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {showform ?
                    <div className="bg-white rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-4">Create Home</h2>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2 font-bold text-sm text-gray-800" htmlFor="homeName">
                                Home Name
                            </label>
                            <input
                                type="text"
                                id="homeName"
                                name="homeName"
                                value={homeName}
                                onChange={(event) => setHomeName(event.target.value)}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
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
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    Create Home
                                </button>
                            </div>
                        </form>
                    </div>
                    : <div className="p-4">
                        <h2 className="text-lg font-bold mb-4">Create or Join Home</h2>
                        <div className="flex items-center justify-between">
                            <button
                                className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                onClick={createHome}
                            >
                                Create Home
                            </button>
                            <button
                                className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={onJoinHome}
                            >
                                Join Home
                            </button>
                        </div>
                    </div>}

            </div>
        </div>
    );
};

export default DialogBox;
