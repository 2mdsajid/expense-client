import { useContext, useState } from 'react';
import Cookies from 'js-cookie'
import { BACKEND } from '../constant'

import { ThemeContext } from '../ThemeProvider';

import { Alert, AlertColor } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';



import { useRouter } from 'next/router'


const InviteMembersDialog = ({ onClose }) => {
    const router = useRouter();

    const { isDark, toggleTheme, theme } = useContext(ThemeContext);
    const [email, setEmail] = useState('');

    const [members, setMembers] = useState([{ name: "", email: "" }]);

    const [alertseverity, setalertSeverity] = useState('warning');
    const [alertmessage, setalertMessage] = useState('Please provide an authentic email');
    const [showalert, setshowAlert] = useState(false)
    const [showprogress, setshowProgress] = useState(false)



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
        setshowProgress(true)
        console.log('homeid', homeid);
        console.log(members);
        
        try {
            const endpointUrl = BACKEND + '/addinvitedusers'; // replace with your endpoint URL
            const invitedUsers = members.map(({ name, email }) => ({ name, email }));
            const response = await fetch(endpointUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ homeid, invitedUsers })
            });

            const data = await response.json();
            setshowAlert(true)
            setalertMessage(data.message)
            setshowProgress(false)

            if (data.status === 201) {
                console.log(data);
                console.log("🚀 ~ file: InviteMembersDialog.js:67 ~ handleSubmit ~ data:", data)

                setalertSeverity('success')
                setMembers([{ name: '', email: '' }]);

                const userprofile = JSON.parse(sessionStorage.getItem('userprofile'));
                const updatedHomes = userprofile.homes.map(home => {
                  if (home._id === data.home._id) {
                    return data.home;
                  } else {
                    return home;
                  }
                });
                
                userprofile.homes = updatedHomes;
                sessionStorage.setItem('userprofile', JSON.stringify(userprofile));

                return
            
                router.push({
                    pathname: '/dashboard',
                }, '/dashboard', // "as" argument
                )
            }else {
                setalertSeverity('warning')
            }

            setTimeout(() => {
                setshowAlert(false)
            }, 4000);

        } catch (error) {
            console.error(error);
            return router.push({
                pathname: '/error',
            }, '/error', // "as" argument
            )
        }
        

    };


    return (
        <div className={`fixed inset-0 z-10 border-red-500 overflow-y-auto h-fit flex items-center justify-center min-h-screen max-h-[80vh] `}>
            <div className={`absolute h-[100vh] w-[100vw] -z-10 ${theme.boxbg} opacity-[0.95]`}>
            </div>
            <div className={`${theme.boxbg} rounded-lg shadow-lg p-6 w-[90%] max-w-md`}>
                <div className='flex justify-between'>
                    <h2 className={`${theme.primaryTextColor} text-lg font-bold mb-4`}>Invite Member</h2>
                    <button
                        className=" top-2 right-2 text-gray-400 hover:text-gray-600"
                        onClick={onClose}>
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
                </div>
                {showalert && <div className='my-1'><Alert severity={alertseverity} onClose={() => { setshowAlert(false) }}>{alertmessage}</Alert></div>}

                <form onSubmit={handleSubmit}>
                    {members.map((member, index) => (
                        <div className="mt-4" key={index}>
                            <p className={`block mb-2 font-bold text-sm ${theme.primaryTextColor}`}>
                                Member {index + 1}
                                <button className={`${theme.secondaryTextColor} ml-2`} onClick={() => removeMember(index)}>
                                    x
                                </button>
                            </p>
                            <input
                                type="text"
                                id={`memberName${index}`}
                                name="name"
                                placeholder="Name"
                                value={member.name}
                                onChange={(event) => handleMemberChange(event, index)}
                                className={`w-full px-3 py-2 ${theme.boxbg} mb-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500`}
                                required
                            />
                            <input
                                type="email"
                                id={`memberEmail${index}`}
                                name="email"
                                placeholder="Email"
                                value={member.email}
                                onChange={(event) => handleMemberChange(event, index)}
                                className={`w-full px-3 py-2 ${theme.boxbg} text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500`}
                                required
                            />
                        </div>
                    ))}
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className={`px-4 mb-2 py-2 ${theme.primaryTextColor} ${theme.primaryIcon} rounded-md hover:${theme.hoverIcon} mr-2`}
                            onClick={addMember}
                        >
                            Add Member
                        </button>
                    </div>
                    {/* <div className="flex justify-end">
                        <button
                            className={`${theme.primaryBtn} hover:${theme.hoverBtn} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                            type="submit"
                        >
                            Invite
                        </button>

                    </div> */}

                    <div className={`bg-blue-500 mr-2 text-white font-bold flex justify-center mt-3 w-1/3 mx-auto rounded`}>
                        {showprogress ?
                            <div className='py-1'>

                                <CircularProgress
                                    size={30}
                                    sx={{ color: '#ffffff' }}
                                />

                            </div> :
                            <button
                                type="submit"
                                className={`${theme.primaryBtn} w-full text-white font-bold p-2 rounded focus:outline-none focus:shadow-outline`}>
                                Invite
                            </button>}
                    </div>
                </form>
            </div>
        </div>

    );
};

export default InviteMembersDialog;
