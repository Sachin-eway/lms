<template>
	<div class="fixed bottom-4 right-4 z-50">
		<!-- Chatbot Toggle Button -->
		<button
			@click="toggleChatbot"
			class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105"
		>
			<!-- Chat Icon -->
			<svg
				v-if="!isOpen"
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
			class="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
		>
			<!-- Header -->
			<div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
				<div class="flex items-center space-x-2">
					<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold">LMS Assistant</h3>
						<p class="text-xs text-blue-100">Online now</p>
					</div>
				</div>
				<button
					@click="closeChatbot"
					class="text-white hover:text-gray-200 transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Messages -->
			<div class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
				<!-- Welcome Message -->
				<div class="flex justify-start">
					<div class="max-w-xs px-4 py-2 rounded-lg bg-white border border-gray-200">
						<p class="text-sm text-gray-800">
							👋 Hello! I'm your LMS assistant. How can I help you today?
						</p>
					</div>
				</div>

				<!-- Static Messages -->
				<div
					v-for="message in staticMessages"
					:key="message.id"
					:class="[
						'flex',
						message.sender === 'user' ? 'justify-end' : 'justify-start'
					]"
				>
					<div
						:class="[
							'max-w-xs px-4 py-2 rounded-lg text-sm',
							message.sender === 'user'
								? 'bg-blue-600 text-white'
								: 'bg-white border border-gray-200 text-gray-800'
						]"
					>
						{{ message.text }}
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
						placeholder="Type your message..."
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
					/>
					<button
						@click="sendMessage"
						:disabled="!inputMessage.trim()"
						class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm"
					>
						Send
					</button>
				</div>
				<p class="text-xs text-gray-500 mt-2">
					💡 Try asking: "How to enroll in a course?" or "What batches are available?"
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const isOpen = ref(false)
const inputMessage = ref('')
const chatbotWindow = ref(null)

// Static messages for demo
const staticMessages = ref([
	{
		id: 1,
		sender: 'user',
		text: 'How can I enroll in a course?'
	},
	{
		id: 2,
		sender: 'bot',
		text: 'To enroll in a course, go to the Courses section, select your desired course, and click the "Enroll" button. You can also join batches for structured learning.'
	},
	{
		id: 3,
		sender: 'user',
		text: 'What batches are available?'
	},
	{
		id: 4,
		sender: 'bot',
		text: 'You can find all available batches in the Batches section. Each batch has a specific start date, duration, and curriculum. Check the batch details for enrollment information.'
	}
])

// Methods
const toggleChatbot = () => {
	isOpen.value = !isOpen.value
}

const closeChatbot = () => {
	isOpen.value = false
}

const sendMessage = () => {
	if (!inputMessage.value.trim()) return

	// Add user message
	const userMessage = {
		id: Date.now(),
		sender: 'user',
		text: inputMessage.value
	}
	staticMessages.value.push(userMessage)

	// Add bot response
	const botResponse = getBotResponse(inputMessage.value)
	const botMessage = {
		id: Date.now() + 1,
		sender: 'bot',
		text: botResponse
	}
	staticMessages.value.push(botMessage)

	// Clear input
	inputMessage.value = ''

	// Scroll to bottom
	setTimeout(() => {
		const messagesContainer = chatbotWindow.value?.querySelector('.overflow-y-auto')
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight
		}
	}, 100)
}

// Simple bot response logic
const getBotResponse = (message) => {
	const lowerMessage = message.toLowerCase()
	
	if (lowerMessage.includes('course') || lowerMessage.includes('enroll')) {
		return '📚 To enroll in courses, visit the Courses section. You can browse all available courses and enroll directly. Each course includes lessons, quizzes, and assignments.'
	} else if (lowerMessage.includes('batch') || lowerMessage.includes('batch')) {
		return '👥 Batches are structured learning programs with fixed schedules. Check the Batches section for available programs, start dates, and enrollment details.'
	} else if (lowerMessage.includes('certificate') || lowerMessage.includes('certification')) {
		return '🏆 Certificates are issued upon course completion. You can view and download your certificates from your profile or the Certificates section.'
	} else if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
		return '📝 Quizzes help test your knowledge. You can find quizzes in your enrolled courses. Complete them to track your progress and understanding.'
	} else if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
		return '📋 Assignments are practical exercises to reinforce learning. Submit your assignments through the course interface and get feedback from instructors.'
	} else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
		return '🆘 I\'m here to help! You can ask me about courses, batches, certificates, quizzes, assignments, or any other LMS features. What would you like to know?'
	} else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
		return '👋 Hello! Welcome to the LMS. I\'m here to help you navigate through courses, batches, and other learning resources. How can I assist you today?'
	} else {
		return '🤔 That\'s an interesting question! I can help you with course enrollment, batch information, certificates, quizzes, assignments, and general LMS navigation. Could you be more specific?'
	}
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

// Lifecycle
onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
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
</style>
