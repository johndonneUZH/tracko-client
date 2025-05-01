/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Pencil } from "lucide-react"

import { Input } from "@/components/commons/input"
import { Button } from "@/components/commons/button"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { ApiService } from "@/api/apiService"
import { User } from "@/types/user"
import { toast } from "sonner"

const FormSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  birthday: z.date().optional(),
  email: z.string().email().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword
  }
  return true
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})


export function EditProfileDialog({ onProfileUpdated }: { onProfileUpdated: () => void }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const apiService = new ApiService()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      birthday: undefined,
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  })
  

  useEffect(() => {
    const fetchUser = async () => {
      const userId = sessionStorage.getItem("userId")
      if (!userId) {
        console.error("User ID not found in session storage.")
        return
      }

      const fetchedUser = await apiService.getUser(userId) as User
      setUser(fetchedUser)

      form.reset({
        name: fetchedUser.name || "",
        username: fetchedUser.username || "",
        birthday: fetchedUser.birthday ? new Date(fetchedUser.birthday) : undefined,
        email: fetchedUser.email || "",
        newPassword: "",
        confirmPassword: "",
      })
      

      setLoading(false)
    }

    fetchUser()
  }, [form])

  const handleSave = async (data: z.infer<typeof FormSchema>) => {
    if (!user) return

    const cleanedData: Record<string, any> = {}

    if (data.name?.trim() && data.name !== user.name) cleanedData.name = data.name
    if (data.username?.trim() && data.username !== user.username) cleanedData.username = data.username
    if (data.email?.trim() && data.email !== user.email) cleanedData.email = data.email
    if (data.newPassword?.trim()) cleanedData.password = data.newPassword


    const birthdayChanged =
      data.birthday instanceof Date &&
      !isNaN(data.birthday.getTime()) &&
      (!user.birthday || new Date(user.birthday).toISOString() !== data.birthday.toISOString())

    if (birthdayChanged) {
      cleanedData.birthday = data.birthday
    }

    if (Object.keys(cleanedData).length === 0) {
      console.log("No changes detected.")
      return
    }
    
    const userId = sessionStorage.getItem("userId")
    if (!userId) {
      console.error("User ID is null or undefined.")
      return
    }

    try {
      await apiService.updateUser(userId, cleanedData)
      await onProfileUpdated();
      toast.success("Profile updated successfully.")
    }
    catch (error) {
      console.error("Error updating user:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred while updating the profile."
      toast.error(errorMessage)
      return
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information.</DialogDescription>
        </DialogHeader>
  
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthday</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value instanceof Date && !isNaN(field.value.getTime())
                          ? format(field.value, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) => {
                        const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                        if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                          field.onChange(selectedDate);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
  
}
