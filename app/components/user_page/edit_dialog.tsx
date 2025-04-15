"use client"
 
import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Pencil } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/commons/input"
import { Button } from "@/components/commons/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/project_browser/dialog"

export function EditProfileDialog() {
  const [name, setName] = useState("Jane Doe")
  const [username, setUsername] = useState("janedoe")
  const [birthday, setBirthday] = useState<Date | undefined>(new Date(2000, 1, 1))

  const handleSave = () => {
    console.log({
      name,
      username,
      birthday,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Birthday</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthday && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(birthday, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthday}
                onSelect={(date) => {
                  if (date instanceof Date) {
                    setBirthday(date)
                  }
                }}
                initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
