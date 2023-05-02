import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie'

import { BACKEND } from '../constant';

import io from 'socket.io-client';

import { ThemeContext } from '../ThemeProvider';

const ExpenseForm = ({ setcurrentExpenses, setuserExpenses, socket, handleCloseDialog, members }) => {
  const { isDark, toggleTheme, theme } = useContext(ThemeContext);

  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('misc');
  const [sharedBy, setSharedBy] = useState('');
  const [share, setShare] = useState('');

  // socket
  // const socket = io("http://localhost:4009")


  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log('new expense from socket', data)
      sessionStorage.setItem(`homeexpenses-${data.homeid}`, JSON.stringify(data.home));
      sessionStorage.setItem('userexpenses', JSON.stringify(data.user));
      setcurrentExpenses(data.home)
      setuserExpenses(data.user)

      setItem('');
      setPrice('');
      setDescription('');
      setCategory('misc');
      setSharedBy('');
      setShare('');

      // console.log("🚀 ~ file: ExpenseForm.js:66 ~ socket.on ~ data.user:", data.user)
      // console.log("🚀 ~ file: ExpenseForm.js:66 ~ socket.on ~ setuserExpenses:", setuserExpenses)
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
          Item
        </label>
        <input
          type="text"
          id="item"
          className={` ${theme.boxbg} ${theme.secondaryTextColor} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className={`block ${theme.primaryTextColor} font-bold mb-2`}>
          Price
        </label>
        <input
          type="number"
          id="price"
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
          Category
        </label>
        <select
          id="category"
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

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 transition-colors duration-300 ease-in-out">
          Add Expense
        </button>
      </div>


    </form>
  );
};

export default ExpenseForm;
