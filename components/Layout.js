import React from 'react';
import { useAppContext } from '/components/Context';
import Link from 'next/link';
import { useRouter } from "next/router";
import Popover from '/components/Popover';
import Image from 'next/image';

export default function Layout(props) {
    const router = useRouter();
    const appContext = useAppContext();
    const [userPermission, setUserPermission] = React.useState(false);
    const [rolePermission, setRolePermission] = React.useState(false);
    const [permissionPermission, setPermissionPermission] = React.useState(false);
    const [jsonSchemaPermission, setJsonSchemaPermission] = React.useState(false);
    const [jsonDataPermission, setJsonDataPermission] = React.useState(false);
    const [htmlPagePermission, setHtmlPagePermission] = React.useState(false);
    const [categoryPermission, setCategoryPermission] = React.useState(false);
    const [feelingPermission, setFeelingPermission] = React.useState(false);
    const [anchor, setAnchor] = React.useState();
    const [showMenu, setShowMenu] = React.useState(window.innerWidth>1000);
    const [showLogo, setShowLogo] = React.useState(window.innerWidth>500);

    React.useEffect(() => {
        if(!appContext.user){
            router.push("/login");
        }
        else if(!appContext.user.name){
            router.push("/login");
        }
        
        if(appContext.user && appContext.user.isAdmin){
            setUserPermission(true);
            setRolePermission(true);
            setPermissionPermission(true);
            setJsonSchemaPermission(true);
            setJsonDataPermission(true);
            setHtmlPagePermission(true);
            setCategoryPermission(true);
            setFeelingPermission(true);
        }
        else if(appContext.user && appContext.user.roles){
            appContext.user.roles.map((r)=>{
                if(r.permissions.some((p)=>(p.model==="User" && p.method==="GET"))){
                    setUserPermission(true);
                }
                if(r.permissions.some((p)=>(p.model==="Role" && p.method==="GET"))){
                    setRolePermission(true);
                }
                if(r.permissions.some((p)=>(p.model==="Permission" && p.method==="GET"))){
                    setPermissionPermission(true);
                }
                if(r.permissions.some((p)=>(p.model==="JsonSchema" && p.method==="GET"))){
                    setJsonSchemaPermission(true);
                }
                if(r.permissions.some((p)=>(p.model==="JsonData" && p.method==="GET"))){
                    setJsonDataPermission(true);
                }
                if(r.permissions.some((p)=>(p.model==="HtmlPage" && p.method==="GET"))){
                    setHtmlPagePermission(true);
                }
                if(r.permissions.some((p)=>(p.model==="Category" && p.method==="GET"))){
                    setCategoryPermission(true);
                }
                if(r.permissions.some((p)=>(p.model==="Feeling" && p.method==="GET"))){
                    setFeelingPermission(true);
                }
            });
        }

    },[appContext.user, router]);

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
                {showLogo && <Link href="/" passHref><span className={appContext.styles.logoContainer}></span></Link>}
                {showMenu &&
                <>
                {jsonDataPermission && <span className={router.pathname==="/jsonDatas" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/jsonDatas">Datas</Link></span>}
                {jsonSchemaPermission && <span className={router.pathname==="/jsonSchemas" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/jsonSchemas">Schemas</Link></span>}
                {htmlPagePermission && <span className={router.pathname==="/htmlPages" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/htmlPages">Pages</Link></span>}
                {feelingPermission && <span className={router.pathname==="/feelings" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/feelings">Feelings</Link></span>}
                {userPermission && <span className={router.pathname==="/users" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/users">Users</Link></span>}
                {rolePermission && <span className={router.pathname==="/roles" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/roles">Roles</Link></span>}
                {permissionPermission && <span className={router.pathname==="/permissions" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/permissions">Permissions</Link></span>}
                {categoryPermission && <span className={router.pathname==="/categories" ? appContext.styles.navMenuActive : appContext.styles.navMenu}><Link href="/categories">Categories</Link></span>}
                </>
                }
                {!showMenu &&
                <>
                <select onChange={(e)=>{router.push(e.target.value);}} value={router.pathname}>
                    {!showLogo &&
                        <option value="/">Home</option>
                    }
                    <option value="/dashboard">Dashboard</option>
                    {jsonDataPermission && <option value="/jsonDatas">Datas</option>}
                    {jsonSchemaPermission && <option value="/jsonSchemas">Schemas</option>}
                    {htmlPagePermission && <option value="/htmlPages">Pages</option>}
                    {feelingPermission && <option value="/feelings">Feelings</option>}
                    {userPermission && <option value="/users">Users</option>}
                    {rolePermission && <option value="/roles">Roles</option>}
                    {permissionPermission && <option value="/permissions">Permissions</option>}
                    {categoryPermission && <option value="/categories">Categories</option>}
                    {!showLogo &&
                        <optgroup label="Settings">
                            <option value="/users/profile">Profile</option>
                            <option value="/logout">Logout</option>
                        </optgroup>
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
                                setAnchor(e.target);
                            }}>Hi, {appContext.user.name}</button>
                        }
                        {appContext.user && appContext.user.photo && 
                            <Image 
                                width={40}
                                height={40}
                                objectFit="contain"
                                src={appContext.user.photo}
                                onClick={(e)=>{
                                    setAnchor(e.target);
                                }}
                                alt="photo"
                            />
                        }
                        {anchor && 
                            <Popover anchor={anchor} setAnchor={setAnchor}>                                
                                <div className={appContext.styles.navMenu}>
                                    <Link href="/users/profile">
                                        Profile
                                    </Link>
                                </div>
                                <div className={appContext.styles.navMenu}>
                                    <Link href="/logout">
                                        Logout
                                    </Link>
                                </div>
                            </Popover>
                        }
                    </span>
                }
            </div>
            {appContext.user &&
                <div className={appContext.styles.middleContainer} onClick={()=>{setAnchor(null);}}> 
                    {props.children}
                </div>
            }
            <div className={appContext.styles.bottomContainer}>
              <Link href="https://xiny.ca" target="_blank" rel="noreferrer">
                  2022 &copy; XinY.
              </Link>
            </div>
        </div>
    );
}