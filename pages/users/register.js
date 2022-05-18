import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useAppContext } from '/components/Context';
import Image from "next/image";

export default function Register() {  
  const router = useRouter();
  const appContext = useAppContext();
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

  const onSubmit = async (e) => {
    let res = await appContext.fetcher.post("/api/users/register",{"name":name,"email":email,"password":password});
    if(res.status === 200){      
      router.push("/");
    }
  };

  return (
    <div className={appContext.styles.centeredContainer}>
      <Image src="/logo.png" width={400} height={200} objectFit="contain" alt="logo"/>      
      <div style={{width:300, display:"flex", flexDirection: "column", gap:"5px"}}>
        <input value={name} placeholder="Name" onChange={(e)=>{setName(e.target.value);}}/>
        <input value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value);}}/>
        <input type="password" value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value);}}/>
      </div>
      <button onClick={onSubmit}>Register</button>
      <Link href="/login">Login</Link>
    </div>
  )
}
