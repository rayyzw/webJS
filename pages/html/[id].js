import React from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import HtmlPages from './index';

export default function HtmlPage(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [htmlPage, setHtmlPage] = React.useState();
  const id = router.query.id;

  React.useEffect(() => {
    const fetchData = async ()=>{
      let data = await appContext.fetcher.get(`/api/htmlPages/${id}`);
      if(data.uri){
        router.push(data.uri);
      }
      setHtmlPage(data);
    };
    fetchData();
  }, [id, appContext.fetcher, router]);

  return (
    <HtmlPages {...props}>
      {htmlPage && <div className={appContext.styles.titleContainer}>{htmlPage.title}</div>}
      {htmlPage && 
        <div className={appContext.styles.tableContainer} dangerouslySetInnerHTML={{ __html: htmlPage.content }}/>
      }
    </HtmlPages>
  );
};
