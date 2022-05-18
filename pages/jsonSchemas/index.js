import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import * as Icons from '/components/Icons';

export default function JsonSchemas(props) {
  const appContext = useAppContext();
  const [jsonSchemas, setJsonSchemas] = React.useState();
  
  React.useEffect(() => {
    const fetchData = async ()=>{
      setJsonSchemas(await appContext.fetcher.get("/api/jsonSchemas"));
    };
    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Schemas</div>
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <th width="200px">Name</th>
            <th width="100px"></th>
          </tr>
          </thead>
          <tbody>
          {jsonSchemas && jsonSchemas.map((j)=>
            <tr key={j.id}>
              <td><Link href={`/jsonSchemas/${j.id}`}>{j.name}</Link></td>
              <td>                          
                <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                  let res = await appContext.fetcher.delete(`/api/jsonSchemas/${j.id}`);
                  if(res.status === 200){
                    setJsonSchemas(await appContext.fetcher.get("/api/jsonSchemas"));
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
            <td>
              <Link href="/jsonSchemas/new" passHref>
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
