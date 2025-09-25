<template>
	<div class="fixed bottom-4 right-4 z-50">
		<!-- Chatbot Toggle Button -->
		<button
			@click="toggleChatbot"
			class="cursor-pointer green-color hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105"
		>
			<!-- Chat Icon -->
			<svg
        v-if="!isOpen" @click.stop="toggleChatbot"
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				></path>
			</svg>
			<!-- Close Icon -->
			<svg
				v-else
                @click="toggleChatbot"
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		</button>

		<!-- Chatbot Window -->
		<div
			v-if="isOpen"
			ref="chatbotWindow"
			:class="[
				'absolute bottom-16 right-0 h-130 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col transition-all duration-300',
				isExpanded ? 'w-300' : 'w-100'
			]"
		>
			<!-- Header -->
			<div style="background:#0e7159;" class="text-white p-4 rounded-t-lg flex justify-between items-center">
				<div class="flex items-center space-x-2">
					<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold">AI Teacher Assistant</h3>
						<p class="text-xs text-blue-100">
							{{ selectedCourse ? `${selectedCourse} Expert` : 'Select a course to start' }}
						</p>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<button
						@click="toggleExpanded"
						class="text-white hover:text-gray-200 transition-colors p-1"
						:title="isExpanded ? 'Collapse to normal size' : 'Expand to larger size'"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
						</svg>
					</button>
				<button
					@click="closeChatbot"
						class="text-white hover:text-gray-200 transition-colors p-1"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
				</div>
			</div>

			<!-- Course Selection Screen -->
			<div v-if="!selectedCourse" class="flex-1 p-4 bg-gray-50 overflow-y-auto">
				<div class="text-center mb-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Choose Your Course</h3>
					<p class="text-sm text-gray-600">Select a course to get personalized AI assistance</p>
				</div>
				
				<div :class="[
					'grid gap-3',
					isExpanded ? 'grid-cols-2' : 'grid-cols-1'
				]">
					<button
						v-for="course in AVAILABLE_COURSES"
						:key="course"
						@click="selectCourse(course)"
						class="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
					>
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<span class="text-blue-600 font-semibold text-sm">{{ course.charAt(0) }}</span>
							</div>
							<div>
								<h4 class="font-medium text-gray-800">{{ course }}</h4>
								<p class="text-xs text-gray-500">Get expert help with {{ course }}</p>
							</div>
						</div>
					</button>
				</div>
			</div>

			<!-- Chat Interface -->
			<div v-else class="flex flex-col h-full">
				<!-- Messages -->
				<div class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
					<!-- Welcome Message for Selected Course -->
					<div class="flex justify-start">
						<div :class="[
							'px-4 py-2 rounded-lg bg-white border border-gray-200',
							isExpanded ? 'max-w-4xl' : 'max-w-xs'
						]">
							<p class="text-sm text-gray-800">
								👋 Hello! I'm your {{ selectedCourse }} AI teacher assistant. I can help you with {{ selectedCourse }} concepts, coding problems, best practices, and more. What would you like to learn today?
							</p>
						</div>
					</div>

					<!-- Chat Messages -->
					<div
						v-for="message in chatMessages.filter(msg => !msg.isSystem)"
						:key="message.id"
						:class="[
							'flex',
							message.sender === 'user' ? 'justify-end' : 'justify-start'
						]"
					>
						<div
							:class="[
								'px-4 py-2 rounded-lg text-sm',
								message.sender === 'user'
									? 'green-color text-white'
									: 'bg-white border border-gray-200 text-gray-800',
								isExpanded ? 'max-w-4xl' : 'max-w-xs'
							]"
						>
							<div v-if="message.sender === 'bot' && message.isTyping" class="flex items-center space-x-1">
								<div class="flex space-x-1">
									<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
									<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
									<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
								</div>
								<span class="text-xs text-gray-500 ml-2">AI is thinking...</span>
							</div>
							<div v-else-if="message.sender === 'bot'" v-html="renderMarkdown(message.text)"></div>
							<div v-else>{{ message.text }}</div>
						</div>
					</div>
				</div>

			<!-- Input Area -->
			<div class="p-4 border-t border-gray-200 bg-white rounded-b-lg">
				<div class="flex space-x-2">
					<input
						v-model="inputMessage"
						@keyup.enter="sendMessage"
						type="text"
							:placeholder="`Ask me anything about ${selectedCourse}...`"
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
							:disabled="isLoading"
					/>
					<button
						@click="sendMessage"
							:disabled="!inputMessage.trim() || isLoading"
						class="green-color hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm"
					>
							<svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
							</svg>
							<span v-else>Send</span>
						</button>
					</div>
					<div class="flex justify-between items-center mt-2">
						<p class="text-xs text-gray-500">
							💡 Ask about {{ selectedCourse }} concepts, code examples, or best practices
						</p>
						<button
							@click="changeCourse"
							class="text-xs text-blue-600 hover:text-blue-800 transition-colors"
						>
							Change Course
					</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CHATBOT_CONFIG, generateGUID, formatConversationForGemini } from '../config/chatbot.js'
