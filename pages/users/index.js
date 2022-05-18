import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import * as Icons from '/components/Icons';
import Image from 'next/image';
import Modal from '/components/Modal';

export default function Users(props) {
  const appContext = useAppContext();
  const [users, setUsers] = React.useState();
  const [pushTokens, setPushTokens] = React.useState([]);
  const [showPushNotification, setShowPushNotification] = React.useState(false);
  const [message, setMessage] = React.useState({
    to: '',
    sound: 'default',
    title: '',
    body: '',
  });

  React.useEffect(() => {
    const fetchData = async ()=>{ 
      setUsers(await appContext.fetcher.get("/api/users"));
    };
    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Users</div>
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <th width="100px"></th>
            <th width="200px">Name</th>
            <th width="200px">Email</th>
            <th width="200px"></th>
          </tr>
          </thead>
          <tbody>
          {users && users.map((u)=>
            <tr key={u.id}>
              <td>{u && u.photo && <Image width={50} height={50} objectFit="contain" src={u.photo} alt="photo" />}</td>
              <td><Link href={`/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.email}</td>
              <td style={{display:"flex",paddingTop:10}}>
                {u.id !== appContext.user.id && 
                  <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                    let res = await appContext.fetcher.delete(`/api/users/${u.id}`);
                    if(res.status === 200){
                      setUsers(await appContext.fetcher.get("/api/users"));
                    }
                    else{
                      appContext.setError("Can't delete!");
                    }

                  }}><Icons.Delete/></div>
                }
                {u.id === appContext.user.id && 
                  <div className={appContext.styles.disabledButton}><Icons.Delete/></div>
                }
                {u.pushToken && 
                  <input type="checkbox" onChange={(e)=>{
                    if(e.target.checked){
                      setPushTokens([...pushTokens,u.pushToken]);
                    }
                    else{
                      setPushTokens(pushTokens.filter((pt)=>(pt!==u.pushToken)));
                    }
                  }}/>
                }                
              </td>
            </tr>
          )}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td style={{display:"flex",alignItems:'center'}}>
              <Link href="/users/new" passHref>
                <div className={appContext.styles.addButton}><Icons.Add/></div>
              </Link>
              {pushTokens.length>0 &&
                <a href="#" className={appContext.styles.addButton} onClick={()=>{
                  setShowPushNotification(true);
                }}>
                  <Icons.Phone/>
                </a>
              }
              {showPushNotification &&
                <Modal onClick={()=>{setShowPushNotification(false);}}>
                  <h2>Push Notification</h2>
                  Title: <input placeholder='Title' value={message.title} onChange={(e)=>{setMessage({...message,title:e.target.value});}}/>
                  Body: <input placeholder='Body' value={message.body} onChange={(e)=>{setMessage({...message,body:e.target.value});}}/>
                  <button onClick={(e)=>{
                    pushTokens.map((pt)=>{
                      message.to = pt;
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
                      .catch((e)=>{appContext.setError("Sent");});
                    });
                    setShowPushNotification(false);
                  }}>Send</button>
                </Modal>
              }
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
