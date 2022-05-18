import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';

export default function Home(props) {
  const appContext = useAppContext();
  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Home</div>
      <div className={appContext.styles.tableContainer}></div>
    </Layout>
  );
};
