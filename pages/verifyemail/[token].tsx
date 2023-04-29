import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

import { BACKEND } from '@/components/constant';

interface User {
  avatar: string;
  email: string;
  homes: any[]; // replace "any" with the correct type
  loginTokens: any[]; // replace "any" with the correct type
  name: string;
  password: string;
  status: string;
  verification: {
    expiresAt: string;
    isVerified: boolean;
    token: string;
  }
}


function Token() {
  const router = useRouter();
  const token = router.query.token;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>()
  const [successmsg, setsuccessMsg] = useState<string>()

  const handleVerifyEmail = async (token: string | string[] | undefined) => {
    setIsLoading(true);

    console.log(token);

    console.log('init handle');

    try {
      const response = await fetch(BACKEND + '/verifyemail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json()

      if (data.status === 200) {
        // do something with the response
        console.log(data);
        setUser(data.user)
        setsuccessMsg(data.message)

        router.push({
          pathname: '/dashboard',
          query: { userId: data.user._id },
        }, '/dashboard', // "as" argument
        )


      } else {
        throw new Error('Failed to verify email');
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    console.log('token in use effect', token)
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]); // Call only once when the component mounts

  return (
    <div>
      {isLoading ? <CircularProgress /> : <>{successmsg}</>}
    </div>
  );
}

export default Token;
