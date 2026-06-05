"use client"
import { api } from "@/api"
import { ACCESS_TOKEN } from "@/context/context"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import LoadingState from "./LoadingState"

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null)
    const router = useRouter()

    const refreshToken = useCallback(async () => {
        try {
            
            const refreshStr = localStorage.getItem("REFRESH_TOKEN") 
            
            if (!refreshStr) {
                setIsAuthorized(false)
                return
            }

            const res = await api.post('user/token/refresh/', {
                refresh: refreshStr
            })

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.error("Token refresh failed:", error)
            setIsAuthorized(false)
        }
    }, [])

    const auth = useCallback(async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN)

            if (!token) {
                setIsAuthorized(false)
                return
            }

            const decodedToken = jwtDecode(token)
            const tokenExpiration = decodedToken.exp 
            const nowInSeconds = Date.now() / 1000   

            if (tokenExpiration < nowInSeconds) {
                
                await refreshToken()
            } else {
                
                setIsAuthorized(true)
            }

        } catch (error) {
            console.error("Auth verification failed:", error)
            setIsAuthorized(false)
        }
    }, [refreshToken])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        auth()
    }, [auth])

    // Handle redirection safely via useEffect when authorization drops to false
    useEffect(() => {
        if (isAuthorized === false) {
            router.replace('/login')
        }
    }, [isAuthorized, router])

    
    if (isAuthorized === null) {
        return (
            <div className="p-8 text-center font-medium text-gray-500">
                <LoadingState message="Loading..."/>
            </div>
        )
    }


    return isAuthorized ? children : null
}

export default ProtectedRoute