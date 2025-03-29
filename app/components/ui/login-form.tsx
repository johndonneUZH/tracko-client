"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  // To be changed with the backend
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // To be updated with Backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const mockUserId = 1;
      sessionStorage.setItem("currentUserId", String(mockUserId));
      sessionStorage.setItem("token", "mock-token");

      router.push(`/users/${mockUserId}/projects`);
    } catch (error) {
      alert("Login failed.");
      console.error(error);
    }
  };

  const handleSignUpClick = () => {
    router.push("/register");
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm hover:underline"
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