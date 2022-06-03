import React from 'react';
import Fetcher from '/components/Fetcher';
import lightStyles from '/styles/Light.module.css';
import darkStyles from '/styles/Dark.module.css';
import warmStyles from '/styles/Warm.module.css';
import traditionalStyles from '/styles/Traditional.module.css';

const AppContext = React.createContext();

export function AppWrapper({ children }) {
	const [user, setUser] = React.useState();
	const [message, setMessage] = React.useState();
	const [error, setError] = React.useState();
	const [fetcher, setFetcher] = React.useState();
  const [styles, setStyles] = React.useState(lightStyles);
	const [theme, setTheme] = React.useState();

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(localStorage.getItem("userToken")){
        let fetcher1 = new Fetcher(localStorage.getItem("userToken"));
        let data = await fetcher1.get("/api/users/profile");
        if(data){
          setUser(data);
        }
        else{
          setUser({});
        }
      }
      else{
        setUser({});
      }

      setTheme(localStorage.getItem("theme"));
      if(localStorage.getItem("theme")==="Dark"){
        setStyles(darkStyles);
      }
      else if(localStorage.getItem("theme")==="Light"){
        setStyles(lightStyles);
      }
      else if(localStorage.getItem("theme")==="Warm"){
        setStyles(warmStyles);
      }
      else if(localStorage.getItem("theme")==="Traditional"){
        setStyles(traditionalStyles);
      }
      else{
        setStyles(lightStyles);
      }
    };

    fetchData();
    
  }, []);

  React.useEffect(() => {
    if(message){      
      const messageTimeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(messageTimeout);
    }
  }, [message]);

  React.useEffect(() => {
    if(error){      
      const errorTimeout = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(errorTimeout);
    }
  }, [error]);

  React.useEffect(() => {
    if(user){
      localStorage.setItem("userToken",user.token);
      setFetcher(new Fetcher(user.token));
    }
  }, [user]);

  React.useEffect(() => {
    if(theme){
      localStorage.setItem("theme",theme);
    }
  }, [theme]);

  return (
    <AppContext.Provider 
      value={{
        "user":user, 
        "setUser":setUser,
        "message":message,
        "setMessage":setMessage,
        "error":error,
        "setError":setError,
        "fetcher":fetcher,
        "styles":styles,
        "theme":theme,
        "setTheme":setTheme,
      }}
    >
      {user && fetcher && children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return React.useContext(AppContext);
};
