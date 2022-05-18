import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppContext } from '/components/Context';
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const appContext = useAppContext();
	const userToken = router.query.token;
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [errors, setErrors] = React.useState({});
	const [messages, setMessages] = React.useState({});

  const onSubmit = async (e) => {
    if(userToken){
      if(!password){
        setMessages({});
        setErrors({"password":"Password is required!"});
      }
      else if(password===confirmPassword){
        let res = await appContext.fetcher.post("/api/users/resetPassword",{"userToken":userToken,"password":password});
        if(res.status===200){
          setErrors({});
          setMessages({"password":"Password changed!"});
        }
        else{
          setMessages({});
          setErrors({"password":"Token expired!"});
        }
      }
      else{
        setMessages({});
        setErrors({"password":"Passwords not match!"});
      }
    }
    else{
      let res1 = await appContext.fetcher.get(`/api/users/resetPassword?email=${email}`);
      if(res1){
        setErrors({});
        setMessages({"email":"Token sent!"});
      }
      else{
        setMessages({});
        setErrors({"email":"Email incorrect!"});
      }
    }
  };

  return (
    <div className={appContext.styles.centeredContainer}>
      <Image src="/logo.png" width={400} height={200} objectFit="contain" alt="photo"/>
      <div style={{width:300, display:"flex", flexDirection: "column", gap:"5px"}}>
        {!userToken && 
          <input value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value);}}/>
        }
        {userToken && 
          <>
          <input type="password" value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value);}}/>
          <input type="password" value={confirmPassword} placeholder="Confirm Password" onChange={(e)=>{setConfirmPassword(e.target.value);}}/>
          </>
        }
      </div>
      <button onClick={onSubmit}>ResetPassword</button>
      <span className={appContext.styles.error}>{errors.email}</span>
      <span className={appContext.styles.message}>{messages.email}</span>
      <span className={appContext.styles.error}>{errors.password}</span>
      <span className={appContext.styles.message}>{messages.password}</span>
      <Link href="/login">Login</Link>
    </div>
  )
}
