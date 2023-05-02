import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BACKEND } from '../constant'

import CreateForm from './CreateForm';
import JoinForm from './JoinForm';

import { Alert, AlertColor } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { ThemeContext } from '../ThemeProvider';

import { useRouter } from 'next/router'



const CreateHomeDialog = ({ setIsDialogOpen }) => {
    const router = useRouter();

    const { isDark, toggleTheme, theme } = useContext(ThemeContext)

    // dialogue box for messages
    const [alertseverity, setalertSeverity] = useState('warning');
    const [alertmessage, setalertMessage] = useState('Please provide an authentic email');
    const [showalert, setshowAlert] = useState(false)
    const [showprogress, setshowProgress] = useState(false)

    const [showform, setshowForm] = useState(true)
    const [showcreateform, setshowcreateForm] = useState(false)
    const [showjoinform, setshowjoinForm] = useState(false)

    const [homeName, setHomeName] = useState("");
    const [members, setMembers] = useState([{ name: "", email: "" }]);


    const [joinhomeid, setjoinhomeId] = useState('')

    const dialogClose = () => {
        setIsDialogOpen(false)
    }

    const addMember = () => {
        setMembers([...members, { name: "", email: "" }]);
    };

    const removeMember = (index) => {
        const updatedMembers = members.filter((member, i) => i !== index);
        setMembers(updatedMembers);
    };

    const onJoinHome = () => {
        setshowjoinForm(true);
        setshowcreateForm(false);
        setshowForm(false);
    };

    const createHome = () => {
        setshowcreateForm(true);
        setshowjoinForm(false);
        setshowForm(false);
    };

    const handleMemberChange = (event, index) => {
        const { name, value } = event.target;
        const updatedMembers = [...members];
        updatedMembers[index][name] = value;
        setMembers(updatedMembers);
    };

    // to check the format of homd-e id
    function validateFormat(str) {
        const regex = /^[0-9a-fA-F]{24}$/;
        return regex.test(str);
    }


    const onSubmitJoin = async (e) => {
        e.preventDefault()

        setshowProgress(true)

        const userid = Cookies.get('userId')
        if (!userid) {
            return console.log('no user id found')
        }

        console.log('joinhomeid', joinhomeid)

        const isvalid = validateFormat(joinhomeid)
        if (!isvalid) {
            setalertMessage('Please input a valid home-id')
            setshowAlert(true)
            setshowProgress(false)
            setalertSeverity('warning')

            setTimeout(() => {
                return setshowAlert(false)
            }, 2500);

            return
        }

        try {
            const response = await fetch(BACKEND + '/joinhomeviaid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    homeid: joinhomeid,
                    userid: userid
                })
            });

            const data = await response.json();
            // console.log(data);

            setshowAlert(true)
            setalertMessage(data.message)
            setshowProgress(false)

            if (data.status === 201) {
                console.log('data after join', data);

                setalertSeverity('success')
                sessionStorage.setItem('userprofile', JSON.stringify(data.user));

                // window.location.reload();

            } else {
                setalertSeverity('warning')
            }

            setTimeout(() => {
                setshowAlert(false)
            }, 2500);

        } catch (error) {
            console.error(error);
            return router.push({
                pathname: '/error',
            }, '/dashboard', // "as" argument
            )
        }

    }


    const onSubmitCreate = async (event) => {
        event.preventDefault();

        setshowProgress(true)

        const userId = Cookies.get('userId');
        const data = { homeName, members };
        console.log('members', userId);

        console.log('create home data', data)

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
            // console.log(data);

            setshowAlert(true)
            setalertMessage(data.message)
            setshowProgress(false)


            if (data.status === 201) {
                console.log('data after create', data);
                setalertSeverity('success')
                // const userProfile = JSON.parse(localStorage.getItem('userProfile'));
                // userProfile.homes.push(data.home);
                sessionStorage.setItem('userprofile', JSON.stringify(data.updateduser));

                setHomeName('')
                setMembers([{ name: "", email: "" }])
                // console.log("🚀 ~ file: CreateHomeDialog.js:190 ~ onSubmitCreate ~ ")

                window.location.reload();

                // console.log("🚀 ~ file: CreateHomeDialog.js:193 ~ onSubmitCreate ~ reload:")


            } else {
                setalertSeverity('warning')
            }

            setTimeout(() => {
                setshowAlert(false)
            }, 2500);

        } catch (error) {
            console.error(error);
            return router.push({
                pathname: '/error',
            }, '/dashboard', // "as" argument
            )
        }
    };

    useEffect(() => {
        console.log('create home dialog open')
    }, [])


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 bg-gray-700">
            <div className="relative bg-white rounded-lg w-4/5 sm:w-1/3 md:w-1/4 min-h-auto max-h-[80vh] overflow-y-scroll">

                {/* <p>a dilamlwuiesgnzb ,jhemn</p> */}
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={dialogClose}>
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


                {showjoinform && <div>
                    <div className={`${theme.boxbg} rounded-lg p-4`}>
                        <form onSubmit={onSubmitJoin}>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="homeid" className={`${theme.primaryTextColor} font-medium mb-2`}>
                                    Home ID
                                </label>
                                <input
                                    type="text"
                                    id="homeid"
                                    name="homeid"
                                    placeholder="Enter home ID"
                                    onChange={(e) => setjoinhomeId(e.currentTarget.value)}
                                    className={`py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200`}
                                />
                            </div>

                            {showalert && <div className={`my-1`}><Alert severity={alertseverity} onClose={() => { setshowAlert(false) }}>{alertmessage}</Alert></div>}

                            <div className={`${theme.primaryColor} text-white font-bold flex flex-start justify-center mt-3 w-1/3 rounded cursor-pointer hover:${theme.hoverBtn}`}>
                                {showprogress ?
                                    <div className='py-1'>
                                        <CircularProgress
                                            size={30}
                                            sx={{ color: '#ffffff' }}
                                        />
                                    </div> :
                                    <button
                                        type="submit"
                                        className={`w-full h-full rounded py-3 focus:outline-none focus:shadow-outline`}>
                                        Join
                                    </button>}
                            </div>
                        </form>
                    </div>
                </div>}


                {showcreateform && <div>
                    <div className={` rounded-lg p-4 ${theme.boxbg}`}>
                        <h2 className={`text-lg font-bold mb-4 ${theme.primaryTextColor}`}>Create Home</h2>

                        <form onSubmit={onSubmitCreate}>
                            <label className={`block mb-2 font-bold text-sm ${theme.primaryTextColor}`} htmlFor="homeName">
                                Home Name
                            </label>
                            <input
                                type="text"
                                id="homeName"
                                name="homeName"
                                placeholder='Home Name'
                                value={homeName}
                                onChange={(event) => setHomeName(event.target.value)}
                                className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-${theme.primaryColor}`}
                                required
                            />
                            {members.map((member, index) => (
                                <div className="mt-4" key={index}>
                                    <p className={`block mb-2 font-bold text-sm ${theme.primaryTextColor}`}>
                                        Member {index + 1}
                                        <button
                                            className={`ml-2 text-red-500`}
                                            onClick={() => removeMember(index)}>
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
                                        className={`w-full px-3 py-2 mb-2 text-gray-700 border rounded-lg focus:outline-none focus:border-${theme.primaryColor}`}
                                        required
                                    />

                                    <input
                                        type="email"
                                        id={`memberEmail${index}`}
                                        name="email"
                                        placeholder='Email'
                                        value={member.email}
                                        onChange={(event) => handleMemberChange(event, index)}
                                        className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-${theme.primaryColor}`}
                                        required
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    />
                                    {member.email.length > 0 && <p className={`text-red-600 ${theme.secondaryTextColor}`}>{!member.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) && 'Please enter a valid email'}</p>}
                                </div>
                            ))}
                            {showalert && <div className={`my-1 ${theme.secondaryTextColor}`}><Alert severity={alertseverity} onClose={() => { setshowAlert(false) }}>{alertmessage}</Alert></div>}

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className={`p-2 text-white border bg-slate-500 rounded-md hover:bg-${theme.hoverBtn} mr-2`}
                                    onClick={addMember}>
                                    Add Member
                                </button>


                                <div className={`text-white ${theme.primaryColor} font-bold flex flex-start justify-center mt-3 w-1/3 rounded cursor-pointer`}>
                                    {showprogress ?
                                        <div className='py-1'>
                                            <CircularProgress
                                                size={30}
                                                sx={{ color: '#ffffff' }} />
                                        </div> :
                                        <button
                                            type="submit"
                                            className={`w-full h-full rounded py-3 focus:outline-none focus:shadow-outline`}>
                                            Create
                                        </button>}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}

                {showform && (
                    <div className={`p-4 ${theme.backgroundColor}`}>
                        <h2 className={`text-lg font-bold ${theme.primaryTextColor} mb-4`}>
                            Create or Join Home
                        </h2>
                        <div className="flex items-center justify-between">
                            <button
                                className={`px-4 py-2 mr-2 text-white ${theme.primaryColor} rounded-md hover:${theme.hoverBtn}`}
                                onClick={createHome}
                            >
                                Create Home
                            </button>
                            <button
                                className={`px-4 py-2 ${theme.primaryTextColor} ${theme.boxbg} rounded-md hover:${theme.hoverBtn}`}
                                onClick={onJoinHome}
                            >
                                Join Home
                            </button>
                        </div>
                    </div>
                )}



            </div>
        </div>
    );
};

export default CreateHomeDialog;
