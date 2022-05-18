import React from 'react';
import Layout from '/components/Layout';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import * as Icons from '/components/Icons';
import Image from 'next/image';

export default function Categories(props) {
  const appContext = useAppContext();
  const [categories, setCategories] = React.useState();
  
  React.useEffect(() => {
    const fetchData = async ()=>{
      setCategories(await appContext.fetcher.get("/api/categories"));
    };
    fetchData();
  }, [appContext.fetcher]);

  return (
    <Layout {...props}>
      <div className={appContext.styles.titleContainer}>Categories</div>
      <div className={appContext.styles.tableContainer}>
        <table>
          <thead>
          <tr>
            <th width="50px"></th>
            <th width="200px">Type</th>
            <th width="200px">Name</th>
            <th width="100px"></th>
          </tr>
          </thead>
          <tbody>
          {categories && categories.map((c)=>
            <tr key={c.id}>
              <td>{c.image && <Image width={70} height={35} objectFit="contain" src={c.image} alt="categoryImage"/>}</td>
              <td><Link href={`/categories/${c.id}`}>{c.type}</Link></td>
              <td><Link href={`/categories/${c.id}`}>{c.name}</Link></td>
              <td>                          
                <div className={appContext.styles.deleteButton} onClick={async (e)=>{
                  let res = await appContext.fetcher.delete(`/api/categories/${c.id}`);
                  if(res.status === 200){
                    setCategories(await appContext.fetcher.get("/api/categories"));
                  }
                  else{
                    appContext.setError("Can't delete!");
                  }
                }}><Icons.Delete/></div>
              </td>
            </tr>
          )}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <Link href="/categories/new" passHref>
                <div className={appContext.styles.addButton}><Icons.Add/></div>
              </Link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
