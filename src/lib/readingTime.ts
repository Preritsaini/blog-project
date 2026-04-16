/**
 * Estimates reading time for a piece of HTML or plain text content.
 * Average adult reading speed: 238 words per minute.
 */
export function readingTime(html: string): string {
  // Strip HTML tags to get plain text
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 238))
  return `${minutes} min read`
}
