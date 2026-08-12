import { create } from "zustand"

export interface TargetRect {
  x: number
  y: number
  width: number
  height: number
}

export interface EditTarget {
  rect: TargetRect
  tagName: string
  textContent: string
  editId: string
}

export interface EditorState {
  html: string | null
  fileName: string | null
  editTarget: EditTarget | null
  iframeEl: HTMLIFrameElement | null

  setHtml: (html: string) => void
  setFileName: (name: string) => void
  setEditTarget: (target: EditTarget | null) => void
  setIframeEl: (el: HTMLIFrameElement | null) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  html: null,
  fileName: null,
  editTarget: null,
  iframeEl: null,

  setHtml: (html) => set({ html, editTarget: null }),
  setFileName: (fileName) => set({ fileName }),
  setEditTarget: (editTarget) => set({ editTarget }),
  setIframeEl: (iframeEl) => set({ iframeEl }),
  reset: () => set({ html: null, fileName: null, editTarget: null }),
}))
