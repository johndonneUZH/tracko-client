import { LoginForm } from "@/components/ui/login-form"
import { cn } from "@/lib/utils";
import { DotPattern } from "../../components/magicui/dot-pattern";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <DotPattern
        glow={true}
        className={cn("[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] absolute inset-0")}
      />
      <div className="w-full max-w-sm relative">
        <LoginForm/>
      </div>
    </div>
  )
}
