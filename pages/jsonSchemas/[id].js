import React from 'react';
import Layout from '/components/Layout';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';

export default function JsonSchema(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [jsonSchema, setJsonSchema] = React.useState();
  const id = router.query.id;

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(id==="new"){
        setJsonSchema({
          json: {
            type: "object",
            properties: {
              Name: {
                type: "text",
                required: true,
                listed: true,
                searchable: true,
                copyable: false,
              },
            },
          }
        });
      }
      else{
        let data = await appContext.fetcher.get(`/api/jsonSchemas/${id}`);
        try {
          data.json = JSON.parse(data.json);
        } catch (err) {
          console.log(err);
        }
        setJsonSchema(data);
      }
    };
    
    fetchData();
  }, [id, appContext.fetcher]);
  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>JsonSchema</div>
      {jsonSchema && 
        <div className={appContext.styles.tableContainer}>
          <table>
            <tbody>
            <tr>
              <td width="100px">Name</td>
              <td width="700px"><input value={jsonSchema.name || ""} onChange={(e)=>{setJsonSchema({...jsonSchema,name:e.target.value});}}/></td>
            </tr>
            {/*
            <tr>
              <td>Json</td>
              <td><textarea value={JSON.stringify(jsonSchema.json)} readOnly/></td>
            </tr>
            */}
            <tr>
              <td colSpan={2}> 
                <table width="800px">
                  <tbody>
                  {Object.entries(jsonSchema.json.properties).map(([key, property]) => {
                    return (
                        <tr key={key}>
                          <td>{key}:</td>
                          <td width="100px">
                            <select
                              value={property.type || ""}
                              onChange={(e) => {
                                jsonSchema.json.properties[key].type = e.target.value;
                                setJsonSchema({...jsonSchema});
                              }}
                            >
                              <option key={"text"} value={"text"}>
                                {"text"}
                              </option>
                              <option
                                key={"number"}
                                value={"number"}
                              >
                                {"number"}
                              </option>
                              <option
                                key={"textarea"}
                                value={"textarea"}
                              >
                                {"textarea"}
                              </option>
                              <option
                                key={"password"}
                                value={"password"}
                              >
                                {"password"}
                              </option>
                              <option
                                key={"email"}
                                value={"email"}
                              >
                                {"email"}
                              </option>
                              <option key={"url"} value={"url"}>
                                {"url"}
                              </option>
                              <option
                                key={"boolean"}
                                value={"boolean"}
                              >
                                {"boolean"}
                              </option>
                              <option
                                key={"html"}
                                value={"html"}
                              >
                                {"html"}
                              </option>
                            </select>
                          </td>
                          <td width="100px">
                            <input 
                              type="checkbox" 
                              checked={property.required}
                              onChange={(e) => {
                                jsonSchema.json.properties[key].required = e.target.checked;
                                setJsonSchema({...jsonSchema});
                              }}
                            /> Required
                          </td>
                          <td width="80px">
                            <input 
                              type="checkbox" 
                              checked={property.listed}
                              onChange={(e) => {
                                jsonSchema.json.properties[key].listed = e.target.checked;
                                setJsonSchema({...jsonSchema});
                              }}
                            /> Listed
                          </td>
                          <td width="110px">
                            <input 
                              type="checkbox" 
                              checked={property.searchable}
                              onChange={(e) => {
                                jsonSchema.json.properties[key].searchable = e.target.checked;
                                setJsonSchema({...jsonSchema});
                              }}
                            /> Searchable
                          </td>
                          <td width="100px">
                            <input 
                              type="checkbox" 
                              checked={property.copyable}
                              onChange={(e) => {
                                jsonSchema.json.properties[key].copyable = e.target.checked;
                                setJsonSchema({...jsonSchema});
                              }}
                            /> Copyable
                          </td>
                          <td width="70px">
                            <button 
                              onClick={(e) => {
                                delete jsonSchema.json.properties[key];
                                setJsonSchema({...jsonSchema});
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>Add Field</td>
              <td>
                <input 
                  placeholder="Press Enter To Add New Field"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (e.target.value && e.target.value !== "") {
                        jsonSchema.json.properties[e.target.value] = {
                          type: "text",
                          required: false,
                          listed: false,
                          searchable: false,
                          copyable: false,
                        };
                        setJsonSchema({...jsonSchema});
                        e.target.value = "";
                      }
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} align="center">
                <button onClick={async ()=>{
                  if(id==="new"){
                    jsonSchema.json = JSON.stringify(jsonSchema.json);
                    let res = await appContext.fetcher.post("/api/jsonSchemas",jsonSchema);
                    if(res.status === 200){
                      router.push("/jsonSchemas");
                    }
                    else{
                      try {
                        jsonSchema.json = JSON.parse(jsonSchema.json);
                      } catch (err) {
                        console.log(err);
                      }
                      appContext.setError("Can't add!");
                    }
                  }
                  else{
                    jsonSchema.json = JSON.stringify(jsonSchema.json);
                    let res1 = await appContext.fetcher.put(`/api/jsonSchemas/${jsonSchema.id}`,jsonSchema);
                    if(res1.status === 200){
                      router.push("/jsonSchemas");
                    }
                    else{                    
                      try {
                        jsonSchema.json = JSON.parse(jsonSchema.json);
                      } catch (err) {
                        console.log(err);
                      }
                      appContext.setError("Can't save!");
                    }
                  }
                }}>Save</button>
                <button onClick={()=>{
                  router.push("/jsonSchemas");
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
