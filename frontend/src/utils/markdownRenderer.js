// Custom Markdown Parser - No External Dependencies
// Simple and lightweight markdown parser for chat messages

// Escape HTML characters
const escapeHtml = text => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };
  
  // Simple code formatting - just escape HTML and show as-is
  const formatCode = code => {
    return escapeHtml(code);
  };
  
  // Parse markdown text to HTML
  const parseMarkdown = text => {
    if (!text) return '';
  
    let html = escapeHtml(text);
  
    // Headers (### Header)
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-base font-semibold mb-2 text-gray-700">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-lg font-semibold mb-3 text-gray-800">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-xl font-bold mb-4 text-gray-800">$1</h1>'
    );
  
    // Bold text (**text** or __text__)
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-gray-800">$1</strong>'
    );
    html = html.replace(
      /__(.*?)__/g,
      '<strong class="font-semibold text-gray-800">$1</strong>'
    );
  
    // Italic text (*text* or _text_)
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-700">$1</em>');
  
    // Code blocks (```language)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || '';
      // Show AI's code exactly as it is, just escape HTML for security
      const cleanCode = formatCode(code.trim());
      return `<div class="my-3"><pre class="bg-gray-900  p-3 rounded-lg overflow-x-auto text-xs font-mono"><code class="language-${language} ">${cleanCode}</code></pre></div>`;
    });
  
    // Inline code (`code`)
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-blue-600">$1</code>'
    );
  
    // Blockquotes (> text)
    html = html.replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-blue-500 pl-4 my-3 italic text-gray-600">$1</blockquote>'
    );
  
    // Unordered lists (- item or * item)
    html = html.replace(
      /^[\s]*[-*] (.*$)/gim,
      '<li class="text-sm text-gray-700">$1</li>'
    );
    html = html.replace(
      /(<li class="text-sm text-gray-700">.*<\/li>)/gs,
      '<ul class="mb-3 ml-4 space-y-1">$1</ul>'
    );
  
    // Ordered lists (1. item)
    html = html.replace(
      /^[\s]*\d+\. (.*$)/gim,
      '<li class="text-sm text-gray-700">$1</li>'
    );
    html = html.replace(
      /(<li class="text-sm text-gray-700">.*<\/li>)/gs,
      '<ol class="mb-3 ml-4 space-y-1 list-decimal">$1</ol>'
    );
  
    // Links [text](url)
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  
    // Line breaks (double space + newline)
    html = html.replace(/  \n/g, '<br>');
  
    // Paragraphs (wrap text in paragraphs)
    html = html.replace(
      /^(?!<[h1-6]|<ul|<ol|<blockquote|<pre|<div)(.*)$/gim,
      '<p class="mb-3 text-sm leading-relaxed ">$1</p>'
    );
  
    // Clean up empty paragraphs
    html = html.replace(
      /<p class="mb-3 text-sm leading-relaxed text-gray-700"><\/p>/g,
      ''
    );
  
    // Clean up nested paragraphs
    html = html.replace(
      /<p class="mb-3 text-sm leading-relaxed text-gray-700">(<[^>]+>.*<\/[^>]+>)<\/p>/g,
      '$1'
    );
  
    return html;
  };
  
  // Function to render markdown to HTML
  export const renderMarkdown = markdownText => {
    if (!markdownText) return '';
  
    try {
      return parseMarkdown(markdownText);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return escapeHtml(markdownText); // Fallback to escaped text
    }
  };
  
  // Function to render markdown with custom styling
  export const renderMarkdownWithStyles = markdownText => {
    const html = renderMarkdown(markdownText);
  
    // Wrap in a container with custom styles
    return `<div class="prose prose-sm max-w-none">${html}</div>`;
  };
  