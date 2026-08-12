"use client"

import { useCallback, useEffect, useRef } from "react"
import { useEditorStore } from "@/store/editor-store"

function buildInteractionScript(): string {
  return `
<script>
(function() {
  var hoveredEl = null;
  var editCounter = 0;

  function isTextElement(el) {
    var tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style') return false;
    var text = (el.textContent || '').trim();
    if (!text) return false;
    var children = el.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, table, ul, ol, li, span, strong, em, b, i, a, img, br, hr');
    if (children.length > 0) return false;
    return true;
  }

  function getEditable(el) {
    while (el && el !== document.body) {
      var tag = el.tagName.toLowerCase();
      if (tag === 'img') return el;
      if (tag === 'a') return null;
      if (isTextElement(el)) return el;
      el = el.parentElement;
    }
    return null;
  }

  document.body.addEventListener('mouseover', function(e) {
    var target = getEditable(e.target);
    if (target === hoveredEl) return;
    if (hoveredEl) hoveredEl.style.outline = '';
    if (target) target.style.outline = '2px dashed #3b82f6';
    hoveredEl = target;
  });

  document.body.addEventListener('mouseout', function(e) {
    var target = getEditable(e.relatedTarget || e.toElement);
    if (!target && hoveredEl) {
      hoveredEl.style.outline = '';
      hoveredEl = null;
    }
  });

  document.body.addEventListener('click', function(e) {
    var target = getEditable(e.target);
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    var rect = target.getBoundingClientRect();
    var id = 'edit-' + (++editCounter);
    target.setAttribute('data-edit-id', id);
    window.parent.postMessage({
      type: 'click',
      tagName: target.tagName.toLowerCase(),
      textContent: (target.textContent || '').trim(),
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      editId: id
    }, '*');
  });

  window.addEventListener('message', function(e) {
    if (!e.data || !e.data.type) return;
    if (e.data.type === 'updateText') {
      var el = document.querySelector('[data-edit-id="' + e.data.editId + '"]');
      if (el) el.textContent = e.data.text;
    }
    if (e.data.type === 'updateImage') {
      var el = document.querySelector('[data-edit-id="' + e.data.editId + '"]');
      if (el && el.tagName === 'IMG') el.src = e.data.src;
    }
    if (e.data.type === 'clearHover') {
      if (hoveredEl) { hoveredEl.style.outline = ''; hoveredEl = null; }
    }
  });
})();
<\/script>`
}

function buildSrcdoc(html: string): string {
  const script = buildInteractionScript()
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin: 0; padding: 0; }
    img { max-width: 100%; }
  </style></head><body>${html}${script}</body></html>`
}



interface EmlRendererProps {
  className?: string
}

export default function EmlRenderer({ className }: EmlRendererProps) {
  const html = useEditorStore((s) => s.html)
  const setEditTarget = useEditorStore((s) => s.setEditTarget)
  const setIframeEl = useEditorStore((s) => s.setIframeEl)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (e.data?.type === "click") {
        setEditTarget({
          rect: e.data.rect,
          tagName: e.data.tagName,
          textContent: e.data.textContent,
          editId: e.data.editId,
        })
      }
    },
    [setEditTarget]
  )

  useEffect(() => {
    console.log("[EmlRenderer] mounted, html length:", html?.length)
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [handleMessage, html])

  useEffect(() => {
    if (iframeRef.current) {
      console.log("[EmlRenderer] iframe ready, setting in store")
      setIframeEl(iframeRef.current)
    }
    return () => setIframeEl(null)
  }, [setIframeEl, html])

  if (!html) {
    console.log("[EmlRenderer] no html, returning null")
    return null
  }

  const srcdoc = buildSrcdoc(html)
  console.log("[EmlRenderer] rendering iframe, srcdoc length:", srcdoc.length)

  return (
    <div className={className}>
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        title="EML Preview"
        className="w-full border-0 bg-white"
        style={{ minHeight: "80vh" }}
      />
    </div>
  )
}
