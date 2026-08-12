"use client"

import { useCallback, useRef, useState } from "react"
import { X, Pencil, ImageIcon } from "lucide-react"
import { useEditorStore } from "@/store/editor-store"

export default function EditorPopover() {
  const editTarget = useEditorStore((s) => s.editTarget)
  const setEditTarget = useEditorStore((s) => s.setEditTarget)
  const iframeEl = useEditorStore((s) => s.iframeEl)
  const [value, setValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setEditTarget(null)
    if (iframeEl?.contentWindow) {
      iframeEl.contentWindow.postMessage({ type: "clearHover" }, "*")
    }
  }, [setEditTarget, iframeEl])

  const handleTextChange = useCallback(
    (text: string) => {
      setValue(text)
      if (iframeEl?.contentWindow && editTarget) {
        iframeEl.contentWindow.postMessage(
          { type: "updateText", editId: editTarget.editId, text },
          "*"
        )
      }
    },
    [iframeEl, editTarget]
  )

  const handleImageSwap = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !iframeEl?.contentWindow || !editTarget) return
      const url = URL.createObjectURL(file)
      iframeEl.contentWindow.postMessage(
        { type: "updateImage", editId: editTarget.editId, src: url },
        "*"
      )
      setEditTarget(null)
    },
    [iframeEl, editTarget, setEditTarget]
  )

  if (!editTarget) return null

  const isImage = editTarget.tagName === "img"

  const style: React.CSSProperties = (() => {
    if (!iframeEl) return { display: "none" }
    const iframeRect = iframeEl.getBoundingClientRect()
    const r = editTarget.rect
    const top = iframeRect.top + r.y + r.height + 8
    const left = Math.max(0, iframeRect.left + r.x + r.width / 2)
    return {
      position: "fixed",
      top,
      left,
      transform: "translateX(-50%)",
      zIndex: 50,
    }
  })()

  if (isImage) {
    return (
      <div
        style={style}
        className="flex items-center gap-2 rounded-lg border bg-white p-3 shadow-lg"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />
        <button
          className="inline-flex h-7 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
          onClick={handleImageSwap}
        >
          <ImageIcon className="size-3.5" />
          Swap Image
        </button>
        <button
          className="inline-flex items-center justify-center rounded-lg p-1 hover:bg-muted size-7"
          onClick={handleClose}
        >
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      style={style}
      className="flex items-center gap-2 rounded-lg border bg-white p-2 shadow-lg"
    >
      <Pencil className="size-3.5 text-muted-foreground shrink-0" />
      <input
        className="h-7 w-64 min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        value={value}
        placeholder={editTarget.textContent.slice(0, 40)}
        onChange={(e) => handleTextChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClose()
        }}
        autoFocus
      />
      <button
        className="inline-flex items-center justify-center rounded-lg p-1 hover:bg-muted size-7"
        onClick={handleClose}
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
