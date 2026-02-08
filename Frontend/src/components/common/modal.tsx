"use client"

import React from "react"
import * as ReactModule from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface PrimaryModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function PrimaryModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: PrimaryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-md p-0 overflow-hidden border-none rounded-2xl shadow-2xl gap-0", className)}>
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
