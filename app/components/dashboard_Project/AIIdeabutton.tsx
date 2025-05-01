"use client";

import { Button } from "@components/commons/button";
import { Sparkles } from "lucide-react";

interface AiIdeaButtonProps {
  onClick: () => void;
}

export default function AiIdeaButton({ onClick }: AiIdeaButtonProps) {
  return (
    <Button className="p-3 text-white rounded-lg shadow-lg" onClick={onClick}>
      <Sparkles /> AI
    </Button>
  );
}
