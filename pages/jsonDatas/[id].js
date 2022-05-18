import React from 'react';
import Layout from '/components/Layout';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import HtmlEditor from '/components/HtmlEditor';

export default function JsonData(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [jsonData, setJsonData] = React.useState();
  const [jsonSchema, setJsonSchema] = React.useState();
  const id = router.query.id;
	const jsonSchemaId = router.query.jsonSchemaId;

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(id==="new"){
        setJsonData({
          jsonSchemaId: parseInt(jsonSchemaId),
          json: {}
        });
      }
      else{
        let data = await appContext.fetcher.get(`/api/jsonDatas/${id}`);
        try {
          data.json = JSON.parse(data.json);
        } catch (err) {
          console.log(err);
        }
        setJsonData(data);
      }
      let res2 = await appContext.fetcher.get(`/api/jsonSchemas/${jsonSchemaId}`);      
      try {
        res2.json = JSON.parse(res2.json);
      } catch (err) {
        console.log(err);
      }
      setJsonSchema(res2);
    };
    
    fetchData();
  }, [id, appContext.fetcher, jsonSchemaId]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Data</div>
      {jsonData && 
        <div className={appContext.styles.tableContainer}>
          <table>
            <tbody>
            {jsonSchema && jsonSchema.json && jsonSchema.json.properties && Object.entries(jsonSchema.json.properties).map(([key, property])=>{
              return (
                <tr key={key}>
                  <td width="100px">
                    {key} {property.required && " *"}
                  </td>
                  <td width="200px">
                    {["text", "email", "url"].includes(property.type) &&
                      <input 
                        value={jsonData.json[key] || ""} 
                        onChange={(e)=>{
                          jsonData.json[key] = e.target.value;
                          let keyWords = "";
                          Object.entries(jsonSchema.json.properties).map(([key1, property1]) => {
                            if (property1.searchable) {
                              keyWords = keyWords + jsonData.json[key1] + ",";
                            }
                          });
                          setJsonData({...jsonData,name:keyWords});
                        }}
                      />
                    }
                    {["number",].includes(property.type) &&
                      <input 
                        type="number"
                        value={jsonData.json[key] || ""} 
                        onChange={(e)=>{
                          jsonData.json[key] = e.target.value;
                          let keyWords = "";
                          Object.entries(jsonSchema.json.properties).map(([key1, property1]) => {
                            if (property1.searchable) {
                              keyWords = keyWords + jsonData.json[key1] + ",";
                            }
                          });
                          setJsonData({...jsonData,name:keyWords});
                        }}
                      />
                    }
                    {["password",].includes(property.type) &&
                      <input 
                        type="password"
                        value={jsonData.json[key] || ""} 
                        onChange={(e)=>{
                          jsonData.json[key] = e.target.value;
                          let keyWords = "";
                          Object.entries(jsonSchema.json.properties).map(([key1, property1]) => {
                            if (property1.searchable) {
                              keyWords = keyWords + jsonData.json[key1] + ",";
                            }
                          });
                          setJsonData({...jsonData,name:keyWords});
                        }}
                      />
                    }
                    {["textarea",].includes(property.type) &&
                      <textarea 
                        value={jsonData.json[key] || ""} 
                        onChange={(e)=>{
                          jsonData.json[key] = e.target.value;
                          let keyWords = "";
                          Object.entries(jsonSchema.json.properties).map(([key1, property1]) => {
                            if (property1.searchable) {
                              keyWords = keyWords + jsonData.json[key1] + ",";
                            }
                          });
                          setJsonData({...jsonData,name:keyWords});
                        }}
                      />
                    }
                    {["boolean",].includes(property.type) &&
                      <input
                        type="checkbox" 
                        checked={jsonData.json[key]} 
                        onChange={(e)=>{
                          jsonData.json[key] = e.target.checked;
                          let keyWords = "";
                          Object.entries(jsonSchema.json.properties).map(([key1, property1]) => {
                            if (property1.searchable) {
                              keyWords = keyWords + jsonData.json[key1] + ",";
                            }
                          });
                          setJsonData({...jsonData,name:keyWords});
                        }}
                      />
                    }
                    {["html",].includes(property.type) &&
                      <HtmlEditor
                        value={jsonData.json[key] || ""} 
                        onChange={(html)=>{
                          jsonData.json[key] = html;
                        }}
                      />
                    }
                  </td>
                </tr>
              );
            })}
            <tr>
              <td></td>
              <td>
                <button onClick={async ()=>{
                  if(id==="new"){
                    jsonData.json = JSON.stringify(jsonData.json);
                    let res = await appContext.fetcher.post("/api/jsonDatas",jsonData);
                    if(res.status === 200){
                      router.push(`/jsonDatas?jsonSchemaId=${jsonSchemaId}`);
                    }
                    else{                       
                      try {
                        jsonData.json = JSON.parse(jsonData.json);
                      } catch (err) {
                        console.log(err);
                      }
                      setJsonData({...jsonData});
                      appContext.setError("Can't add!");
                    }
                  }
                  else{
                    jsonData.json = JSON.stringify(jsonData.json);
                    let res1 = await appContext.fetcher.put(`/api/jsonDatas/${jsonData.id}`,jsonData);
                    if(res1.status === 200){
                      router.push(`/jsonDatas?jsonSchemaId=${jsonSchemaId}`);
                    }
                    else{
                      try {
                        jsonData.json = JSON.parse(jsonData.json);
                      } catch (err) {
                        console.log(err);
                      }
                      setJsonData({...jsonData});
                      appContext.setError("Can't save!");
                    }
                  }
                }}>Save</button>
                <button onClick={()=>{
                  router.push(`/jsonDatas?jsonSchemaId=${jsonSchemaId}`);
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
