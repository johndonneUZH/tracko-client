/* eslint-disable*/
"use client"

import { useSearchParams } from "next/navigation"
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
import { ApiService } from "@/api/apiService";

export default function InputOTPDemo() {
  const apiService = new ApiService();
  const expectedCode = "123456"
  const [email, setEmail] = useState("");

useEffect(() => {
  const storedEmail = sessionStorage.getItem("email");
  if (storedEmail) {
    setEmail(storedEmail);
  }
}, []);

  //const expectedCode = await apiService.get
  const [enteredCode, setEnteredCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (enteredCode.length === 6) {
      if (enteredCode === expectedCode) {
        setStatus("success");
        // Special Post Request to verify the code instead of changing password to otp in database and then redirect to change password page
      } else {
        setStatus("error");
      }
    } else {
      setStatus("idle");
    }
  }, [enteredCode, expectedCode]);

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
            <p className="text-green-600 font-medium">✅ Code verified successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 font-medium">❌ Incorrect code. Please try again.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
