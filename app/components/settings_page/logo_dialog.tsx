/* eslint-disable */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/project_browser/dialog"

import {
    Pencil,
  } from "lucide-react"

import { DynamicIcon } from 'lucide-react/dynamic';

interface Props {
    setLogo: (logo: string) => void;
}

export function LogoDialog( { setLogo }: Props ) {
  
  const logos = [
    "university",
    "apple",
    "brain",
    "dna",
    "baggage-claim",
    "banana",
    "accessibility",
    "axe",
    "beef",
    "anchor",
    "amphora",
    "atom",
    "anvil",
    "biceps-flexed",
    "beer",
    "bus",
    "cat",
    "code",
    "egg",
    "credit-card"
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
            className="p-2 absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-green-500 text-white p-1 rounded-full shadow-md hover:bg-green-600"
        >
            <Pencil className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logos</DialogTitle>
          <DialogDescription>
            Select a new logo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(4rem,_1fr))] gap-4 py-4">
            {logos.map((logo) => (
                <DialogClose key={logo} asChild>
                    <button
                    className="flex items-center justify-center"
                    onClick={() => {
                        setLogo(logo);
                    }}
                    >
                    <DynamicIcon
                        className="h-16 w-16 rounded-lg p-2 border text-muted-foreground hover:bg-gray-100"
                        name={(logo || "fileclock") as any}
                    />
                    </button>
              </DialogClose>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
