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
  };
  
  const darkTheme = {
    backgroundColor: 'bg-gray-900',
    boxbg: 'bg-gray-800',
    primaryTextColor: 'text-white',
    secondaryTextColor: 'text-gray-400',
    primaryColor: 'bg-green-500',
    accentColor: 'purple-500',
  };
  
  

export const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
    theme: lightTheme,
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isDark, setIsDark] = useState<boolean>(false);

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
        console.log('tp',isDark)
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


