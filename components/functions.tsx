import localForage from 'localforage';
// import { useNavigate } from 'react-router-dom';

export function formatDate(dateString:string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
}

export function validateEmail(email:string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password:string) {
  const passwordRegex = /^.{8,}$/
  return passwordRegex.test(password)
}

export interface User {
    _id: string;
    avatar: string;
    email: string;
    homes: any[]; // replace "any" with the correct type
    name: string;
    password: string;
    status: string;
    verification: {
        expiresAt: string;
        isVerified: boolean;
    }
}
