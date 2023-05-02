import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie'

import { BACKEND } from '../constant';

import io from 'socket.io-client';

import { ThemeContext } from '../ThemeProvider';

import { Alert, AlertColor } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';



const ExpenseForm = ({ setcurrentExpenses, setuserExpenses, socket, handleCloseDialog, members }) => {
  const { isDark, toggleTheme, theme } = useContext(ThemeContext);

  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('misc');
  const [sharedBy, setSharedBy] = useState('');
  const [share, setShare] = useState('');

  const [alertseverity, setalertSeverity] = useState('warning');
  const [alertmessage, setalertMessage] = useState('Please provide an authentic email');
  const [showalert, setshowAlert] = useState(false)
  const [showprogress, setshowProgress] = useState(false)



  // socket
  // const socket = io("http://localhost:4009")


  const handleSubmit = async (e) => {
    e.preventDefault();

    setshowProgress(true)

    // validate form inputs
    if (!item || !price || !category) {
      console.log('Please fill all required fields');
      return;
    }

    const homeid = Cookies.get('homeid')
    if (!homeid) {
      return console.log('no home selected')
    }

    const userid = Cookies.get('userId')
    if (!userid) {
      return console.log('not logged in')
    }

    // create new expense object
    const expense = {
      homeid,
      userid,
      item,
      price: Number(price),
      description,
      category,
    };

    if (sharedBy) {
      expense.sharing = { user: sharedBy, share: Number(share) }
    }

    console.log('to add ex[ense', expense)

    socket.emit('addexpense', expense, homeid);

    socket.on('addedexpense', (data) => {
      setshowProgress(false)
      console.log('new expense from socket', data)
      sessionStorage.setItem(`homeexpenses-${data.homeid}`, JSON.stringify(data.home));
      sessionStorage.setItem('userexpenses', JSON.stringify(data.user));
      setcurrentExpenses(data.home)
      setuserExpenses(data.user)

      
      setshowAlert(true)
      setalertMessage('New Expense added successfully')
      setalertSeverity('success')

      setItem('');
      setPrice('');
      setDescription('');
      setCategory('misc');
      setSharedBy('');
      setShare('');
    })

    // try {
    //   const response = await fetch(BACKEND + '/addexpense', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(expense),
    //   });

    //   const data = await response.json();

    //   if (data.status === 201) {
    //     console.log(data);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }

    // submit the form
    // onSubmit(expense);

    // reset form inputs
    // setItem('');
    // setPrice('');
    // setDescription('');
    // setCategory('misc');
    // setSharedBy('');
    // setShare('');
  };


  return (
    <form onSubmit={handleSubmit} className={`${theme.boxbg} max-w-sm mx-auto mt-8`}>
      <div className="mb-4">
        <label htmlFor="item" className={`block ${theme.primaryTextColor} font-bold mb-2`}>
          Item <span className='text-red-700'>*</span>
        </label>
        <input
          type="text"
          id="item"
          required
          className={` ${theme.boxbg} ${theme.secondaryTextColor} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className={`block ${theme.primaryTextColor} font-bold mb-2`}>
          Price <span className='text-red-700'>*</span>
        </label>
        <input
          type="number"
          id="price"
          required
          className={` ${theme.boxbg} ${theme.secondaryTextColor} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className={`block ${theme.primaryTextColor} font-bold mb-2`}>
          Description
        </label>
        <textarea
          id="description"
          className={` ${theme.boxbg} ${theme.secondaryTextColor} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className={`block ${theme.primaryTextColor} font-bold mb-2`}>
          Category <span className='text-red-700'>*</span>
        </label>
        <select
          id="category"
          required
          className={` ${theme.boxbg} ${theme.secondaryTextColor} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="travel">Travel</option>
          <option value="food">Food</option>
          <option value="misc">Misc</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="sharedBy" className={`block ${theme.primaryTextColor} font-bold mb-2`}>
          Shared by
        </label>
        <select
          id="sharedBy"
          className={` ${theme.boxbg} ${theme.secondaryTextColor} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
          value={sharedBy}
          onChange={(e) => setSharedBy(e.target.value)}
        >
          <option value="">-- Select a member --</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="share" className={`block ${theme.primaryTextColor} font-bold mb-2`}>
          Amount shared
        </label>
        <input
          type="number"
          id="share"
          placeholder='only if shared by'
          className={` ${theme.boxbg} ${theme.secondaryTextColor} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
          value={share}
          onChange={(e) => setShare(e.target.value)}
        />
      </div>

      {showalert && <div className='my-1'><Alert severity={alertseverity} onClose={() => { setshowAlert(false) }}>{alertmessage}</Alert></div>}
      <div className={`bg-blue-500 hover:${theme.accentColor} text-white font-bold flex justify-center mt-3 w-1/2 mx-auto rounded`}>
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
            Add Expense
          </button>}
      </div>




    </form>
  );
};

export default ExpenseForm;
