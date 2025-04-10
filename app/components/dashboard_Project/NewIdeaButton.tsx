"use client";

import { Button } from '@components/commons/button'
import { Plus } from "lucide-react"

interface NewIdeaButtonProps {
  onClick: () => void;
}

export default function NewIdeaButton({ onClick }: NewIdeaButtonProps) {
  return (
    <Button className="p-3 text-white rounded-lg shadow-lg" onClick={onClick}>
      <Plus/> Add Idea
    </Button>
  );
}
