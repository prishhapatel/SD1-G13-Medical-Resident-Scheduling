"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useRouter } from "next/navigation";
import { setAuthToken } from '../lib/auth';
import { useToast } from '../lib/use-toast';
import { Toaster } from '../components/ui/toaster';
import { config } from '../config';
import { useAuth } from "../context/AuthContext";

// Type assertion workaround for React hooks
const useState = React.useState;


export default function Home() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handle form submission and login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt with email:', formData.email);
    setIsLoading(true);

    try {
      console.log('Sending login request to:', `${config.apiUrl}/api/auth/login`);
      const response = await fetch(`${config.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Login response status:', response.status);
      console.log('Login response data:', { ...data, token: data.token ? '[REDACTED]' : null });

      if (response.ok) {
        setAuthToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.resident));
        setUser(data.resident);
        
        console.log('Login successful, user data:', data.resident); // Debug: Check what user data contains
        console.log('Is admin?', data.resident?.isAdmin); // Debug: Check admin status
      
        toast({
          variant: "success",
          title: "Success",
          description: "Login successful! Redirecting to dashboard...",
        });
      
        await new Promise(resolve => setTimeout(resolve, 1500));
      
        try {
          await router.push("/dashboard");
        } catch {
          window.location.href = "/dashboard";
        }
      }else {
        console.log('Login failed:', data.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Invalid username or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Provide more specific error messages for different types of failures
      let errorMessage = "An error occurred during login. Please try again later.";
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        console.error("Network error - API server may be unreachable at:", config.apiUrl);
      } else if (error instanceof Error) {
        errorMessage = `Connection error: ${error.message}`;
      }
      
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      {/* Header */}
      <header className="bg-gray-100 dark:bg-neutral-900 text-black dark:text-white p-5 flex items-center justify-between border-b border-gray-300 dark:border-gray-700 shadow-lg">
        <div className="flex items-center">
          <Image 
            src="/HCAHeader.png" 
            alt="HCA Logo" 
            width={50} 
            height={50} 
            className="mr-6" 
          />
          <h1 className="text-2xl font-bold">PSYCALL</h1>
        </div>
      </header>

      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center bg-blue-950 dark:bg-neutral-800">
        <Card className="p-6 sm:p-10 bg-white dark:bg-neutral-900 shadow-lg rounded-3xl w-full max-w-[400px] mx-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-500 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-black dark:text-white bg-white dark:bg-neutral-800"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="mt-1 block w-full px-3 py-2 border border-gray-500 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-black dark:text-white bg-white dark:bg-neutral-800"
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-neutral-900 text-black dark:text-white p-2 text-center border-t border-gray-300 dark:border-gray-700 shadow-lg">
        <div className="flex justify-center items-center space-x-6 mb-1">
          <Image src="/UCF-College-of-Medicine-Footer.png" alt="UCF Footer Logo" width={150} height={75} className="object-contain" />
          <div className="h-16 w-px bg-gray-400 dark:bg-gray-700" />
          <Image 
            src="/HCAFooter.png" 
            alt="HCA Footer Logo" 
            width={150} 
            height={75} 
            className="object-contain" 
          />
        </div>
        <p className="text-sm">&copy; 2025 PSYCALL. All rights reserved.</p>
      </footer>
    </div>
  );
}

