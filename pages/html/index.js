import React from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import Image from "next/image";

export default function HtmlPages(props) {
  const router = useRouter();
  const appContext = useAppContext();
  const [htmlPages, setHtmlPages] = React.useState();
  const [showMenu, setShowMenu] = React.useState(window.innerWidth>1000);
  const [showLogo, setShowLogo] = React.useState(window.innerWidth>500);

  React.useEffect(() => {
    const fetchData = async ()=>{
      let data = await appContext.fetcher.get(`/api/htmlPages`);
      setHtmlPages(data);
    };
    
    fetchData();
  }, [appContext.fetcher]);


  React.useEffect(() => {
      const handleResize = () => {
          setShowMenu(window.innerWidth>1000);
          setShowLogo(window.innerWidth>500);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
  },[]);

  return (
      <div className={appContext.styles.rootContainer}>
          <div className={appContext.styles.topContainer}>
              {showLogo && <Link href="/html" passHref><span className={appContext.styles.logoContainer}></span></Link>}
              {showMenu && htmlPages && htmlPages.map((hp, index)=>(
                <span key={hp.id}>
                {index>0 && " | "}
                <span className={appContext.styles.navMenu}><Link href={`/html/${hp.id}`}>{hp.title}</Link></span>
                </span>
              ))}
              {!showMenu &&
              <>
              <select onChange={(e)=>{router.push(e.target.value);}} value={window.location.pathname}>
                {!showLogo &&
                  <option value="/html">Home</option>
                }
                {htmlPages && htmlPages.map((hp)=>(
                  <option key={hp.id} value={`/html/${hp.id}`}>{hp.title}</option>
                ))}
                {!showLogo &&
                  <option value="/login">Login</option>
                }
              </select>
              </>
              }
              {appContext.message && <span className={appContext.styles.messageBar}>{appContext.message}</span>}
              {appContext.error && <span className={appContext.styles.errorBar}>{appContext.error}</span>}
              {showLogo &&
                <span className={appContext.styles.profileContainer}>
                    {!(appContext.user && appContext.user.photo) && 
                        <button onClick={(e)=>{
                          router.push("/login");
                        }}>Login</button>
                    }
                    {appContext.user && appContext.user.photo && 
                        <Image 
                            width={40}
                            height={40}
                            objectFit="contain"
                            src={appContext.user.photo}
                            onClick={(e)=>{
                              router.push("/htmlPages");
                            }}
                            alt="photo"
                        />
                    }
                </span>
              }
          </div>
          {appContext.user &&
              <div className={appContext.styles.middleContainer}> 
                  {props.children && props.children} 
                  {!props.children && 
                    <>
                      <div className={appContext.styles.titleContainer}>Pages</div>
                      <div className={appContext.styles.tableContainer}>
                        {htmlPages && htmlPages.map((hp)=>(
                          <div key={hp.id} className={appContext.styles.navMenu}>
                            <Link href={`/html/${hp.id}`} passHref>
                              <div style={{display:"flex", cursor:"pointer"}}>
                                {hp.image &&
                                  <Image
                                    width={160}
                                    height={40}
                                    objectFit="contain"
                                    src={hp.image}
                                    alt="htmlImage"
                                    title={hp.title}                                    
                                  />
                                }
                                {!hp.image &&
                                  hp.title
                                }
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                  }
              </div>
          }
          <div className={appContext.styles.bottomContainer}>
            <Link href="https://xiny.ca" target="_blank" rel="noreferrer">
                2022 &copy; XinY.
            </Link>
          </div>
      </div>
  );
};
