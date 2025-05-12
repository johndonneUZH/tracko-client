/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/commons/card"
import { ApiService } from "@/api/apiService"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function InputOTPDemo() {
  const apiService = new ApiService();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedUsername = sessionStorage.getItem("username");
    if (storedEmail) setEmail(storedEmail);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const verifyAndLogin = async () => {
      try {
        const response = await apiService.rawPost("/auth/login", {
          username,
          password: enteredCode,
        });

        const token = response.headers.get("Authorization");
        const userId = response.headers.get("Userid");

        if (!token || !userId) {
          throw new Error("Missing token or userId in response headers");
        }

        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("token", token);

        toast.success("Loin successful! Reset your password now.");
        setStatus("success");
        router.push(`/users/${userId}`);
      } catch (error) {
        console.error("Login failed:", error);
        setStatus("error");
      }
    };

    if (enteredCode.length === 6) {
      setStatus("idle");
      verifyAndLogin();
    }
  }, [enteredCode, username, apiService, router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
          <CardDescription>
            {email ? (
              <>
                We’ve sent a 6-digit code to <span className="font-bold">{email}</span>. Please enter it below to verify your identity and proceed.
              </>
            ) : (
              "We’ve sent a 6-digit code to your email address. Please enter it below to verify your identity and proceed."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            autoFocus
            onChange={(value) => setEnteredCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {status === "success" && (
            <p className="text-green-600 font-medium"></p>
          )}
          {status === "error" && (
            <p className="text-red-600 font-medium">❌ Login failed. Please check the code and try again.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
