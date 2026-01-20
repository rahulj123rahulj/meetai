"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const initialFormData = {
    name: '',
    email: '',
    password: '',
  }
  const [formData, setFormData] = useState(initialFormData);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const { 
    data: session, 
    isPending: isLoading
    } = authClient.useSession() 


  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target
    if(message){
      setMessage('')
    } 
    setFormData({...formData, [name]: value})
  }
  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(formData);
    authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password
    },{
      onRequest:()=>{
        setIsPending(true)
      },
      onSuccess: (data) => {
        console.log(data)
        alert('Sign up successful')
      },
      onError: (error) => {
        setMessage(error?.error?.message ?? '')
        console.log(error)
      },
      onResponse:(context)=>{
        console.log(context)
        setIsPending(false)
      },
    })
  }
  const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    authClient.signIn.email({
      email: formData.email,
      password: formData.password
    },{
      onRequest:()=>{
        setIsPending(true)
      },
      onSuccess: (data) => {
        console.log(data)
        alert('Sign up successful')
      },
      onError: (error) => {
        setMessage(error?.error?.message ?? '')
        console.log(error)
      },
      onResponse:(context)=>{
        console.log(context)
        setIsPending(false)
      },
    })
  }

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPending(true)
    await authClient.signOut();
    setIsPending(false)
  }

  if(isLoading){
    return <div className="">
      <Skeleton className="h-4 w-48" />
    </div>
  }

  if(session?.user){
    return <div className="flex items-center justify-center p-4">
        <div className="">
          <p>{session.user?.name}</p>
          <Button 
            onClick={handleSignOut}
            disabled={isPending} 
            size={"sm"}
          >
            Sign Out
          </Button>
        </div>
    </div>
  }
  return (<>
    <div className=" flex flex-col gap-y-4 p-4 border-b-2">
        <Input
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        <Input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        <Input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {
            !!message && 
            <p className="text-red-500">{message}</p>
          }
          <p></p>
          <Button 
            onClick={handleSignUp}
            disabled={isPending} 
          >
            Sign Up
          </Button>
    </div>
    <div className=" flex flex-col gap-y-4 p-4">
        <Input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        <Input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {
            !!message && 
            <p className="text-red-500">{message}</p>
          }
          <p></p>
          <Button 
            onClick={handleSignIn}
            disabled={isPending} 
          >
            Sign In
          </Button>
    </div>
   </>
  );
}
