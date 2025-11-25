/**
 * Basic markdown-like formatting for messages
 * Supports: **bold**, *italic*, line breaks
 */
export function formatMessage(text: string): string {
  if (!text) return '';

  // Escape HTML to prevent XSS
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Convert **bold** to <strong>
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to <em> (but not if it's part of **bold**)
  formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

/**
 * Simple text search/filter
 */
export function searchMemories(memories: any[], searchTerm: string): any[] {
  if (!searchTerm.trim()) return memories;

  const term = searchTerm.toLowerCase().trim();
  return memories.filter(memory => {
    const message = (memory.message || '').toLowerCase();
    const name = (memory.name || '').toLowerCase();
    const relation = (memory.relation || '').toLowerCase();
    
    return message.includes(term) || 
           name.includes(term) || 
           relation.includes(term);
  });
}

