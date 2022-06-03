import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import * as Icons from '/components/Icons';
import Image from 'next/image';

export default function Feelings(props) {
  const appContext = useAppContext();
  const [feelings, setFeelings] = React.useState();
  
  React.useEffect(() => {
    const fetchData = async ()=>{
      setFeelings(await appContext.fetcher.get("/api/feelings"));
    };
    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Feelings</div>
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <th width="100px">Time</th>
            <th width="100px">Purpose</th>
            <th width="100px">Thinking</th>
            <th width="100px">Energy</th>
            <th width="100px">Environment</th>
            <th width="100px">Physical</th>
            <th width="100px">Moving</th>
            <th width="100px"></th>
          </tr>
          </thead>
          <tbody>
          {feelings && feelings.map((f)=>
            <tr key={f.id}>
              <td><Link href={`/feelings/${f.id}`}>{new Date(f.createdAt).toLocaleDateString()}</Link></td>
              <td><Link href={`/feelings/${f.id}`}>{String(f.purpose)}</Link></td>
              <td><Link href={`/feelings/${f.id}`}>{String(f.thinking)}</Link></td>
              <td><Link href={`/feelings/${f.id}`}>{String(f.energy)}</Link></td>
              <td><Link href={`/feelings/${f.id}`}>{String(f.environment)}</Link></td>
              <td><Link href={`/feelings/${f.id}`}>{String(f.physical)}</Link></td>
              <td><Link href={`/feelings/${f.id}`}>{String(f.moving)}</Link></td>
              <td>                          
                <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                  let res = await appContext.fetcher.delete(`/api/feelings/${f.id}`);
                  if(res.status === 200){
                    setFeelings(await appContext.fetcher.get("/api/feelings"));
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
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <Link href="/feelings/new" passHref>
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
