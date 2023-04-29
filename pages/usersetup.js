import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

function Usersetup() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const { tologin } = router.query;
        if (tologin) {
            console.log(router.query)
            setShowLoginForm(tologin === 'true');
        }
    }, [router.query]);

    return (
        <div>
            {showLoginForm ? <LoginForm useremail={router.query.email} /> : <SignupForm username={router.query.name} useremail={router.query.email} userhomeid={router.query.homeid} />}
        </div>
    );
}

export default Usersetup;
