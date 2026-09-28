"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<{type:"error"|"info";text:string}|null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null); const supabase = createClient();
    try {
      if (mode === "signin") { const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; router.push("/dashboard"); router.refresh(); }
      else { const {data,error}=await supabase.auth.signUp({email,password,options:{data:{name},emailRedirectTo:`${window.location.origin}/auth/callback`}}); if(error) throw error; if(data.session){router.push("/onboarding");router.refresh();} else setMsg({type:"info",text:"Check your email to confirm your account, then sign in."}); }
    } catch(err:any){setMsg({type:"error",text:err?.message??"Something went wrong. Please try again."});} finally{setBusy(false);}
  }
  async function reset(){if(!email){setMsg({type:"error",text:"Enter your email first."});return;} const supabase=createClient(); const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/auth/callback`}); setMsg(error?{type:"error",text:error.message}:{type:"info",text:"Password reset email sent."});}
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"><h1 className="text-2xl font-bold">{mode==="signin"?"Welcome back":"Create your account"}</h1><form onSubmit={submit} className="mt-6 space-y-4">{mode==="signup"&&<div><label htmlFor="name" className="block text-sm font-medium">Name</label><input id="name" required value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"/></div>}<div><label htmlFor="email" className="block text-sm font-medium">Email</label><input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"/></div><div><label htmlFor="password" className="block text-sm font-medium">Password</label><input id="password" type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"/></div>{msg&&<p role="alert" className={`text-sm ${msg.type==="error"?"text-red-600":"text-green-700"}`}>{msg.text}</p>}<button disabled={busy} className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{busy?"Please wait...":mode==="signin"?"Sign in":"Sign up"}</button></form><div className="mt-4 flex justify-between text-sm"><button onClick={()=>{setMode(mode==="signin"?"signup":"signin");setMsg(null)}} className="text-brand-600 hover:underline">{mode==="signin"?"New here? Create an account":"Have an account? Sign in"}</button>{mode==="signin"&&<button onClick={reset} className="text-slate-500 hover:underline">Forgot password?</button>}</div></main>;
}