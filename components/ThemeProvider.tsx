import React, { createContext, useState } from 'react';

type ThemeContextType = {
    isDark: boolean;
    toggleTheme: () => void;
    theme: {
        backgroundColor: string;
        boxbg:string;
        primaryTextColor: string;
        secondaryTextColor: string;
        primaryColor: string;
        accentColor: string;

    }
};

type ThemeProviderProps = {
    children: React.ReactNode;
};

const lightTheme = {
    backgroundColor: 'bg-gray-100',
    boxbg: 'bg-white',
    primaryTextColor: 'text-gray-900',
    secondaryTextColor: 'text-gray-500',
    primaryColor: 'bg-blue-500',
    accentColor: 'teal-500',
    primaryIcon : 'bg-gray-300',
    hoverIcon :'bg-gray-500',
    primaryBtn:'bg-blue-500',
    hoverBtn:'bg-blue-700'
  };
  
  const darkTheme = {
    backgroundColor: 'bg-gray-900',
    boxbg: 'bg-gray-800',
    primaryTextColor: 'text-white',
    secondaryTextColor: 'text-gray-400',
    primaryColor: 'bg-green-500',
    accentColor: 'purple-500',
    primaryIcon : 'bg-gray-500',
    hoverIcon :'bg-gray-700',
    primaryBtn:'bg-blue-500',
    hoverBtn:'bg-blue-700'
  };
  
  

export const ThemeContext = createContext<ThemeContextType>({
    isDark: true,
    toggleTheme: () => { },
    theme: lightTheme,
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isDark, setIsDark] = useState<boolean>(true);

    // if (typeof window !== 'undefined') {
    //     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    //     setIsDark(mediaQuery.matches ? true : false)
    //     // Access the window object here
    //   }
    const toggleTheme = () => {
        setIsDark((prev) => !prev);
        console.log('mode changed',isDark)
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
            <div className={`bg-${theme.backgroundColor} text-${theme.primaryTextColor}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};


