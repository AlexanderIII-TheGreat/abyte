/**
 * Converts markdown content to semantic HTML.
 * Supports headings, paragraphs, code blocks, inline code, bold, italic, lists, links, and blockquotes.
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown
    .trim()
    // Code blocks (fenced)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
      const langAttr = lang ? ` class="language-${lang}"` : ''
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `<pre><code${langAttr}>${escapedCode}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')

  // Process headings
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Process lists
  html = html.replace(/(^- .+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map((item) => `<li>${item.replace(/^- /, '')}</li>`)
      .join('\n')
    return `<ul>\n${items}\n</ul>`
  })

  // Process ordered lists
  html = html.replace(/(^\d+\. .+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map((item) => `<li>${item.replace(/^\d+\. /, '')}</li>`)
      .join('\n')
    return `<ol>\n${items}\n</ol>`
  })

  // Process paragraphs (lines not already wrapped in HTML tags)
  const lines = html.split('\n\n')
  html = lines
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (/^<[a-z]/.test(trimmed)) return trimmed
      return `<p>${trimmed}</p>`
    })
    .join('\n\n')

  return html
}
