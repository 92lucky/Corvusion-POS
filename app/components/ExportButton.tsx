"use client"

import { Button } from "@/components/ui/button"

type Props = {
  onClick: () => void
}

export default function ExportButton({
  onClick,
}: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={onClick}
    >
      Export CSV
    </Button>
  )
}
