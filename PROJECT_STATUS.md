---
status: in-development
progress: 15
version: "0.1.0"
tags: [nextjs, email, editor, eml]
scope: "Browser-Tool zum visuellen Öffnen, Inspizieren und Bearbeiten von EML-Dateien (HTML-E-Mails)"
last_updated: "2026-08-13"
next_steps:
  - Persistenz: Bearbeitungen in echte HTML-Änderungen an der EML zurückführen und Export/Download bauen
  - EML-Parser robust machen (MIME-Parts, Inline-Bilder, Header-Anzeige)
  - Editier-UX ausbauen: Text-, Bild- und Link-Editing direkt im gerenderten Kontext
  - Docker-Image + Port 2012 im Port-Ring einplanen
---

# Aktueller Stand
- Next.js 16 App-Router-Grundgerüst läuft, shadcn/ui + Zustand eingerichtet
- EML-Datei per Drag&Drop laden, HTML-Body wird gerendert (drop-zone, eml-renderer, eml-parser)
- EditorPopover erlaubt rudimentäres Inspizieren/Klicken zum Editieren (Zustand in editor-store)
- Nur 2 Commits, README noch Starter-Standard, kein Docker-Setup, keine Tests
- Änderungen noch nicht in Datei zurückgeschrieben, reines Vorschau-Stadium
