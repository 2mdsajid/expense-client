import { useState, useContext, ChangeEvent, useEffect } from 'react';

import { Alert, AlertColor } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { ThemeContext } from './ThemeProvider';

import { BACKEND } from './constant';

import Cookies from 'js-cookie';

import { useRouter } from 'next/router'


const SignUpForm = ({ onSubmit, username, useremail, userhomeid }) => {

  const router = useRouter();
  const { isDark, toggleTheme, theme } = useContext(ThemeContext)

  // dialogue box for messages
  const [alertseverity, setalertSeverity] = useState('warning');
  const [alertmessage, setalertMessage] = useState('Please provide an authentic email');
  const [showalert, setshowAlert] = useState(false)
  const [showprogress, setshowProgress] = useState(false)

  const [signupsuccessfull, setsignupSuccessfull] = useState(false)

  const [values, setValues] = useState({
    name: username || "",
    email: useremail || "",
    password: '',
    confirmPassword: '',
    image: null,
    homeid: userhomeid || null
  });

  // handle submit- handling by formik
  const handleSubmit = async (event) => {
    event.preventDefault();

    setshowProgress(true)

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);

    if (values.image) {
      formData.append('avatar', values.image);
    }

    if (userhomeid) {
      formData.append('homeid', values.homeid);
    }

    console.log(values)

    try {
      const response = await fetch(BACKEND + '/signup', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setshowAlert(true)
      setalertMessage(data.message)
      setshowProgress(false)

      if (data.status === 201) {
        console.log(data);

        setalertSeverity('success')
        setsignupSuccessfull(true)
        Cookies.set('logintoken', data.user.logintoken);
        Cookies.set('userId', data.user._id);

        return

        router.push({
          pathname: '/dashboard',
          query: { userId: data.user._id },
        }, '/dashboard', // "as" argument
        )
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

  // useEffect(() => {
  //   console.log('userid in signup from cookies', Cookies.get('userId'))
  // }, [])


  return (
    <>
      <form onSubmit={handleSubmit} className="{{theme.backgroundColor}} h-fit w-full rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <div className="mb-4">
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${theme.boxbg}  ${theme.primaryTextColor}`}
            placeholder="Name"
            required
            minLength="3"
          />
          {values.name.length > 0 && <p className="text-red-500">{values.name.length < 3 && 'Name must be at least 3 characters long'}</p>}
        </div>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={(event) => setValues({ ...values, email: event.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${theme.boxbg} ${theme.primaryTextColor}`}
            placeholder="Email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
          {values.email.length > 0 && <p className="text-red-500">{!values.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) && 'Please enter a valid email'}</p>}
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={(event) => setValues({ ...values, password: event.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${theme.boxbg} ${theme.primaryTextColor}`}
            placeholder="Password"
            required
            minLength="8"
          />
          {values.password.length > 0 && <p className="text-red-500">{values.password.length < 8 && 'Password must be at least 8 characters long'}</p>}
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${theme.boxbg} ${theme.primaryTextColor}`}
            placeholder="Confirm Password"
            required
            pattern={values.password}
          />
          {values.confirmPassword.length > 0 && <p className="text-red-500">{values.confirmPassword !== values.password && 'Passwords do not match'}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="image" className={`block font-medium ${theme.primaryTextColor} mb-1`}>
            Profile Pic
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) {
                setValues({
                  ...values,
                  image: event.target.files[0],
                });
              }
            }}
            className="hidden"
          />
          <div className={`relative rounded-lg border-dashed border-2 border-gray-300 ${theme.boxbg}  ${theme.primaryTextColor} flex justify-center items-center`}>
            {values.image ? (
              <>
                <img src={URL.createObjectURL(values.image)} alt="Selected file" className="rounded-lg w-[10rem] md:hidden" />
                <p className='hidden md:block'>{values.image.name}</p>
              </>
            ) : (
              <span className="">Click to select an image</span>
            )}
            <label htmlFor="image" className="text-gray-500 absolute top-0 left-0 w-full h-full cursor-pointer">

            </label>
          </div>
          <p className="text-red-500 mt-1">
            {values.image && !values.image.type.match("image.*") && "Only image files are allowed"}
          </p>
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
              Sign Up
            </button>}
        </div>
      </form>

      {signupsuccessfull &&
        <div className={`fixed top-0 left-0 w-full h-full overflow-auto ${theme.backgroundColor}  bg-opacity-[1] z-50 flex items-center justify-center`}>
          <div className={`${theme.boxbg} rounded-lg w-[90%] md:w-1/3 lg:w-1/4 px-4 py-6`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Signup Successful</h2>
              <p className={`${theme.secondaryTextColor} mb-6`}>Please click the link sent to your mail to confirm your account.</p>
            </div>
            <div className="flex justify-center mt-6">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => router.push('/dashboard')}>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      }

    </>


  );
};

export default SignUpForm;
