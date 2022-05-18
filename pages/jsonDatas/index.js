import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as Icons from '/components/Icons';

export default function JsonDatas(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [jsonDatas, setJsonDatas] = React.useState();
  const [jsonSchemas, setJsonSchemas] = React.useState();
  const [jsonSchema, setJsonSchema] = React.useState();
  const [jsonSchemaListedCount, setJsonSchemaListedCount] = React.useState(1);
	const jsonSchemaId = router.query.jsonSchemaId;
  
  React.useEffect(() => {
    const fetchData = async ()=>{
      setJsonSchemas(await appContext.fetcher.get("/api/jsonSchemas"));
    };
    fetchData();
  }, [appContext.fetcher]);

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(jsonSchemaId && jsonSchemas){
        let js = jsonSchemas.find((j)=>j.id===parseInt(jsonSchemaId));
        if(js){                                            
          try {
            js.json = JSON.parse(js.json);
          } catch (err) {
            console.log(err);
          }
          setJsonSchema(js);
          setJsonDatas(await appContext.fetcher.get(`/api/jsonDatas?jsonSchemaId=${jsonSchemaId}`));
        }
      }
    };
    fetchData();
  }, [appContext.fetcher, jsonSchemas, jsonSchemaId]);
  
  React.useEffect(() => {
    if(jsonSchema && jsonSchema.json && jsonSchema.json.properties){
      let listedCount = 0;
      Object.entries(jsonSchema.json.properties).map(([key, property])=>{
        if(property.listed){
          listedCount = listedCount + 1;
        }
      });
      setJsonSchemaListedCount(listedCount);
    }
  }, [jsonSchema]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Datas</div>
      <div className={appContext.styles.tableContainer}>
        <table width="100%">
          <tbody>
          <tr>
            <td valign="top" width="10%">
              <div className={appContext.styles.leftContainer}>
                <table width="100%">
                  <tbody>
                  {jsonSchemas && jsonSchemas.map((j)=>
                    <tr key={j.id}>
                      <td>
                        <a 
                          className={(jsonSchema && jsonSchema.id===j.id) ? appContext.styles.navMenuActive : appContext.styles.navMenu}
                          href={"#"} 
                          onClick={async (e)=>{                                               
                            try {
                              j.json = JSON.parse(j.json);
                            } catch (err) {
                              console.log(err);
                            }
                            setJsonSchema(j);
                            setJsonDatas(await appContext.fetcher.get(`/api/jsonDatas?jsonSchemaId=${j.id}`));
                          }}
                        >
                          {j.name}
                        </a>
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </td>
            <td valign="top" width="90%">
              {jsonSchema && jsonSchema.json && jsonSchema.json.properties &&
                <table width="100%">
                  <thead>
                  <tr>
                    {Object.entries(jsonSchema.json.properties).map(([key, property])=>{
                      if(property.listed){
                        return <th key={key} width={parseInt(80/jsonSchemaListedCount)+"%"}>{key}</th>;
                      }
                    })}
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {jsonDatas && jsonDatas.map((j)=>{
                    let json = {};                                          
                    try {
                      json = JSON.parse(j.json);
                    } catch (err) {
                      console.log(err);
                    }
                    return (
                      <tr key={j.id}>                    
                        {Object.entries(jsonSchema.json.properties).map(([key, property])=>{
                          if(property.listed){
                            return (
                              <td key={key}>                              
                                <Link href={`/jsonDatas/${j.id}?jsonSchemaId=${jsonSchema && jsonSchema.id}`}>{property.type==="password" ? "********" : String(json[key])}</Link>
                                {property.copyable && 
                                  <span style={{marginLeft:10, cursor:"pointer"}} title="Click To Copy" 
                                    onClick={(e)=>{
                                      navigator.clipboard.writeText(String(json[key]));
                                      appContext.setMessage("Copied!");
                                    }}
                                  >
                                    <Icons.Copy/>
                                  </span>
                                }
                              </td>
                            );
                          }
                        })}
                        <td>                          
                          <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                            let res = await appContext.fetcher.delete(`/api/jsonDatas/${j.id}`);
                            if(res.status === 200){
                              setJsonDatas(await appContext.fetcher.get(`/api/jsonDatas?jsonSchemaId=${jsonSchema.id}`));
                            }
                            else{
                              appContext.setError("Can't delete!");
                            }
                          }}><Icons.Delete/></div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={jsonSchemaListedCount}></td>
                    <td>
                      <Link href={`/jsonDatas/new?jsonSchemaId=${jsonSchema && jsonSchema.id}`} passHref>
                        <div className={appContext.styles.addButton}><Icons.Add/></div>
                      </Link>
                    </td>
                  </tr>
                  </tbody>
                </table>
              }
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
