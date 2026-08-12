import PostalMime from "postal-mime"

export interface ParsedEml {
  html: string
  text: string
  subject: string
  from: string
  to: string
  date: string
}

export async function parseEmlFile(file: File): Promise<ParsedEml> {
  const buffer = await file.arrayBuffer()
  const parser = new PostalMime()
  const email = await parser.parse(buffer)

  const html =
    typeof email.html === "string"
      ? email.html
      : Array.isArray(email.html)
        ? email.html[0] || ""
        : ""

  const text =
    typeof email.text === "string"
      ? email.text
      : Array.isArray(email.text)
        ? email.text[0] || ""
        : ""

  const firstFrom = Array.isArray(email.from) ? email.from[0] : email.from
  const firstTo = Array.isArray(email.to) ? email.to[0] : email.to

  const fromStr = firstFrom
    ? `${(firstFrom as { name?: string }).name || ""} <${(firstFrom as { address?: string }).address || ""}>`.trim()
    : ""
  const toStr = firstTo
    ? `${(firstTo as { name?: string }).name || ""} <${(firstTo as { address?: string }).address || ""}>`.trim()
    : ""

  return {
    html,
    text,
    subject: email.subject || "",
    from: fromStr,
    to: toStr,
    date: email.date || "",
  }
}
