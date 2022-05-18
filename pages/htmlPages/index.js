import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import * as Icons from '/components/Icons';
import Image from 'next/image';

export default function HtmlPages(props) {
  const appContext = useAppContext();
  const [htmlPages, setHtmlPages] = React.useState();
  
  React.useEffect(() => {
    const fetchData = async ()=>{
      setHtmlPages(await appContext.fetcher.get("/api/htmlPages"));
    };
    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Pages</div>
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <th width="50px"></th>
            <th width="200px">Title</th>
            <th width="100px"></th>
          </tr>
          </thead>
          <tbody>
          {htmlPages && htmlPages.map((hp)=>
            <tr key={hp.id}>
              <td>{hp.image && <Image width={70} height={35} objectFit="contain" src={hp.image} alt="htmlImage"/>}</td>
              <td><Link href={`/htmlPages/${hp.id}`}>{hp.title}</Link></td>
              <td>                          
                <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                  let res = await appContext.fetcher.delete(`/api/htmlPages/${hp.id}`);
                  if(res.status === 200){
                    setHtmlPages(await appContext.fetcher.get("/api/htmlPages"));
                  }
                  else{
                    appContext.setError("Can't delete!");
                  }
                }}><Icons.Delete/></div>
              </td>
            </tr>
          )}
          <tr>
            <td></td>
            <td></td>
            <td>
              <Link href="/htmlPages/new" passHref>
                <div className={appContext.styles.addButton}><Icons.Add/></div>
              </Link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
