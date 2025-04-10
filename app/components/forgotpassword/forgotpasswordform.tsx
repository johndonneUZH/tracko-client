"use client";

import emailjs from 'emailjs-com';
import { useRouter } from "next/navigation";
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
import { useState } from "react";
import { ApiService } from "@/api/apiService";
import { generateUUID } from '@/utils/uuid';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const apiService = new ApiService();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sendOTPEmail = (otp: string, time: string, email: string ) => { //limited to 200 email per month (free)
    const templateParams = {
      to_email: email,
      otp: otp, 
      time: time,
    };
  
    emailjs.send('service_r6ro5ll', 'template_wto094l', templateParams, 'lO_gHOhcpjg1xZ_09')
      .then(response => {
        console.log('Success!', response.status, response.text);
      })
      .catch(err => {
        console.error('Failed...', err);
      });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();  
    setError(null);
    setSuccessMessage(null);
  

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
  
    /*try {
      // Make an API request to check if the email exists in the database
      const response = await apiService.get(`/auth/check-email/${email}`); //TODO: Implement in backend, this shall return email
      
      // If the email exists, proceed with sending a reset password email
      if (response.data.exists) {
        setSuccessMessage("An email has been sent with password reset instructions.");*/
        const now = new Date();
        const expiryTime = new Date(now.getTime() + 15 * 60000); // add 15 minutes (15 * 60 * 1000 ms)
        const time = expiryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const otp = generateUUID().trim().substring(0, 6); // Generate a 6-digit OTP


       /* sendOTPEmail(email, otp, time); 

       apiService.put("/otp") //TODO: set isBlocked to true
        
        router.push("/login"); 
      } else {
        setError("This email address is not associated with any account.");
      }
    } catch (error) {
      setError("An error occurred while checking the email. Please try again later.");
    }*/
  };
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address below to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              {successMessage && (
                <div className="text-green-500 text-sm text-center">{successMessage}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <InteractiveHoverButton type="submit">
                Reset Password
              </InteractiveHoverButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
