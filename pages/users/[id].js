import React from 'react';
import Layout from '/components/Layout';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import Modal from '/components/Modal';

export default function User(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [user, setUser] = React.useState();
  const [roles, setRoles] = React.useState();
  const id = router.query.id;
  const [showPushNotification, setShowPushNotification] = React.useState(false);
  const [message, setMessage] = React.useState({
    to: '',
    sound: 'default',
    title: '',
    body: '',
  });

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(id==="new"){
        setUser({disconnectRoles:[]});
      }
      else{
        let data = await appContext.fetcher.get(`/api/users/${id}`);
        if(data){
          data.disconnectRoles = [];
          setUser(data);
        }
      }
      setRoles(await appContext.fetcher.get("/api/roles"));
    }
    fetchData();
  }, [id, appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>User</div>
      {user &&
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <td width="100px">Name</td>
            <td width="200px"><input value={user.name || ""} onChange={(e)=>{setUser({...user,name:e.target.value});}}/></td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Email</td>
            <td><input value={user.email || ""} onChange={(e)=>{setUser({...user,email:e.target.value});}}/></td>
          </tr>
          <tr>
            <td>PushToken</td>
            <td><input value={user.pushToken || ""} onChange={(e)=>{setUser({...user,pushToken:e.target.value});}}/></td>
          </tr>
          <tr>
            <td>Admin</td>
            <td><input type={"checkbox"} checked={user.isAdmin} onChange={(e)=>{setUser({...user,isAdmin:e.target.checked});}}/></td>
          </tr>
          <tr>
            <td>Roles</td>
            <td style={{borderTop:"1px solid #CCCCCC"}}>
            {roles && roles.map((r)=>{
              if(user.roles && user.roles.some((ur)=>(ur.id===r.id))){
                  return (<div key={r.id}><input type="checkbox" checked onChange={()=>{
                      let newRoles = user.roles.filter((ur)=>(ur.id!==r.id));
                      user.disconnectRoles.push(r);
                      setUser({...user, roles:newRoles});
                  }}/> {r.name} </div>);
              }
              else{
                  return (<div key={r.id}><input type="checkbox" onChange={()=>{                           
                      let newRoles = user.roles;
                      if(!newRoles) newRoles = [];
                      newRoles.push(r);
                      user.disconnectRoles = user.disconnectRoles.filter((d)=>(d.id!==r.id));
                      setUser({...user, roles:newRoles});
                  }}/> {r.name} </div>);
              }
            })}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
            <button onClick={async ()=>{
              if(id==="new"){
                let res = await appContext.fetcher.post("/api/users",user);
                if(res.status === 200){
                  router.push("/users");
                }
                else{
                  appContext.setError("Can't add!");
                }
              }
              else{
                let res1 = await appContext.fetcher.put(`/api/users/${id}`,user);
                if(res1.status === 200){
                  router.push("/users");
                }
                else{
                  appContext.setError("Can't save!");
                }
              }
            }}>Save</button>
            <button onClick={()=>{
              router.push("/users");
            }}>Back</button>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              {user.pushToken &&
                <button onClick={()=>{
                  setShowPushNotification(true);
                }}>Push Notification</button>
              }
              {showPushNotification &&
                <Modal onClick={()=>{setShowPushNotification(false);}}>
                  <h2>Push Notification</h2>
                  Title: <input placeholder='Title' value={message.title} onChange={(e)=>{setMessage({...message,title:e.target.value});}}/>
                  Body: <input placeholder='Body' value={message.body} onChange={(e)=>{setMessage({...message,body:e.target.value});}}/>
                  <button onClick={(e)=>{                    
                    message.to = user.pushToken;
                    fetch('https://exp.host/--/api/v2/push/send', {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                      },
                      mode: "no-cors",
                      body: JSON.stringify(message),
                    })
                    .then((res)=>{appContext.setMessage("Sent");})
                    .catch((e)=>{appContext.setError("Can't send");});
                    setShowPushNotification(false);
                  }}>Send</button>
                </Modal>
              }
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      }
    </Layout>
  );
};
