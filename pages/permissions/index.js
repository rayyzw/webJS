import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import * as Icons from '/components/Icons';

export default function Permissions(props) {
  const appContext = useAppContext();
  const [permissions, setPermissions] = React.useState();
  const [permission, setPermission] = React.useState({});
  const models = ["User","Role","Permission","JsonSchema","JsonData","HtmlPage","Category"];
  const methods = ["GET","PUT","PATCH","POST","DELETE"];
  
  React.useEffect(() => {
    const fetchData = async ()=>{
      setPermissions(await appContext.fetcher.get("/api/permissions"));
    };

    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Permissions</div>
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <th width="200px">Method</th>
            <th width="200px">Model</th>
            <th width="100px"></th>
          </tr>
          </thead>
          <tbody>
          {permissions && permissions.map((p)=>
            <tr key={p.id}>
              <td>{p.method}</td>
              <td>{p.model}</td>
              <td>
                <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                  let res = await appContext.fetcher.delete(`/api/permissions/${p.id}`);
                  if(res.status === 200){
                    setPermissions(await appContext.fetcher.get("/api/permissions"));
                  }
                  else{
                    appContext.setError("Can't delete!");
                  }
                }}><Icons.Delete/></div>
              </td>
            </tr>
          )}
          <tr>
            <td>          
              <select placeholder="Method" value={permission.method || ""} onChange={(e)=>{setPermission({...permission,method:e.target.value});}}>
                <option value="">Select Method</option>
                {methods.map((m)=>(
                  <option key={m} value={m}>{m}</option>
                ))}
              </select> 
            </td>
            <td>            
              <select placeholder="Model" value={permission.model || ""} onChange={(e)=>{setPermission({...permission,model:e.target.value});}}>
                <option value="">Select Model</option>
                {models.map((m)=>(
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </td>
            <td>            
              <div className={(permission.method && permission.model) ? appContext.styles.addButton : appContext.styles.disabledButton} onClick={async ()=>{
                if(permission.method && permission.model)
                {
                  let res1 = await appContext.fetcher.post("/api/permissions", permission);
                  if (res1.status === 200) {
                    setPermissions(await appContext.fetcher.get("/api/permissions"));
                  }
                  else if(res1.status === 400){
                    let data = await res1.json();
                    appContext.setError(data.error);
                  }
                  else{
                    appContext.setError("Can't add!");
                  }
                }
              }}><Icons.Add/></div>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <button 
                style={{width:"100%"}}
                onClick={async ()=>{
                  models.map((mo)=>{
                    methods.map(async (me)=>{
                      if(!permissions.some((p)=>(p.model===mo && p.method===me))){
                        let newPermission = {"model":mo,"method":me};
                        let res2 = await appContext.fetcher.post("/api/permissions",newPermission);
                        if(res2.status === 200){
                          setPermissions(await appContext.fetcher.get("/api/permissions"));
                        }
                      }
                    });
                  });
                }}
              >Create All</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
