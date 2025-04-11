"use client"

import { useState, useEffect } from 'react'

export function useProject() {
  const [projectId, setProjectId] = useState<string>("")

  // Initialize from sessionStorage
  useEffect(() => {
    const id = sessionStorage.getItem("projectId") || ""
    setProjectId(id)
  }, [])

  // Update both state and sessionStorage
  const updateProjectId = (newId: string) => {
    sessionStorage.setItem("projectId", newId)
    setProjectId(newId)
    // Dispatch custom event for same-tab listeners
    window.dispatchEvent(new CustomEvent('projectChanged', { detail: newId }))
  }

  // Listen for changes (both cross-tab and same-tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "projectId") {
        setProjectId(e.newValue || "")
      }
    }

    const handleCustomEvent = (e: CustomEvent) => {
      setProjectId(e.detail)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('projectChanged', handleCustomEvent as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('projectChanged', handleCustomEvent as EventListener)
    }
  }, [])

  return { projectId, updateProjectId }
}