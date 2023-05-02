import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";

// server
import { BACKEND } from "../constant";

import io from 'socket.io-client';


import { ThemeContext } from '../ThemeProvider';


const ExpenseDialog = ({ expense, setOpen }) => {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);

    const [userId, setUserId] = useState('')


    // replace with your websocket server address
    // if (socket) {
    //     socket.emit('join-room', expense._id);
    // }

    const socket = io(BACKEND)

    // to join the current room
    socket.emit('join-room', expense._id);
    // socket.join(expense._id);
    // console.log(`Socket ${socket.id} joined room ${expense._id}`);
    // console.log(socket)

    const [comments, setComments] = useState(expense.comments)
    const [newcomment, setnewComment] = useState('');
    const [username, setUsername] = useState('');
    // const [socket, setSocket] = useState(null)

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        console.log(newcomment,userId)

        // console.log(expense._id)
        const date = new Date(); // or use Date.now() if you don't need the current date
        const isoDate = date.toISOString();

        socket.emit('addcomment', {
            userId,
            comment: newcomment,
            expenseId: expense._id,
            date: isoDate
        }, expense._id);

        socket.on('updatecomment', (newexp) => {
            console.log('comment from the server', newexp.newexp)

            setComments(newexp.newexp.comments)

            const homeExpenses = JSON.parse(sessionStorage.getItem(`homeexpenses-${newexp.newexp.home}`));
            const userExpenses = JSON.parse(sessionStorage.getItem('userexpenses'));

            // const home = homeExpenses.find((h) => h.home === newexp.newexp.home);
            if (homeExpenses) {
                const expenseIndex = homeExpenses.findIndex((e) => e._id === expense._id);
                homeExpenses[expenseIndex] = newexp.newexp;
            }

            // userexpense
            if (userExpenses) {
                const userexpenseIndex = userExpenses.findIndex((e) => e._id === expense._id);
                userExpenses[userexpenseIndex] = newexp.newexp
            }

            sessionStorage.setItem(`homeexpenses-${newexp.newexp.home}`, JSON.stringify(homeExpenses));
            sessionStorage.setItem('userexpenses', JSON.stringify(userExpenses));


            setnewComment('');
            setUsername('');
            // expense.comments.push(comment.data)
        })


        // try {
        //     const response = await fetch(BACKEND + '/expenses/addcomments', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             userId,
        //             comment: newcomment,
        //             expenseId: expense._id
        //         })
        //     });
        //     const data = await response.json();
        //     console.log(data);
        //     setnewComment('');
        //     setUsername('');
        // } catch (error) {
        //     console.error(error);
        // }
    };


    // const comments = [
    //     {
    //         _id: 1,
    //         user: "John Doe",
    //         comment: "Great post!",
    //         date: "2022-05-01T10:00:00.000Z"
    //     },
    //     {
    //         _id: 3,
    //         user: "Bob Johnson",
    //         comment: "This is really helpful.",
    //         date: "2022-05-03T15:00:00.000Z"
    //     }
    // ]; m

    // let mount = false
    // useEffect(() => {
    //     if (!mount) {
    //         setComments(prevComments => [...prevComments, ...expense.comments]);
    //     }
    //     console.log('comments', comments)
    // }, [expense.comments])


    // getting the userid from cookies-----------
    useEffect(() => {
        const userid = Cookies.get('userId')
        console.log('userid in  useeffecst')
        setUserId(userid)

        console.log('expense in fialog', expense)

    }, [])

    // // setting socket
    // useEffect(() => {

    //     setSocket(socket)
    // }, [socket])


    return (
        <div className="fixed z-10 inset-0 overflow-y-auto pt-10">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                <div onClick={() => setOpen(false)} className={`absolute w-[100vw] h-[100vh] inset-0 ${theme.backgroundColor} opacity-800`}></div>

                {/* <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span> */}
                <div className={`inline-block align-bottom ${theme.boxbg} ${theme.primaryTextColor} rounded-lg text-left overflow-scroll shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full px-5 py-3`}>

                    <div className="sm:flex">

                        {/* circle icon */}
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                            <i className="fas fa-info-circle text-green-500">i</i>
                        </div>

                        {/* info */}
                        <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
                            <h3 className={`${theme.primaryTextColor} text-lg leading-6 font-medium `}>Expense Information</h3>
                            <div className="mt-2">
                                <p className={`text-sm ${theme.secondaryTextColor} mb-2`}>
                                    <span className="font-bold">Item: </span>
                                    {expense.item}
                                </p>
                                <p className={`text-sm ${theme.secondaryTextColor} mb-2`}>
                                    <span className="font-bold">Description: </span>
                                    {expense.description}
                                </p>
                                <p className={`text-sm ${theme.secondaryTextColor} mb-2`}>
                                    <span className="font-bold">Price: </span>
                                    {expense.price}
                                </p>
                                <p className={`text-sm ${theme.secondaryTextColor} mb-2`}>
                                    <span className="font-bold">Added By: </span>
                                    {expense.addedby.name}
                                </p>
                                <p className={`text-sm ${theme.secondaryTextColor} mb-2`}>
                                    <span className="font-bold">Date: </span>
                                    {new Date(expense.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* comments */}
                    <div className="mt-5 sm:ml-4 text-left">
                        <h3 className={`text-lg leading-6 font-medium ${theme.primaryTextColor} `}>Comments</h3>
                        <div className="mt-2">
                            {comments.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {comments.map((comment, index) => (
                                        <li key={index} className="py-2 flex">
                                            <div className="ml-3">
                                                <p className={` ${theme.primaryTextColor} text-sm font-medium`}>{comment.user.name}</p>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    <p>{comment.comment}</p>
                                                    {/* <p className="mt-2 text-xs text-gray-400">{format(new Date(comment.date), 'MMMM dd, yyyy h:mm a')}</p> */}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No comments yet.</p>
                            )}
                        </div>
                    </div>


                    {/* add comment */}
                    <div className={` ${theme.boxbg} px-4 py-3 sm:px-6 sm:flex sm:flex-col mt-5`}>
                        {/* <h1 className=''>Add Comment</h1> */}
                        <form onSubmit={handleCommentSubmit} className="w-full">
                            <div className="flex flex-col">
                                <label htmlFor="comment" className="mt-3 text-sm font-medium text-gray-900">
                                    Add a comment
                                </label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows={3}
                                    className={` ${theme.boxbg} mt-1 py-2 px-3 block w-full border border-gray-500 rounded-md ${theme.primaryTextColor} shadow-sm`}
                                    value={newcomment}
                                    onChange={(e) => setnewComment(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-3 text-right sm:mt-0 sm:ml-3">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>


    )

}

export default ExpenseDialog