import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

import { BACKEND } from '@/components/constant';

import Cookies from 'js-cookie'


function Token() {
    const router = useRouter();
    const token = router.query.token;

    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({})
    const [successmsg, setsuccessMsg] = useState()

    const handleVerifyEmail = async (token) => {
        setIsLoading(true)

        try {
            const response = await fetch(BACKEND + '/verifyinvitedusers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await response.json()
            //   console.log(data)

            if (data.status === 201) {
                // do something with the response
                console.log(data);
                setUser(data.inviteduser)

                console.log(data.inviteduser)
                setsuccessMsg(data.message)

                if (data.existinguser) {
                    const loginToken = Cookies.get('logintoken');
                    if (loginToken) {
                        const userId = Cookies.get('userId');
                        if (userId) {
                            console.log('user logged in')
                            router.push({
                                pathname: '/dashboard',
                                query: { userId: userId },
                            }, '/dashboard',)
                        }
                    } else {
                        console.log('user not logged in')
                        router.push({
                            pathname: '/usersetup',
                            query: {
                                tologin: true,
                                email: data.inviteduser.email
                            },
                        }, '/login',)
                    }
                } else if (data.existinguser === false) {
                    console.log('new user')
                    router.push({
                        pathname: '/usersetup',
                        query: {
                            tologin: false,
                            name: data.inviteduser.name,
                            email: data.inviteduser.email,
                            homeid: data.inviteduser.homeid
                        },
                    }, '/signup',)
                }

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
