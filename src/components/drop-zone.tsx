"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { parseEmlFile } from "@/lib/eml-parser"
import { useEditorStore } from "@/store/editor-store"

export default function DropZone() {
  const setHtml = useEditorStore((s) => s.setHtml)
  const setFileName = useEditorStore((s) => s.setFileName)
  const fileName = useEditorStore((s) => s.fileName)
  const html = useEditorStore((s) => s.html)
  const reset = useEditorStore((s) => s.reset)
  const [isDragOver, setIsDragOver] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFile(file: File) {
    console.log("[DropZone] processing:", file.name)
    try {
      const parsed = await parseEmlFile(file)
      console.log("[DropZone] parsed html:", parsed.html.length, "chars")
      if (!parsed.html) {
        alert("No HTML content found in this EML file.")
        return
      }
      setFileName(file.name)
      setHtml(parsed.html)
      console.log("[DropZone] html set in store, length:", parsed.html.length)
    } catch (err) {
      alert("Failed to parse EML file.")
      console.error("[DropZone] error:", err)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    console.log("[DropZone] fileChange:", file?.name)
    if (file) processFile(file)
  }

  useEffect(() => {
    const el = dropRef.current
    if (!el) return

    function onDragOver(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    }

    function onDragLeave(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
    }

    function onDrop(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      const file = e.dataTransfer?.files[0]
      if (file) processFile(file)
    }

    el.addEventListener("dragover", onDragOver, false)
    el.addEventListener("dragleave", onDragLeave, false)
    el.addEventListener("drop", onDrop, false)

    return () => {
      el.removeEventListener("dragover", onDragOver)
      el.removeEventListener("dragleave", onDragLeave)
      el.removeEventListener("drop", onDrop)
    }
  }, [])

  if (html) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-2.5 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="size-4 text-muted-foreground shrink-0" />
          <span className="truncate">{fileName}</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-1 hover:bg-muted shrink-0"
          onClick={reset}
        >
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div ref={dropRef}>
      <input
        ref={inputRef}
        id="eml-file-input"
        type="file"
        accept=".eml,.EML"
        onChange={handleFileChange}
        hidden
      />
      <label
        htmlFor="eml-file-input"
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
      >
        <Upload className="size-8 text-muted-foreground/50" />
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Drop your .eml file here</p>
          <p className="mt-1">or click to browse</p>
        </div>
      </label>
    </div>
  )
}
