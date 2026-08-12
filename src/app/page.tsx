"use client"

import DropZone from "@/components/drop-zone"
import EmlRenderer from "@/components/eml-renderer"
import EditorPopover from "@/components/editor-popover"
import { useEditorStore } from "@/store/editor-store"
import { Spline } from "lucide-react"

export default function Home() {
  const html = useEditorStore((s) => s.html)
  const fileName = useEditorStore((s) => s.fileName)

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <Spline className="size-5" />
          <span className="font-semibold text-sm">VisualEdit Hub</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {html ? `Loaded: ${fileName} (${html.length} bytes)` : "Hover to inspect · Click to edit"}
        </span>
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full gap-4">
        <DropZone />

        {html && (
          <div className="flex-1 rounded-xl border bg-white shadow-sm overflow-hidden">
            <EmlRenderer />
          </div>
        )}
        {!html && (
          <div className="text-xs text-muted-foreground text-center">
            html state: {String(html)}
          </div>
        )}
      </main>

      <EditorPopover />
    </div>
  )
}
