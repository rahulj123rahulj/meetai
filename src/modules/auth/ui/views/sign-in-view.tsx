"use client"

import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent } from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";


const formSchema = z.object({
    email:z.email(),
    password:z.string().min(1,"Password is required")
})


export const SignInView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null)
        setIsPending(true)
        authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: "/"
        },
        {
            onSuccess: () => {
                setIsPending(false)
                router.push("/sign-in")
            },
            onError: ({error}) => {

                setError(error?.message ?? "")
                console.log(error)
            },
            onResponse() {
                setIsPending(false)
            },
        })
    }

    const onSocial = (provider: "google" | "github") =>{
        authClient.signIn.social({
            provider: provider,
            callbackURL: "/"
        },{
            onError: ({error}) => {

                setError(error?.message ?? "")
                console.log(error)
            },
            onResponse() {
                setIsPending(false)
            },
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="p-0 overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        
                        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                                    <p className="text-muted-foreground">Login to your account</p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => {
                                            return <>
                                                <FormItem >
                                                    <FormLabel> Email </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="abc@example.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            </>
                                        }}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => {
                                            return <>
                                                <FormItem >
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="********"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            </>
                                        }}
                                    />
                                   
                                </div>
                                {
                                    !!error && <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="text-destructive! w-4 h-4" />
                                        <p className="text-destructive text-sm">{error}</p>
                                    </Alert>
                                }
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full">
                                    Login
                                </Button>
                                <div className="relative flex items-center justify-center text-muted-foreground">
                                    <span className="relative z-10 bg-background px-2">
                                        Or continue with
                                    </span>

                                    <span className="absolute left-0 z-0 top-1/2 w-full border-t text-muted-foreground" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        disabled={isPending}
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={()=>{onSocial("google")}}  
                                        >
                                        <FaGoogle/>
                                        Google
                                    </Button>
                                    <Button
                                        disabled={isPending}
                                        type="button"
                                        variant={"outline"}
                                        className="w-full"
                                        onClick={()=>{onSocial("github")}}  
                                        >
                                        <FaGithub/>
                                        Github
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    <p className="text-muted-foreground">Don&apos;t have an account? <Link href="/sign-up" className="text-primary underline">Sign Up</Link></p>
                                </div>
                            </div>
                            

                            
                        </form>
                    </Form>

                    <div className="bg-radial from-green-700  to-green-900 py-4 hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src={"logo.svg"} alt="logo" className="w-23 h-23" />
                        <p className="text-2xl font-semibold text-white"> Meet.AI</p>
                    </div>

                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]**:underline *:[a]**:underline-offset-4">
                <p>By continuing, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link></p>
            </div> 

        </div>
    )
}