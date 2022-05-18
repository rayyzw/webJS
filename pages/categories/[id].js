import React from 'react';
import Layout from '/components/Layout';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import Image from 'next/image';

export default function Category(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [category, setCategory] = React.useState();
  const id = router.query.id;

  const reader = new FileReader();
  reader.onloadend  = () => {
    setCategory({
      ...category,
      image: reader.result
    });
  };

  React.useEffect(() => {
    const fetchData = async ()=>{
      if(id==="new"){
        setCategory({});
      }
      else{
        let data = await appContext.fetcher.get(`/api/categories/${id}`);
        setCategory(data);
      }
    };
    
    fetchData();
  }, [id, appContext.fetcher]);
  

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Category</div>
      {category && 
        <div className={appContext.styles.tableContainer}>
          <table>
            <thead>
            <tr>
              <td width="100px">Name</td>
              <td width="200px"><input value={category.name || ""} onChange={(e)=>{setCategory({...category,name:e.target.value});}}/></td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Image</td>
              <td>
                {category && category.image && <Image width={50} height={50} objectFit="contain" src={category.image} alt="categoryImage"/>}
                <input type="file" accept="image/png, image/gif, image/jpeg" onChange={async (e)=>{
                  reader.readAsDataURL(e.target.files[0]);
                }}/>
              </td>
            </tr>
            <tr>
              <td>Type</td>
              <td>
                <select placeholder="Type" value={category.type || ""} onChange={(e)=>{setCategory({...category,type:e.target.value});}}>
                  <option value="">Select Type</option>
                  {/* <option value="User">User</option>
                  <option value="Role">Role</option>
                  <option value="Permission">Permission</option>
                  <option value="JsonSchema">JsonSchema</option>
                  <option value="JsonData">JsonData</option> */}
                  <option value="HtmlPage">HtmlPage</option>
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan={2} align="center">
                <button onClick={async ()=>{
                  if(id==="new"){
                    let res = await appContext.fetcher.post("/api/categories",category);
                    if(res.status === 200){
                      router.push("/categories");
                    }
                    else{
                      appContext.setError("Can't add!");
                    }
                  }
                  else{
                    let res1 = await appContext.fetcher.put(`/api/categories/${category.id}`,category);
                    if(res1.status === 200){
                      router.push("/categories");
                    }
                    else{   
                      appContext.setError("Can't save!");
                    }
                  }
                }}>Save</button>
                
                <button onClick={()=>{
                  router.push("/categories");
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
