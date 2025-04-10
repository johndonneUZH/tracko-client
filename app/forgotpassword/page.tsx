import { ForgotPasswordForm } from "@/components/forgotpassword/forgotpasswordform";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm relative">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
