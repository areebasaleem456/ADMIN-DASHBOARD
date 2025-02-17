import { useRouter } from "next/navigation";
import React from "react";
import { ReactNode, useEffect, JSX } from "react";

export default function ProtectedRoute({children}:{children:ReactNode}): JSX.Element {
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