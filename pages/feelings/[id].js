import React from 'react';
import Layout from '/components/Layout';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import Image from 'next/image';

export default function Feeling(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [feeling, setFeeling] = React.useState();
  const id = router.query.id;

  const reader = new FileReader();
  reader.onloadend  = () => {
    setFeeling({
      ...feeling,
      image: reader.result
    });
  };

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(id==="new"){
        setFeeling({});
      }
      else{
        let data = await appContext.fetcher.get(`/api/feelings/${id}`);
        setFeeling(data);
      }
    };
    
    fetchData();
  }, [id, appContext.fetcher]);
  

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Feeling</div>
      {feeling && 
        <div className={appContext.styles.tableContainer}>
          <table>
            <thead>
            <tr>
              <td width="100px">Time</td>
              <td width="200px">{new Date().toLocaleDateString()}</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Purpose</td>
              <td>
                <input type='number' value={feeling.purpose || 0} onChange={(e)=>{setFeeling({...feeling,purpose:parseInt(e.target.value)});}}/>
              </td>
            </tr>
            <tr>
              <td>Thinking</td>
              <td>
                <input type='number' value={feeling.thinking || 0} onChange={(e)=>{setFeeling({...feeling,thinking:parseInt(e.target.value)});}}/>
              </td>
            </tr>
            <tr>
              <td>Energy</td>
              <td>
                <input type='number' value={feeling.energy || 0} onChange={(e)=>{setFeeling({...feeling,energy:parseInt(e.target.value)});}}/>
              </td>
            </tr>
            <tr>
              <td>Environment</td>
              <td>
                <input type='number' value={feeling.environment || 0} onChange={(e)=>{setFeeling({...feeling,environment:parseInt(e.target.value)});}}/>
              </td>
            </tr>
            <tr>
              <td>Physical</td>
              <td>
                <input type='number' value={feeling.physical || 0} onChange={(e)=>{setFeeling({...feeling,physical:parseInt(e.target.value)});}}/>
              </td>
            </tr>
            <tr>
              <td>Moving</td>
              <td>
                <input type='number' value={feeling.moving || 0} onChange={(e)=>{setFeeling({...feeling,moving:parseInt(e.target.value)});}}/>
              </td>
            </tr>
            <tr>
              <td colSpan={2} align="center">
                <button onClick={async ()=>{
                  if(id==="new"){
                    console.log(feeling);
                    let res = await appContext.fetcher.post("/api/feelings",feeling);
                    console.log(res);
                    if(res.status === 200){
                      router.push("/feelings");
                    }
                    else{
                      appContext.setError("Can't add!");
                    }
                  }
                  else{
                    let res1 = await appContext.fetcher.put(`/api/feelings/${feeling.id}`,feeling);
                    if(res1.status === 200){
                      router.push("/feelings");
                    }
                    else{   
                      appContext.setError("Can't save!");
                    }
                  }
                }}>Save</button>
                
                <button onClick={()=>{
                  router.push("/feelings");
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
