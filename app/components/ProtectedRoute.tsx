"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect} from "react";

export default function ProtectedRoute({children}:{children:React.ReactNode}){
  const router = useRouter()
  useEffect(()=>{
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if(!isLoggedIn){
        router.push("/admin/dashboard")
    }
  },[router])
  return (
    <div>
        {children}
    </div>
  )
}