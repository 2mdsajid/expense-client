import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../components/ThemeProvider'

import SignUpForm from '@/components/SignupForm'
import LoginForm from '@/components/LoginForm'
import { useRouter } from 'next/router';


function Index() {
  const router = useRouter();

  const { isDark, toggleTheme, theme } = useContext(ThemeContext)
  // const [name,setName] = useState('')
  // const [email,setEmail]

  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleToggleForm = () => {
    setShowLoginForm(!showLoginForm);
  }

  const onSubmit = (event, values) => {
    event.preventDefault()
    console.log('submittted')
    console.log(values)
  }

  useEffect(() => {
    console.log('id', theme)
  }, [isDark])


  return (
    <div className={`min-h-screen w-screen ${theme.backgroundColor} ${theme.primaryTextColor} flex md:items-center justify-center pb-10`}>
      <div className={` w-[90%] md:w-4/5 xl:w-2/3 h-fit flex flex-col md:flex-row border-black`}>
        <div className='intro flex justify-center items-center md:justify-start mt-[2.5rem] md:mt-0 p-1 w-full md:w-1/2 border-green-400 '>
          <div className='text-center'>
            <h1 className="text-4xl font-bold mb-4">Welcome to Home Splitter</h1>
            <p className="text-xl mb-8">We assure perfect security and proper analysis of your data</p>
          </div>
        </div>
        <div className={`w-full sm:w-4/5 mx-auto md:w-1/2 p-4 ${theme.boxbg} rounded-lg shadow-lg`}>
          {showLoginForm ? (
            <>
              <LoginForm />
              <p className="mt-4 text-gray-500 text-center">
                Not registered yet?{' '}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={handleToggleForm}
                >
                  Create an account
                </button>
              </p>
            </>
          ) : (
            <>
              <SignUpForm onSubmit={() => onSubmit} />
              <p className="mt-4 text-gray-500 text-center">
                Already have an account?{' '}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={handleToggleForm}
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>

  );
}

export default Index
