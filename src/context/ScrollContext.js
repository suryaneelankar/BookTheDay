import React, {createContext, useContext, useState} from 'react';

const ScrollContext = createContext({
  isTabBarVisible: true,
  setTabBarVisible: () => {},
});

export const ScrollProvider = ({children}) => {
  const [isTabBarVisible, setTabBarVisible] = useState(true);

  return (
    <ScrollContext.Provider value={{isTabBarVisible, setTabBarVisible}}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
