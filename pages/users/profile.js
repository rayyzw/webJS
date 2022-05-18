import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import { useRouter } from "next/router";
import Image from 'next/image';

export default function User(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [user, setUser] = React.useState();
  const [roles, setRoles] = React.useState();
  const reader = new FileReader();
  reader.onloadend  = () => {
    setUser({
      ...user,
      photo: reader.result
    });
  };

  React.useEffect(() => {
    const fetchData = async ()=>{
      let data = await appContext.fetcher.get("/api/users/profile");
      if(data){
        data.disconnectRoles = [];
        setUser(data);
        setRoles(await appContext.fetcher.get("/api/roles"));
      }
    }
    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Profile</div>
      {user && 
        <div className={appContext.styles.tableContainer}>
          <table>
            <tbody>
            <tr>
              <td width="100px">Name</td>
              <td width="400px"><input value={user.name || ""} onChange={(e)=>{setUser({...user,name:e.target.value});}}/></td>
            </tr>
            <tr>
              <td>Photo</td>
              <td>
                {user && user.photo && <div><Image width={50} height={50} objectFit="contain" src={user.photo} alt="photo"/></div>}
                <input type="file" accept="image/png, image/gif, image/jpeg" onChange={async (e)=>{
                  reader.readAsDataURL(e.target.files[0]);
                }}/>
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td><input value={user.email || ""} onChange={(e)=>{setUser({...user,email:e.target.value});}}/></td>
            </tr>
            <tr>
              <td>Theme</td>
              <td>
                <input 
                    type="checkbox"
                    checked={appContext.theme==="Light"}
                    onChange={(e)=>{
                        if(e.target.checked){
                            appContext.setTheme("Light");
                            router.reload();
                        }
                    }}
                />Light &nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                    type="checkbox"
                    checked={appContext.theme==="Warm"}
                    onChange={(e)=>{
                        if(e.target.checked){
                            appContext.setTheme("Warm");
                            router.reload();
                        }
                    }}
                />Warm &nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                    type="checkbox"
                    checked={appContext.theme==="Traditional"}
                    onChange={(e)=>{
                        if(e.target.checked){
                            appContext.setTheme("Traditional");
                            router.reload();
                        }
                    }}
                />Traditional &nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                    type="checkbox"
                    checked={appContext.theme==="Dark"}
                    onChange={(e)=>{
                        if(e.target.checked){
                            appContext.setTheme("Dark");
                            router.reload();
                        }
                    }}
                />Dark
              </td>
            </tr>
            <tr>
              <td>Version</td>
              <td>1.0</td>
            </tr>
            <tr>
              <td></td>
              <td>              
              <button onClick={async ()=>{
                let res = await appContext.fetcher.put("/api/users/profile",user);
                if(res.status === 200){
                  appContext.setUser(user);
                  appContext.setMessage("Saved!");
                }
                else{
                  appContext.setError("Can't save!");
                }
              }}>Save</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      }
    </Layout>
  );
};
