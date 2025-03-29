"use client"; // Disables SSR for interactive components
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuroraText } from "../components/magicui/aurora-text";
import { Card } from "@/components/ui/card";
import { Linechart } from "@/components/ui/linechart";
import { Reviews } from "../components/magicui/reviews";
import { ArrowDownOutlined } from "@ant-design/icons";
import { Functions } from "../components/magicui/functions";
import { Numbers } from "../components/magicui/numbers";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center relative">
      <Card className="relative p-10 shadow-lg rounded-lg mt-30 mb-30 justify-center text-center items-center">
        <div className="absolute inset-0 bg-white rounded-lg z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold lg:text-5xl mb-2">
            Tracko
          </h1>
          <h3 className="text-2xl font-bold min-w-auto mb-2">
            Your tool to discover, plan and develop
          </h3>
          <h3 className="text-2xl font-bold min-w-auto mb-10">
            <AuroraText>big ideas</AuroraText>
          </h3>
          <div className="gap-2">
            <Button className="w-auto min-w-40 mx-5 py-3" onClick= {()=>router.push("/login")}>Login</Button>
            <Button className="w-auto min-w-40 mx-5 py-3" variant="outline" onClick= {()=>router.push("/register")}>Sign up</Button>  
          </div>
          <div className="gap-10 mt-20 items-center justify-center text-center">
            <h1>
              Not convinced yet? Take a look at the facts!
            </h1>
            <div className="mt-10">
              <ArrowDownOutlined className="text-3xl text-primary"/>
            </div>
            <h2 className="text-2xl font-bold min-w-auto mt-10 mb-2">Our Key Features</h2>
            <div className="max-w-150 text-left">
              <Functions/>
            </div>
            <Numbers/>
            <h2 className="text-2xl font-bold min-w-auto mt-20">Research has proven our tools effectivity in practice</h2>
            <Linechart/>
            <h2 className="text-2xl font-bold min-w-auto mt-20">Our clients love it!</h2>
            <Reviews/>
          </div>
        </div>
      </Card>
    </div>
  );
}