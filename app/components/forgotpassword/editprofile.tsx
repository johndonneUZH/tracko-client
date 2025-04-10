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

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const apiService = new ApiService();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");

      if (!userId || !token) {
        setError("Unauthorized. Please log in again.");
        return;
      }

      /*await apiService.authPut(
        `/auth/change-password/${userId}`, //TODO: Implement in backend
        { oldPassword, newPassword },
        token
      );*/

      setSuccess("Password successfully changed!");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      setError("Failed to change password. Please check your old password.");
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword}>
            <div className="flex flex-col gap-6">
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-500 text-sm text-center">{success}</div>}
              <div className="grid gap-2">
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <InteractiveHoverButton type="submit">
                Update Password
              </InteractiveHoverButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
