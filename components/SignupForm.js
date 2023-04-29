import { useState, useContext, ChangeEvent, useEffect } from 'react';

// 
import { useFormik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
  const [alertSeverity, setAlertSeverity] = useState();
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // formik initial values
  // const initialValues: SignupFormValues = {
  //   name: '',
  //   email: '',
  //   password: '',
  //   confirmPassword: '',
  // };

  const [values, setValues] = useState({
    name: username || "",
    email: useremail || "",
    password: '',
    confirmPassword: '',
    image: null,
    homeid:userhomeid || null
  });


  // YUP form validation
  // const validationSchema = Yup.object().shape({
  //   name: Yup.string().required('Name is required'),
  //   email: Yup.string().email('Invalid email').required('Email is required'),
  //   password: Yup.string().required('Password is required'),
  //   confirmPassword: Yup.string()
  //     .required('Confirm Password is required')
  //     .oneOf([Yup.ref('password')], 'Passwords do not match'),
  // });

  // handle submit- handling by formik
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (values.password !== values.confirmPassword) {

      setAlertSeverity('error');
      setAlertMessage("Passwords don't match!");
      setIsAlertOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);

    if (values.image) {
      formData.append('avatar', values.image);
    }

    if (userhomeid) {
      console.log('iddddd', userhomeid)
      formData.append('homeid', values.homeid);
    }

    console.log(values)

    try {
      const response = await fetch(BACKEND + '/signup', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.status === 201) {
        console.log(data);
        Cookies.set('logintoken', data.user.logintoken);
        Cookies.set('userId', data.user._id);

        router.push({
          pathname: '/dashboard',
          query: { userId: data.user._id },
        }, '/dashboard', // "as" argument
        )
      }
    } catch (error) {
      console.error(error);
    }

  };

  // const Formik = useFormik({
  //   initialValues={ initialValues }
  //   // validationSchema={ validationSchema }
  //   onSubmit:(values)=>{

  //   }
  // })


  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log({ name, email, password, confirmPassword });
  //   // do something with the form data, such as sending it to a server
  // };

  useEffect(() => {
    console.log('userid in signup from cookies',Cookies.get('userId'))
  }, [])


  return (
    // <Formik
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    //   onSubmit={handleSubmit}
    // >
    // {({errors,values,handleChange})=>(
      <form onSubmit={handleSubmit} className="{{theme.backgroundColor}} h-fit w-full rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block font-medium text-gray-500 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block font-medium text-gray-500 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={(event) => setValues({ ...values, email: event.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block font-medium text-gray-500 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={(event) => setValues({ ...values, password: event.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block font-medium text-gray-500 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block font-medium text-gray-500 mb-1">
          Image
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
        <div className="relative rounded-lg border-dashed border-2 border-gray-300 bg-gray-50 flex justify-center items-center">
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
      </div>

      <button
        type="submit"
        className={`bg-blue-500 hover:${theme.accentColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
      >
        Sign Up
      </button>
    </form>
    // )}
    // </Formik>
  );
};

export default SignUpForm;
