import { AppProps } from "next/app";
import darkModeContext from '../components/darkModeContext';
import userContext from "../components/userContext";
import { useState } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({username: "", email: "", token: "", imageUrl: ""});

  return (
    <darkModeContext.Provider value={{darkMode,setDarkMode}}>
      <userContext.Provider value={{user,setUser}}>
      <Component {...pageProps} />
      </userContext.Provider>
    </darkModeContext.Provider>
  );
};

export default App;
