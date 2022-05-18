import React from 'react';
import Layout from '/components/Layout';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';

export default function Role(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [role, setRole] = React.useState();
  const [permissions, setPermissions] = React.useState();
  const id = router.query.id;

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(id==="new"){
        setRole({disconnectPermissions:[]});
      }
      else{
        let data = await appContext.fetcher.get(`/api/roles/${id}`);
        if(data){
          data.disconnectPermissions = [];
          setRole(data);
        }
      }
      setPermissions(await appContext.fetcher.get("/api/permissions"));
    };
    
    fetchData();
  }, [id, appContext.fetcher]);
  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Role</div>
      {role && 
        <div className={appContext.styles.tableContainer}>
          <table>
            <tbody>
            <tr>
              <td width="100px">Name</td>
              <td width="200px"><input value={role.name || ""} onChange={(e)=>{setRole({...role,name:e.target.value});}}/></td>
            </tr>
            <tr>
              <td>Permissions</td>
              <td>                
                {permissions && permissions.map((p)=>(
                  <div key={p.id}>
                    <input 
                      type="checkbox" 
                      checked={role.permissions && role.permissions.some((rp)=>(rp.id===p.id))}
                      onChange={()=>{
                        if(role.permissions && role.permissions.some((rp)=>(rp.id===p.id))){
                          let newPermissions = role.permissions.filter((rp)=>(rp.id!==p.id));
                          role.disconnectPermissions.push(p);
                          setRole({...role, permissions:newPermissions});
                        }
                        else{                         
                          let newPermissions = role.permissions;
                          if(!newPermissions) newPermissions = [];
                          newPermissions.push(p);
                          role.disconnectPermissions = role.disconnectPermissions.filter((d)=>(d.id!==p.id));
                          setRole({...role, permissions:newPermissions});
                        }
                      }}
                    /> {p.method} {p.model}
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button onClick={async ()=>{
                  if(id==="new"){
                    let res = await appContext.fetcher.post("/api/roles",role);
                    if(res.status === 200){
                      router.push("/roles");
                    }
                    else{
                      appContext.setError("Can't add!");
                    }
                  }
                  else{
                    let res1 = await appContext.fetcher.put(`/api/roles/${role.id}`,role);
                    if(res1.status === 200){
                      router.push("/roles");
                    }
                    else{
                      appContext.setError("Can't save!");
                    }
                  }
                }}>Save</button>
                <button onClick={()=>{
                  router.push("/roles");
                }}>Back</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      }
    </Layout>
  );
};
