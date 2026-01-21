"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
    const router = useRouter()
   const { 
    data: session
    } = authClient.useSession() 

  return <>
  <div className="flex flex-col items-center justify-center h-screen">
    {session && <p>User: {session.user.name}</p>}
    <Button onClick={() => authClient.signOut({
        fetchOptions:{
            onSuccess: () => {
                router.push("/sign-in")
            }
        }
    })}>Sign Out</Button>
  </div>
  </>
}