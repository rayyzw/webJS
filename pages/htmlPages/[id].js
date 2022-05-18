import React from 'react';
import Layout from '/components/Layout';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import Image from 'next/image';
import HtmlEditor from '/components/HtmlEditor';

export default function HtmlPage(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [htmlPage, setHtmlPage] = React.useState();
  const id = router.query.id;
  const [categories, setCategories] = React.useState();
  const [users, setUsers] = React.useState([]);

  const reader = new FileReader();
  reader.onloadend  = () => {
    setHtmlPage({
      ...htmlPage,
      image: reader.result
    });
  };

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(id==="new"){
        setHtmlPage({content:""});
      }
      else{
        let data = await appContext.fetcher.get(`/api/htmlPages/${id}`);
        setHtmlPage(data);
      }
      setCategories(await appContext.fetcher.get("/api/categories?type=HtmlPage"));
      setUsers(await appContext.fetcher.get("/api/users"));
    };
    
    fetchData();
  }, [id, appContext.fetcher]);
  

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Page</div>
      {htmlPage && 
        <div className={appContext.styles.tableContainer}>
          <table>
            <thead>
            <tr>
              <td width="100px">Title</td>
              <td width="200px"><input value={htmlPage.title || ""} onChange={(e)=>{setHtmlPage({...htmlPage,title:e.target.value});}}/></td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Image</td>
              <td>
                {htmlPage && htmlPage.image && <div><Image width={50} height={50} objectFit="contain" src={htmlPage.image} alt="htmlImage"/></div>}
                <input type="file" accept="image/png, image/gif, image/jpeg" onChange={async (e)=>{
                  reader.readAsDataURL(e.target.files[0]);
                }}/>
              </td>
            </tr>
            <tr>
              <td>Category</td>
              <td>
                <select placeholder="Category" value={htmlPage.categoryId || ""} onChange={(e)=>{setHtmlPage({...htmlPage,categoryId:e.target.value});}}>
                  <option value="">Select Category</option>
                  {categories && categories.map((c) => 
                    <option key={c.id} value={c.id}>{c.name}</option>
                  )}
                </select>
              </td>
            </tr>
            <tr>
              <td>URI</td>
              <td>
                <input value={htmlPage.uri || ""} onChange={(e)=>{setHtmlPage({...htmlPage,uri:e.target.value});}}/>
              </td>
            </tr>
            <tr>
              <td>Content</td>
              <td>
                <HtmlEditor
                  value={htmlPage.content || ""} 
                  onChange={(html)=>{
                    setHtmlPage((old)=>({...old,content:html}));
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} align="center">
                <button onClick={async ()=>{
                  htmlPage.categoryId = parseInt(htmlPage.categoryId);
                  if(id==="new"){
                    let res = await appContext.fetcher.post("/api/htmlPages",htmlPage);
                    if(res.status === 200){
                      if(users){
                        users.map((u)=>{
                          if(u.pushToken){
                            let message = {
                              to: u.pushToken,
                              sound: 'default',
                              title: 'New Page Added',
                              body: htmlPage.title,
                            };
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
                          }
                        });
                      }
                      router.push("/htmlPages");
                    }
                    else{
                      appContext.setError("Can't add!");
                    }
                  }
                  else{
                    let res1 = await appContext.fetcher.put(`/api/htmlPages/${htmlPage.id}`,htmlPage);
                    if(res1.status === 200){
                      if(users){
                        users.map((u)=>{
                          if(u.pushToken){
                            let message = {
                              to: u.pushToken,
                              sound: 'default',
                              title: 'Page Updated',
                              body: htmlPage.title,
                            };
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
                          }
                        });
                      }
                      router.push("/htmlPages");
                    }
                    else{   
                      appContext.setError("Can't save!");
                    }
                  }
                }}>Save</button>

                {id!=="new" &&
                  <button onClick={()=>{
                    window.open(`/html/${id}`);
                  }}>Preview</button>
                }
                
                <button onClick={()=>{
                  router.push("/htmlPages");
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
