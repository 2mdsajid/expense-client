import '@/styles/globals.css'
import type { AppProps } from 'next/app'
// import { ThemeProvider } from 'next-themes';
import {ThemeProvider} from '@/components/ThemeProvider';
// import { ThemeContext } from '@/components/themes';

import  Context  from '../components/Context'

type ThemeType = {
  backgroundColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  primaryColor: string;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider >
        <Component {...pageProps} />
    </ThemeProvider>
  );
}
