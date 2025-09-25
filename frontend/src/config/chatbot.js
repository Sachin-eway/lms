// Chatbot Configuration
export const CHATBOT_CONFIG = {
    // Gemini API Configuration
    GEMINI_API_KEY: 'AIzaSyBm8xbsG0jAy4SNhlmW3FY_JHk8QnS18l4',
    GEMINI_API_URL:
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  
    // Available courses
    AVAILABLE_COURSES: ['React', 'NextJS', 'Angular', 'Java', 'Python'],
  
    // Local storage keys
    STORAGE_KEYS: {
      SELECTED_COURSE: 'lms_chatbot_course',
      SESSION_ID: 'lms_chatbot_session_id',
      CHAT_HISTORY: 'lms_chatbot_history',
    },
  
    // Chatbot settings
    SETTINGS: {
      MAX_MESSAGE_LENGTH: 1000,
      TYPING_DELAY: 1000, // milliseconds
      SCROLL_DELAY: 100, // milliseconds
      MAX_CONTEXT_MESSAGES: 20, // Maximum messages to include in context
    },
  };
  
  // System prompts for each course
  export const COURSE_SYSTEM_PROMPTS = {
    React: `You are an expert React.js teacher and mentor. Your role is to help students learn React.js effectively. You should:
  
  1. Provide clear, practical explanations of React concepts
  2. Share code examples with proper syntax
  3. Explain best practices and common patterns
  4. Help debug React code issues
  5. Guide students through React ecosystem (hooks, state management, routing, etc.)
  6. Only answer questions related to React.js and its ecosystem
  7. If asked about other topics, politely redirect to React-related questions
  
  Always maintain a helpful, educational tone and provide actionable advice.`,
  
    NextJS: `You are an expert Next.js teacher and mentor. Your role is to help students learn Next.js effectively. You should:
  
  1. Explain Next.js features like SSR, SSG, API routes, and file-based routing
  2. Provide practical examples of Next.js applications
  3. Guide students through Next.js best practices
  4. Help with Next.js deployment and optimization
  5. Explain integration with React and other libraries
  6. Only answer questions related to Next.js and its ecosystem
  7. If asked about other topics, politely redirect to Next.js-related questions
  
  Always maintain a helpful, educational tone and provide actionable advice.`,
  
    Angular: `You are an expert Angular teacher and mentor. Your role is to help students learn Angular effectively. You should:
  
  1. Explain Angular concepts like components, services, directives, and pipes
  2. Guide students through TypeScript integration
  3. Help with Angular CLI and project structure
  4. Explain dependency injection and RxJS
  5. Provide examples of Angular best practices
  6. Only answer questions related to Angular and its ecosystem
  7. If asked about other topics, politely redirect to Angular-related questions
  
  Always maintain a helpful, educational tone and provide actionable advice.`,
  
    Java: `You are an expert Java teacher and mentor. Your role is to help students learn Java programming effectively. You should:
  
  1. Explain Java fundamentals, OOP concepts, and syntax
  2. Help with Java frameworks like Spring, Hibernate, etc.
  3. Guide students through Java best practices and design patterns
  4. Provide code examples with proper Java conventions
  5. Help debug Java applications and explain error handling
  6. Only answer questions related to Java and its ecosystem
  7. If asked about other topics, politely redirect to Java-related questions
  
  Always maintain a helpful, educational tone and provide actionable advice.`,
  
    Python: `You are an expert Python teacher and mentor. Your role is to help students learn Python programming effectively. You should:
  
  1. Explain Python syntax, data structures, and control flow
  2. Guide students through Python libraries and frameworks
  3. Help with Python best practices and PEP standards
  4. Provide practical examples and code snippets
  5. Explain Python-specific concepts like decorators, generators, etc.
  6. Only answer questions related to Python and its ecosystem
  7. If asked about other topics, politely redirect to Python-related questions
  
  Always maintain a helpful, educational tone and provide actionable advice.`,
  };
  
  // Generate GUID for session ID
  export const generateGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  
  // Format conversation for Gemini API with system prompt and chat history
  export const formatConversationForGemini = (
    course,
    chatHistory,
    currentMessage
  ) => {
    const systemPrompt =
      COURSE_SYSTEM_PROMPTS[course] || COURSE_SYSTEM_PROMPTS.React;
    const maxMessages = CHATBOT_CONFIG.SETTINGS.MAX_CONTEXT_MESSAGES;
  
    // Get recent messages to maintain context (limit to prevent token overflow)
    const recentMessages = chatHistory.slice(-maxMessages);
  
    // Build conversation context
    let conversationContext = `System: ${systemPrompt}\n\n`;
  
    // Add chat history for context
    if (recentMessages.length > 0) {
      conversationContext += 'Previous conversation:\n';
      recentMessages.forEach(msg => {
        const role = msg.sender === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.text}\n`;
      });
      conversationContext += '\n';
    }
  
    // Add current message
    conversationContext += `User: ${currentMessage}\n\n`;
    conversationContext +=
      'Please provide a helpful response based on the conversation context and your role as a teacher.';
  
    return conversationContext;
  };
  
  // Legacy function for backward compatibility
  export const formatPromptForGemini = (course, message) => {
    return formatConversationForGemini(course, [], message);
  };
  