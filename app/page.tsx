"use client"; // Disables SSR for interactive components
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DotPattern } from "../components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen relative">
      <DotPattern
        glow={true}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] absolute inset-0"
        )}
      />
      <Card className="relative p-10 shadow-lg rounded-lg">
        <div className="absolute inset-0 bg-white rounded-lg z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold lg:text-5xl mb-2">
            Tracko
          </h1>
          <h3 className="text-2xl font-bold min-w-auto mb-2">
            Your tool to discover, plan and develop
          </h3>
          <h3 className="text-2xl font-bold min-w-auto mb-10">
            the big ideas
          </h3>
          <div className="gap-2">
            <Button className="w-auto min-w-40 mx-5 py-3" onClick= {()=>router.push("/login")}>Login</Button>
            <Button className="w-auto min-w-40 mx-5 py-3" variant="outline" onClick= {()=>router.push("/register")}>Sign up</Button>  
          </div>
        </div>
      </Card>
    </div>
  );
}