"use client";

import Image from "next/image";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { setAuthToken } from '../utils/auth';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

export default function Home() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handle form submission and login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // Dummy credentials for testing
      const dummyUsername = "admin";
      const dummyPassword = "password123";

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (formData.username === dummyUsername && formData.password === dummyPassword) {
        // Simulate successful login
        setAuthToken("dummy-token-123");
        setSuccess(true);
        
        // Show success toast
        toast({
          variant: "success",
          title: "Success",
          description: "Login successful! Redirecting to dashboard...",
        });

        // delay before redirecting
        await new Promise(resolve => setTimeout(resolve, 1500));

        // force immediate navigation
        try {
          await router.push("/dashboard");
        } catch (navError) {
          console.error("Navigation failed:", navError);
          // fallback navigation
          window.location.href = "/dashboard";
        }
      } else {
        setError('Invalid username or password');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid username or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during login",
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
            src={theme === 'dark' ? "/HCAHeader-white.png" : "/HCAHeader.png"} 
            alt="HCA Logo" 
            width={50} 
            height={50} 
            className="mr-6" 
          />
          <h1 className="text-2xl font-bold">PSYCALL</h1>
        </div>
        <div className="flex space-x-10 pr-5">
          <Button className="text-2xl font-medium bg-orange-600 text-white px-4 py-2 pb-3 rounded-md hover:bg-orange-400 shadow-md">
            Contact
          </Button>
        </div>
      </header>

      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center bg-blue-950 dark:bg-neutral-800">
        <Card className="p-6 sm:p-10 bg-white dark:bg-neutral-900 shadow-lg rounded-3xl w-full max-w-[400px] mx-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
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
            src={theme === 'dark' ? "/HCAFooter-white.png" : "/HCAFooter.png"} 
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

