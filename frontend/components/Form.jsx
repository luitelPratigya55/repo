'use client'
import { api } from "@/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/context/context";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Form = ({ methodName }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // 1. Mark the submission handler as async
    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)

        if (methodName === "login") {
            try {
                
                const res = await api.post("user/login/", { username, password })

                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)

                
                router.push("/")
            } catch (error) {
                console.error("Login failed:", error)
                alert("Invalid credentials, please try again.")
            } finally {
                setIsLoading(false)
            }
        } else {
            try {
                
                const res = await api.post('user/register/', { username, password })

                if (res.status === 201 || res.status === 200) {
                    alert("Registration successful! Redirecting to login...")
                    router.push('/login')
                } else {
                    console.log("Unexpected response status:", res)
                }
            } catch (error) {
                console.error("Registration failed:", error)
                alert("Registration failed. That username might already be taken.")
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 capitalize">{methodName}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    disabled={isLoading}
                    className="w-full border p-2 rounded disabled:bg-gray-100"
                    required
                />
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={isLoading}
                    className="w-full border p-2 rounded disabled:bg-gray-100"
                    required
                />

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                >
                    {isLoading ? "Processing..." : "Submit"}
                </button>
            </form>
        </div>
    )
}

export default Form