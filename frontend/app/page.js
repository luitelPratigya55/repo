"use client"

import ProtectedRoute from "@/components/ProtectedRoute";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/context/context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  
  const Logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    router.push("/login") 
  }

  const RegisterAndLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    router.replace('/register')
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">HomePage</h1>

      
      <ProtectedRoute>
        <div className="border p-4 rounded bg-gray-50 space-y-2">
          <Link className="cursor-pointer hover:text-blue-600 " href={'/link'} >Links</Link>
        </div>

        <div className="flex space-x-4 mt-6">
        
          <button
            onClick={RegisterAndLogout}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-medium text-sm"
          >
            Register New Account
          </button>

          <button 
            onClick={Logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </ProtectedRoute>
    </div>
  );
}