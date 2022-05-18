import React from 'react';
import { useAppContext } from '/components/Context';

export default function Logout() {
  const appContext = useAppContext();

  React.useEffect(() => {
    appContext.setUser({});
    window.location = "/login";
  },[appContext]);

  return (
    <div className={appContext.styles.centeredContainer}>
      Loging Out ...
    </div>
  )
}
