// Custom Markdown Parser - No External Dependencies
// Simple and lightweight markdown parser for chat messages

// Escape HTML characters
const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
  
  // Simple syntax highlighting for common languages
  const highlightCode = (code, language = '') => {
    const lang = language.toLowerCase()
    
    // Basic syntax highlighting patterns with proper colors for dark background
    const patterns = {
      javascript: [
        { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|require|exports|console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|fetch|localStorage|sessionStorage)\b/g, class: 'text-blue-300' },
        { regex: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, class: 'text-green-300' },
        { regex: /\/\/.*$/gm, class: 'text-gray-400' },
        { regex: /\/\*[\s\S]*?\*\//g, class: 'text-gray-400' },
        { regex: /\b(\d+\.?\d*)\b/g, class: 'text-yellow-300' },
        { regex: /[{}();,]/g, class: 'text-gray-300' },
        { regex: /[+\-*/%=<>!&|^~]/g, class: 'text-purple-300' }
      ],
      python: [
        { regex: /\b(def|class|import|from|return|if|else|elif|for|while|try|except|finally|with|as|lambda|yield|global|nonlocal|and|or|not|in|is|True|False|None|print|len|str|int|float|list|dict|tuple|set|range|enumerate|zip|map|filter|sorted|reversed|open|with|as|pass|break|continue|raise|assert|del|exec|eval)\b/g, class: 'text-blue-300' },
        { regex: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, class: 'text-green-300' },
        { regex: /#.*$/gm, class: 'text-gray-400' },
        { regex: /\b(\d+\.?\d*)\b/g, class: 'text-yellow-300' },
        { regex: /[{}();,]/g, class: 'text-gray-300' },
        { regex: /[+\-*/%=<>!&|^~]/g, class: 'text-purple-300' }
      ],
      java: [
        { regex: /\b(public|private|protected|static|final|class|interface|extends|implements|import|package|return|if|else|for|while|try|catch|finally|new|this|super|abstract|native|synchronized|transient|volatile|strictfp|assert|break|continue|do|goto|switch|case|default|throw|throws|enum|instanceof|void|boolean|byte|char|short|int|long|float|double|String|Object|System|out|println|print|Scanner|ArrayList|HashMap|List|Map|Set|Collection|Iterator|Exception|RuntimeException|NullPointerException|IllegalArgumentException|ArrayIndexOutOfBoundsException)\b/g, class: 'text-blue-300' },
        { regex: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, class: 'text-green-300' },
        { regex: /\/\/.*$/gm, class: 'text-gray-400' },
        { regex: /\/\*[\s\S]*?\*\//g, class: 'text-gray-400' },
        { regex: /\b(\d+\.?\d*)\b/g, class: 'text-yellow-300' },
        { regex: /[{}();,]/g, class: 'text-gray-300' },
        { regex: /[+\-*/%=<>!&|^~]/g, class: 'text-purple-300' }
      ],
      html: [
        { regex: /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, class: 'text-red-300' },
        { regex: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, class: 'text-green-300' },
        { regex: /(\w+)=/g, class: 'text-yellow-300' },
        { regex: /[{}();,]/g, class: 'text-gray-300' }
      ],
      css: [
        { regex: /([.#]?[a-zA-Z][a-zA-Z0-9]*)\s*\{/g, class: 'text-blue-300' },
        { regex: /([a-zA-Z-]+)\s*:/g, class: 'text-yellow-300' },
        { regex: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, class: 'text-green-300' },
        { regex: /[{}();,]/g, class: 'text-gray-300' },
        { regex: /[+\-*/%=<>!&|^~]/g, class: 'text-purple-300' }
      ],
      jsx: [
        { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|require|exports|console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|fetch|localStorage|sessionStorage|useState|useEffect|useContext|useReducer|useMemo|useCallback|useRef|useLayoutEffect|useImperativeHandle|useDebugValue|React|Component|Fragment|createElement|cloneElement|isValidElement|Children|PropTypes|createContext|forwardRef|memo|lazy|Suspense|StrictMode|Profiler|createPortal|createRef|createElement|cloneElement|isValidElement|Children|PropTypes|createContext|forwardRef|memo|lazy|Suspense|StrictMode|Profiler|createPortal|createRef)\b/g, class: 'text-blue-300' },
        { regex: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, class: 'text-green-300' },
        { regex: /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, class: 'text-red-300' },
        { regex: /(\w+)=/g, class: 'text-yellow-300' },
        { regex: /\/\/.*$/gm, class: 'text-gray-400' },
        { regex: /[{}();,]/g, class: 'text-gray-300' },
        { regex: /[+\-*/%=<>!&|^~]/g, class: 'text-purple-300' }
      ]
    }
    
    let highlighted = escapeHtml(code)
    
    if (patterns[lang]) {
      patterns[lang].forEach(pattern => {
        highlighted = highlighted.replace(pattern.regex, `<span class="${pattern.class}">$&</span>`)
      })
    } else {
      // Default highlighting for unknown languages
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-yellow-300">$&</span>')
      highlighted = highlighted.replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-green-300">$&</span>')
      highlighted = highlighted.replace(/[{}();,]/g, '<span class="text-gray-300">$&</span>')
      highlighted = highlighted.replace(/[+\-*/%=<>!&|^~]/g, '<span class="text-purple-300">$&</span>')
    }
    
    // Ensure all remaining unhighlighted text is light colored
    // This is a simpler approach that wraps any text not already in spans
    const lines = highlighted.split('\n')
    const processedLines = lines.map(line => {
      // If line doesn't contain any spans, wrap the whole line
      if (!line.includes('<span')) {
        return line.replace(/([^\s<>]+)/g, '<span class="text-gray-200">$1</span>')
      }
      return line
    })
    
    return processedLines.join('\n')
  }
  
  // Parse markdown text to HTML
  const parseMarkdown = (text) => {
    if (!text) return ''
    
    let html = escapeHtml(text)
    
    // Headers (### Header)
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold mb-2 text-gray-700">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold mb-3 text-gray-800">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mb-4 text-gray-800">$1</h1>')
    
    // Bold text (**text** or __text__)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    html = html.replace(/__(.*?)__/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    
    // Italic text (*text* or _text_)
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-700">$1</em>')
    
    // Code blocks (```language)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || ''
      const highlightedCode = highlightCode(code.trim(), language)
      return `<div class="my-3"><pre class="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono"><code class="language-${language} text-gray-100">${highlightedCode}</code></pre></div>`
    })
    
    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-blue-600">$1</code>')
    
    // Blockquotes (> text)
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 my-3 italic text-gray-600">$1</blockquote>')
    
    // Unordered lists (- item or * item)
    html = html.replace(/^[\s]*[-*] (.*$)/gim, '<li class="text-sm text-gray-700">$1</li>')
    html = html.replace(/(<li class="text-sm text-gray-700">.*<\/li>)/gs, '<ul class="mb-3 ml-4 space-y-1">$1</ul>')
    
    // Ordered lists (1. item)
    html = html.replace(/^[\s]*\d+\. (.*$)/gim, '<li class="text-sm text-gray-700">$1</li>')
    html = html.replace(/(<li class="text-sm text-gray-700">.*<\/li>)/gs, '<ol class="mb-3 ml-4 space-y-1 list-decimal">$1</ol>')
    
    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Line breaks (double space + newline)
    html = html.replace(/  \n/g, '<br>')
    
    // Paragraphs (wrap text in paragraphs)
    html = html.replace(/^(?!<[h1-6]|<ul|<ol|<blockquote|<pre|<div)(.*)$/gim, '<p class="mb-3 text-sm leading-relaxed text-gray-700">$1</p>')
    
    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-3 text-sm leading-relaxed text-gray-700"><\/p>/g, '')
    
    // Clean up nested paragraphs
    html = html.replace(/<p class="mb-3 text-sm leading-relaxed text-gray-700">(<[^>]+>.*<\/[^>]+>)<\/p>/g, '$1')
    
    return html
  }
  
  // Function to render markdown to HTML
  export const renderMarkdown = (markdownText) => {
    if (!markdownText) return ''
    
    try {
      return parseMarkdown(markdownText)
    } catch (error) {
      console.error('Error rendering markdown:', error)
      return escapeHtml(markdownText) // Fallback to escaped text
    }
  }
  
  // Function to render markdown with custom styling
  export const renderMarkdownWithStyles = (markdownText) => {
    const html = renderMarkdown(markdownText)
    
    // Wrap in a container with custom styles
    return `<div class="prose prose-sm max-w-none">${html}</div>`
  }
  