import React from 'react';
import '/styles/globals.css';
import { AppWrapper } from '/components/Context';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Head>
        <title>LinkPoint</title>
        <meta name="description" content="LinkPoint" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps}/>
    </AppWrapper>
  );
}

export default MyApp;
