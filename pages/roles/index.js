import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import * as Icons from '/components/Icons';

export default function Roles(props) {
  const appContext = useAppContext();
  const [roles, setRoles] = React.useState();
  
  React.useEffect(() => {
    const fetchData = async ()=>{
      setRoles(await appContext.fetcher.get("/api/roles"));
    };
    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Roles</div>
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <th width="200px">Name</th>
            <th width="400px">Permissions</th>
            <th width="100px"></th>
          </tr>
          </thead>
          <tbody>
          {roles && roles.map((r)=>
            <tr key={r.id}>
              <td><Link href={`/roles/${r.id}`}>{r.name}</Link></td>
              <td>
                {r.permissions && r.permissions.map((p)=>{
                  return(<span key={p.id}>{p.method} {p.model} | </span>);
                })}
              </td>
              <td>                          
                <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                  let res = await appContext.fetcher.delete(`/api/roles/${r.id}`);
                  if(res.status === 200){
                    setRoles(await appContext.fetcher.get("/api/roles"));
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
              <Link href="/roles/new" passHref>
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
