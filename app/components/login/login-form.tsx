"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/commons/card";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { InteractiveHoverButton } from "@/components/commons/interactive-hover-button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiService } from "@/api/apiService";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const apiService = new ApiService();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
  
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }
  
    try {
      const response = await apiService.rawPost("/auth/login", {
        username,
        password,
      });

      const token = response.headers.get("Authorization");
      const userId = response.headers.get("Userid");
  
      if (!token || !userId) {
        throw new Error("Missing token or userId in response headers");
      }
  
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("token", token);
      
      router.push(`/users/${userId}`);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error(error);
    }
  };
  

  const handleSignUpClick = () => {
    router.push("/register");
  };

  const handleForgotPasswordClick = () => {
    router.push("/forgotpassword");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="KingYoussef"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    className="ml-auto inline-block text-sm hover:underline cursor-pointer"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <InteractiveHoverButton type="submit">
                Login
              </InteractiveHoverButton>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={handleSignUpClick}
                type="button"
                className="underline underline-offset-4 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
