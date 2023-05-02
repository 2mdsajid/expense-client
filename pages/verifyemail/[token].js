import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

import { BACKEND } from '@/components/constant';


function Token() {
  const router = useRouter();
  const token = router.query.token;

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState()
  const [successmsg, setsuccessMsg] = useState()

  const handleVerifyEmail = async (token) => {
    setIsLoading(true);


    try {
      const response = await fetch(BACKEND + '/verifyemail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json()
      console.log(data)

      if (data.status === 200) {
        // do something with the response
        console.log(data);
        setUser(data.user)
        setsuccessMsg(data.message)

        setTimeout(() => {
          router.push({
            pathname: '/dashboard',
            query: { userId: data.user._id },
          }, '/dashboard', // "as" argument
          )
        }, 3000);


      } else {
        throw new Error('Failed to verify email');
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // console.log('token in use effect', token)
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]); // Call only once when the component mounts

  return (
    <div class="flex justify-center items-center h-screen">
      <div class="w-96 bg-gray-100 rounded-lg p-8 flex flex-col justify-center items-center">
        <h2 class="text-2xl font-semibold mb-6">Please wait while we verify your email address...</h2>
        <div class="mb-6">
          {isLoading ? <CircularProgress className="text-blue-500" /> : <>{successmsg}</>}
        </div>
        <p class="text-lg text-center">Thank you for using Home Split. You will be redirected shortly.</p>
      </div>
    </div>

  );
}

export default Token;
