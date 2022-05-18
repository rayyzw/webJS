import React from 'react';
import Link from 'next/link';
import { useAppContext } from '/components/Context';
import { useRouter } from "next/router";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [errors, setErrors] = React.useState({});
  const appContext = useAppContext();  

  const onSubmit = async (e) => {
    let res = await appContext.fetcher.post("/api/users/login",{"email":email,"password":password});
    if(res.status===200){
      let user = await res.json();
      appContext.setUser(user);
      window.location = "/";
    }
    else{
      setErrors({...errors,"email":"Email or password incorrect!"});
    }
  };

  return (
    <div className={appContext.styles.centeredContainer}>
      <div className={appContext.styles.topRightContainer}>
        <h2>Theme</h2>
        <input 
            type="checkbox"
            checked={appContext.theme==="Light"}
            onChange={(e)=>{
                if(e.target.checked){
                    appContext.setTheme("Light");
                    router.reload();
                }
            }}
        />Light <br/>
        <input 
            type="checkbox"
            checked={appContext.theme==="Warm"}
            onChange={(e)=>{
                if(e.target.checked){
                    appContext.setTheme("Warm");
                    router.reload();
                }
            }}
        />Warm <br/>
        <input 
            type="checkbox"
            checked={appContext.theme==="Traditional"}
            onChange={(e)=>{
                if(e.target.checked){
                    appContext.setTheme("Traditional");
                    router.reload();
                }
            }}
        />Traditional <br/>
        <input 
            type="checkbox"
            checked={appContext.theme==="Dark"}
            onChange={(e)=>{
                if(e.target.checked){
                    appContext.setTheme("Dark");
                    router.reload();
                }
            }}
        />Dark <br/>
      </div>
      <Image src="/logo.png" width={400} height={200} objectFit="contain" alt="photo"/>
      <div style={{width:300, display:"flex", flexDirection: "column", gap:"5px"}}>
        <input value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value);setErrors({});}}/>          
        <input type="password" value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value);setErrors({});}}/>         
      </div>         
      <button onClick={onSubmit} disabled={Boolean(errors.email)}>Login</button>          
      <span className={appContext.styles.error}>{errors.email}</span>
      <Link href="/users/resetPassword">Reset Password</Link>
      <Link href="/users/register">Register</Link>
      <Link href="/html">Continue as Grest</Link>
    </div>
  )
}