import { renderMarkdownWithStyles } from '../utils/markdownRenderer.js'

// Reactive data
const isOpen = ref(false)
const inputMessage = ref('')
const chatbotWindow = ref(null)
const selectedCourse = ref(null)
const chatMessages = ref([])
const isLoading = ref(false)
const sessionId = ref(null)
const isExpanded = ref(false)

// Configuration
const { AVAILABLE_COURSES, STORAGE_KEYS, GEMINI_API_KEY, GEMINI_API_URL } = CHATBOT_CONFIG

// Markdown rendering function
const renderMarkdown = (text) => {
	return renderMarkdownWithStyles(text)
}

// Load data from local storage
const loadFromStorage = () => {
	const storedCourse = localStorage.getItem(STORAGE_KEYS.SELECTED_COURSE)
	const storedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID)
	const storedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
	
	if (storedCourse) {
		selectedCourse.value = storedCourse
	}
	
	if (storedSessionId) {
		sessionId.value = storedSessionId
	} else {
		sessionId.value = generateGUID()
		localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId.value)
	}
	
	if (storedHistory && selectedCourse.value) {
		try {
			const parsedHistory = JSON.parse(storedHistory)
			// If no system message exists, add one
			const hasSystemMessage = parsedHistory.some(msg => msg.isSystem)
			if (!hasSystemMessage) {
				const systemMessage = {
					id: Date.now(),
					sender: 'system',
					text: `System prompt initialized for ${selectedCourse.value} course`,
					timestamp: new Date().toISOString(),
					isSystem: true
				}
				parsedHistory.unshift(systemMessage)
			}
			chatMessages.value = parsedHistory
		} catch (e) {
			console.error('Error parsing chat history:', e)
			chatMessages.value = []
		}
	}
}

// Save data to local storage
const saveToStorage = () => {
	if (selectedCourse.value) {
		localStorage.setItem(STORAGE_KEYS.SELECTED_COURSE, selectedCourse.value)
	}
	if (sessionId.value) {
		localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId.value)
	}
	localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatMessages.value))
}

// Course selection
const selectCourse = (course) => {
	selectedCourse.value = course
	sessionId.value = generateGUID()
	chatMessages.value = []
	
	// Add system prompt as first message (hidden from UI but used for context)
	const systemMessage = {
		id: Date.now(),
		sender: 'system',
		text: `System prompt initialized for ${course} course`,
		timestamp: new Date().toISOString(),
		isSystem: true
	}
	chatMessages.value.push(systemMessage)
	
	// Save to local storage
	localStorage.setItem(STORAGE_KEYS.SELECTED_COURSE, course)
	localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId.value)
	localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatMessages.value))
	
	// Scroll to bottom
	setTimeout(() => {
		scrollToBottom()
	}, 100)
}

// Change course
const changeCourse = () => {
	selectedCourse.value = null
	chatMessages.value = []
	localStorage.removeItem(STORAGE_KEYS.SELECTED_COURSE)
	localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY)
}

// Methods
const toggleChatbot = () => {
	isOpen.value = !isOpen.value
}

const closeChatbot = () => {
	isOpen.value = false
	isExpanded.value = false
}

const toggleExpanded = () => {
	isExpanded.value = !isExpanded.value
}

