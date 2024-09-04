'use client'

import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@radix-ui/react-collapsible'
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { Separator } from './separator'

interface CollapsibleMessageProps {
  message: {
    id: string
    isCollapsed?: StreamableValue<boolean>
    component: React.ReactNode
  }
  isLastMessage?: boolean
}

export const CollapsibleMessage: React.FC<CollapsibleMessageProps> = ({
  message,
  isLastMessage = false
}) => {
  const [data] = useStreamableValue(message.isCollapsed)
  const isCollapsed = data ?? false
  const [open, setOpen] = useState(isLastMessage)

  useEffect(() => {
    setOpen(isLastMessage)
  }, [isCollapsed, isLastMessage])

  // if not collapsed, return the component
  if (!isCollapsed) {
    return message.component
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={value => {
        setOpen(value)
      }}
    >
      <CollapsibleTrigger asChild>
        <div
          className={
            'w-full flex justify-end'
          }
        >
          <button
            // variant="ghost"
            // size={'icon'}
            className={'mt-3 rounded-full'}
          >
            <ChevronDownIcon
              className={
                'h-4 w-4 transition-all'
              }
            />
            <span className="sr-only">collapse</span>
          </button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>{message.component}</CollapsibleContent>
      {!open && <Separator className="my-2 bg-muted" />}
    </Collapsible>
  )
}
