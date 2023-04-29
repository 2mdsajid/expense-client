import React, { createContext, useState,useEffect } from 'react';

type ContextType = {
  randomfun: () => void;
  astate: string
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const data = createContext<ContextType>({
  randomfun: () => { },
  astate: 'dark'
});


const Context = ({ children }: ThemeProviderProps) => {
  const [astate, setaState] = useState<string>('dark')

  const randomfun = (): void => {
    setaState(astate === 'dark' ? 'light' : 'dark')
    console.log(astate)
  };

  useEffect(() => {
    console.log(astate);
  }, [astate]);

  return (
    <data.Provider value={{ randomfun, astate }}>
      <div>{children}</div>
    </data.Provider>
  )
}

export default Context