// Call Gemini API with chat history context
const callGeminiAPI = async (message) => {
	// Get chat history excluding system messages, typing indicators, and the current message
	const chatHistoryForContext = chatMessages.value.filter(msg => 
		!msg.isTyping && 
		!msg.isSystem && 
		!(msg.sender === 'user' && msg.text === message)
	)
	
	const conversationPrompt = formatConversationForGemini(
		selectedCourse.value, 
		chatHistoryForContext, 
		message
	)

	try {
		const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [{
					parts: [{
						text: conversationPrompt
					}]
				}]
			})
		})

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`)
		}

		const data = await response.json()
		
		if (data.candidates && data.candidates[0] && data.candidates[0].content) {
			return data.candidates[0].content.parts[0].text
		} else {
			throw new Error('Invalid response format from Gemini API')
		}
	} catch (error) {
		console.error('Error calling Gemini API:', error)
		return `I apologize, but I'm having trouble connecting to the AI service right now. Please try again later. As your ${selectedCourse.value} assistant, I'm here to help with ${selectedCourse.value} related questions when the service is available.`
	}
}

// Send message
const sendMessage = async () => {
	if (!inputMessage.value.trim() || !selectedCourse.value || isLoading.value) return

	const userMessage = inputMessage.value.trim()
	
	// Add user message to chat
	const userMessageObj = {
		id: Date.now(),
		sender: 'user',
		text: userMessage,
		timestamp: new Date().toISOString()
	}
	chatMessages.value.push(userMessageObj)

	// Add typing indicator
	const typingMessage = {
		id: Date.now() + 1,
		sender: 'bot',
		text: '',
		isTyping: true,
		timestamp: new Date().toISOString()
	}
	chatMessages.value.push(typingMessage)

	// Clear input
	inputMessage.value = ''
	isLoading.value = true

	// Scroll to bottom
	scrollToBottom()

	try {
		// Get AI response
		const aiResponse = await callGeminiAPI(userMessage)
		
		// Remove typing indicator
		chatMessages.value = chatMessages.value.filter(msg => !msg.isTyping)
		
		// Add AI response
		const botMessage = {
			id: Date.now() + 2,
			sender: 'bot',
			text: aiResponse,
			timestamp: new Date().toISOString()
		}
		chatMessages.value.push(botMessage)
		
		// Save to local storage
		saveToStorage()
		
	} catch (error) {
		console.error('Error getting AI response:', error)
		
		// Remove typing indicator
		chatMessages.value = chatMessages.value.filter(msg => !msg.isTyping)
		
		// Add error message
		const errorMessage = {
			id: Date.now() + 2,
			sender: 'bot',
			text: `I apologize, but I'm having trouble processing your request right now. Please try again later. I'm here to help with ${selectedCourse.value} related questions.`,
			timestamp: new Date().toISOString()
		}
		chatMessages.value.push(errorMessage)
	} finally {
		isLoading.value = false
		scrollToBottom()
	}
}

// Scroll to bottom
const scrollToBottom = () => {
	setTimeout(() => {
		const messagesContainer = chatbotWindow.value?.querySelector('.overflow-y-auto')
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight
		}
	}, 100)
}

// Click outside to close
const handleClickOutside = (event) => {
	if (isOpen.value && chatbotWindow.value && !chatbotWindow.value.contains(event.target)) {
		// Check if click is not on the toggle button
		const toggleButton = event.target.closest('button')
		if (!toggleButton || !toggleButton.contains(event.target)) {
			closeChatbot()
		}
	}
}

// Handle escape key to close expanded mode
const handleKeyDown = (event) => {
	if (event.key === 'Escape' && isExpanded.value) {
		isExpanded.value = false
	}
}

// Lifecycle
onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	document.addEventListener('keydown', handleKeyDown)
	loadFromStorage()
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
	document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
	width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}

/* Smooth animations */
.transition-all {
	transition: all 0.3s ease;
}

.hover\:scale-105:hover {
	transform: scale(1.05);
}

/* Markdown content styling */
:deep(.prose) {
	max-width: none;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
}

:deep(.prose p) {
	margin-bottom: 0.75rem;
}

:deep(.prose ul),
:deep(.prose ol) {
	margin-bottom: 0.75rem;
	padding-left: 1rem;
}

:deep(.prose li) {
	margin-bottom: 0.25rem;
}

:deep(.prose code) {
	background-color: #f3f4f6;
	padding: 0.125rem 0.25rem;
	border-radius: 0.25rem;
	font-size: 0.75rem;
	font-family: 'Courier New', monospace;
	color: #2563eb;
}

:deep(.prose pre) {
	background-color: #1f2937;
	color: #f9fafb;
	padding: 0.75rem;
	border-radius: 0.5rem;
	overflow-x: auto;
	margin: 0.75rem 0;
	font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
}

:deep(.prose pre code) {
	background-color: transparent;
	padding: 0;
	color: #f9fafb;
	font-size: 0.75rem;
	font-family: inherit;
}

/* Syntax highlighting colors for dark theme */
:deep(.prose pre .text-blue-300) {
	color: #93c5fd !important;
}

:deep(.prose pre .text-green-300) {
	color: #86efac !important;
}

:deep(.prose pre .text-yellow-300) {
	color: #fde047 !important;
}

:deep(.prose pre .text-red-300) {
	color: #fca5a5 !important;
}

:deep(.prose pre .text-gray-400) {
	color: #9ca3af !important;
}

:deep(.prose pre .text-gray-300) {
	color: #d1d5db !important;
}

:deep(.prose pre .text-gray-200) {
	color: #e5e7eb !important;
}

:deep(.prose pre .text-purple-300) {
	color: #c4b5fd !important;
}

/* Ensure all text in code blocks is visible */
:deep(.prose pre) {
	color: #e5e7eb !important;
}

:deep(.prose pre *) {
	color: inherit !important;
}

:deep(.prose blockquote) {
	border-left: 4px solid #3b82f6;
	padding-left: 1rem;
	margin: 0.75rem 0;
	font-style: italic;
	color: #6b7280;
}

:deep(.prose strong) {
	font-weight: 600;
	color: #374151;
}

:deep(.prose em) {
	font-style: italic;
	color: #4b5563;
}
.green-color{
 background:#0e7159;
}
</style>
