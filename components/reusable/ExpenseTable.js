import React, { useContext, useState } from 'react'
import ExpenseDialog from './ExpenseDialog'

import { expenses_data } from '../constant';

import { ThemeContext } from '../ThemeProvider';


function ExpenseTable({ userexpenses,head }) {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);
    
    const itemsPerPage = 5
    const [open, setOpen] = useState(false); //to show/hide the dialog
    const [currentexpense, setcurrentExpense] = useState({}) //to show the content of dialog

    const [currentPage, setCurrentPage] = useState(1);
    const maxPages = Math.ceil(userexpenses.length / itemsPerPage);
    // console.log('maxpages', maxPages)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = userexpenses.slice(indexOfFirstItem, indexOfLastItem).slice().reverse()

    const nextPage = () => {
        if (currentPage < maxPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <div className={`mx-auto p-4 ${theme.boxbg} ${theme.primaryTextColor} rounded-lg shadow-lg mb-4 overflow-x-auto`}>
            <h2 className="text-lg font-bold mb-4">{head}</h2>
            <table className="w-full table-auto ">
                <thead>
                    <tr className={`${theme.boxbg} ${theme.primaryTextColor} text-sm font-semibold uppercase`}>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Item</th>
                        {/* <th className="py-2 px-4">Description</th> */}
                        <th className="py-2 px-4">Price</th>
                        {/* <th className="py-2 px-4">Added by</th> */}
                        <th className="py-2 px-4">Info</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((expense) => (
                        <>
                            <tr key={expense._id} className="border-t-2 border-gray-200 text-center ">
                                <td className="py-2 px-4 ">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4">{expense?.item}</td>
                                {/* <td className="py-2 px-4">{expense?.description}</td> */}
                                <td className="py-2 px-4">{expense?.price}</td>
                                {/* <td className="py-2 px-4">{expense?.addedby}</td> */}
                                <td className="py-2 px-4">
                                    <button
                                        className={`${theme.primaryIcon} hover:${theme.hoverIcon}  py-1 px-2 rounded-full`}
                                        onClick={() => {
                                            setcurrentExpense(expense)
                                            setOpen(true)
                                        }}>
                                        <i className="fas fa-info-circle ">i</i>
                                    </button>
                                </td>
                                {open && <ExpenseDialog expense={currentexpense} setOpen={setOpen} />}
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
            {/* pagination */}

            {maxPages>1 && <div className='flex items-center justify-center'>
                <button onClick={prevPage} className={`${theme.primaryIcon} hover:${theme.hoverIcon} py-2 px-3 rounded-full`}>
                    <i className="fas fa-arrow-left">{'<'}</i>
                </button>
                {Array.from({ length: maxPages }, (_, index) => (
                    <button key={index} onClick={() => setCurrentPage(index + 1)} className={`bg-gray-${index===currentPage-1 ? '700' : '500'} hover:bg-gray-700 text-white font-bold py-2 px-4 mx-1 rounded-full`}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={nextPage} className={`${theme.primaryIcon} hover:${theme.hoverIcon} py-2 px-3 rounded-full`}>
                    <i className="fas fa-arrow-right">{'>'}</i>
                </button>
            </div>}


            {/* Add content for recent expenses section */}
        </div>
    )
}

export default ExpenseTable
