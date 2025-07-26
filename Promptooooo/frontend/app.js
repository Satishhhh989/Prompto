// Prompto - AI Prompt Generator
// Main application logic

class PromptGenerator {
    constructor() {
        // Backend API Configuration
        this.BACKEND_URL = 'http://localhost:5000';
        this.API_ENDPOINT = '/api/generate';

        // DOM Elements
        this.goalInput = document.getElementById('goalInput');
        this.styleSelect = document.getElementById('styleSelect');
        this.generateBtn = document.getElementById('generateBtn');
        this.charCounter = document.getElementById('charCounter');
        this.copyBtn = document.getElementById('copyBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.retryBtn = document.getElementById('retryBtn');

        // Sections
        this.inputSection = document.getElementById('inputSection');
        this.loadingSection = document.getElementById('loadingSection');
        this.outputSection = document.getElementById('outputSection');
        this.errorSection = document.getElementById('errorSection');

        // Output elements
        this.generatedPrompt = document.getElementById('generatedPrompt');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');

        // Initialize the app
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCharCounter();
        this.validateInput();

        // Add smooth entrance animation
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    setupEventListeners() {
        // Input validation and character counting
        this.goalInput.addEventListener('input', () => {
            this.updateCharCounter();
            this.validateInput();
        });

        // Generate button
        this.generateBtn.addEventListener('click', () => {
            this.generatePrompt();
        });

        // Copy button
        this.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Retry button
        this.retryBtn.addEventListener('click', () => {
            this.generatePrompt();
        });

        // Enter key to generate (if input is valid)
        this.goalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey && !this.generateBtn.disabled) {
                e.preventDefault();
                this.generatePrompt();
            }
        });

        // Style select change
        this.styleSelect.addEventListener('change', () => {
            this.validateInput();
        });
    }

    updateCharCounter() {
        const currentLength = this.goalInput.value.length;
        const maxLength = 500;
        this.charCounter.textContent = `${currentLength}/${maxLength}`;

        // Change color based on length
        if (currentLength > maxLength * 0.9) {
            this.charCounter.style.color = '#ef4444';
        } else if (currentLength > maxLength * 0.7) {
            this.charCounter.style.color = '#f59e0b';
        } else {
            this.charCounter.style.color = '#666666';
        }
    }

    validateInput() {
        const goal = this.goalInput.value.trim();
        const isValid = goal.length >= 3 && goal.length <= 500;

        this.generateBtn.disabled = !isValid;

        // Update button text based on validation
        if (!isValid && goal.length > 0 && goal.length < 3) {
            this.generateBtn.querySelector('.btn-text').textContent = 'Need at least 3 characters';
        } else if (goal.length > 500) {
            this.generateBtn.querySelector('.btn-text').textContent = 'Too many characters';
        } else {
            this.generateBtn.querySelector('.btn-text').textContent = 'Generate Prompt';
        }
    }

    async generatePrompt() {
        const goal = this.goalInput.value.trim();
        const style = this.styleSelect.value;

        if (!goal || goal.length < 3) {
            this.showError('Please enter at least 3 characters for your goal.');
            return;
        }

        try {
            // Show loading state
            this.showSection('loading');

            // Create the prompt for the AI
            const systemPrompt = this.createSystemPrompt(goal, style);

            // Make API call
            const response = await this.callOpenRouterAPI(systemPrompt);

            if (response && response.content) {
                // Show the generated prompt
                this.displayGeneratedPrompt(response.content);
                this.showSection('output');
            } else {
                throw new Error('No response received from AI');
            }

        } catch (error) {
            console.error('Error generating prompt:', error);
            this.showError(this.getErrorMessage(error));
        }
    }

    createSystemPrompt(goal, style) {
        let styleContext = '';

        // Add style-specific context
        switch (style) {
            case 'coding':
                styleContext = ' Focus on technical clarity, include specific programming concepts, and structure it for debugging or development tasks.';
                break;
            case 'marketing':
                styleContext = ' Focus on persuasive language, target audience identification, and actionable marketing strategies.';
                break;
            case 'writing':
                styleContext = ' Focus on creative expression, narrative structure, tone, and literary techniques.';
                break;
            case 'productivity':
                styleContext = ' Focus on actionable steps, time management, efficiency, and measurable outcomes.';
                break;
            case 'startup':
                styleContext = ' Focus on business strategy, scalability, market analysis, and entrepreneurial thinking.';
                break;
            case 'creative':
                styleContext = ' Focus on innovative thinking, artistic expression, and out-of-the-box solutions.';
                break;
            case 'academic':
                styleContext = ' Focus on research methodology, critical analysis, scholarly sources, and academic rigor.';
                break;
            case 'business':
                styleContext = ' Focus on professional communication, strategic thinking, and business objectives.';
                break;
            default:
                styleContext = ' Make it clear, actionable, and well-structured.';
        }

        return `You are an expert prompt engineer. Create a perfect, detailed AI prompt for the following goal: "${goal}"

${styleContext}

Requirements:
- Make the prompt clear, specific, and actionable
- Include relevant context and constraints
- Structure it with clear sections if needed
- Use formatting (like bullet points, headers) to improve readability
- Make it ready to copy-paste into ChatGPT, Claude, or any AI assistant
- Ensure it will produce high-quality, focused results

Format your response as a well-structured prompt that the user can immediately use. Don't include explanations about the prompt - just provide the prompt itself.`;
    }

    async callOpenRouterAPI(prompt) {
        const response = await fetch(`${this.BACKEND_URL}${this.API_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();

        if (!data.content) {
            throw new Error('Invalid response format from API');
        }

        return {
            content: data.content
        };
    }

    displayGeneratedPrompt(content) {
        // Format the content for better display
        const formattedContent = this.formatPromptContent(content);
        this.generatedPrompt.innerHTML = formattedContent;

        // Store the raw content for copying
        this.rawPromptContent = content;
    }

    formatPromptContent(content) {
        // Convert markdown-like formatting to HTML
        let formatted = content
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Code blocks
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            // Lists (simple implementation)
            .replace(/^\- (.*$)/gim, '<li>$1</li>');

        // Wrap in paragraphs if not already wrapped
        if (!formatted.includes('<p>') && !formatted.includes('<h')) {
            formatted = '<p>' + formatted + '</p>';
        }

        // Clean up list items
        formatted = formatted.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

        return formatted;
    }

    async copyToClipboard() {
        try {
            // Use the raw content for copying (without HTML formatting)
            await navigator.clipboard.writeText(this.rawPromptContent || this.generatedPrompt.textContent);
            this.showSuccessMessage();
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(this.rawPromptContent || this.generatedPrompt.textContent);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showSuccessMessage();
        } catch (error) {
            console.error('Fallback copy failed:', error);
            alert('Unable to copy to clipboard. Please select and copy the text manually.');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showSuccessMessage() {
        this.successMessage.classList.remove('hidden');

        // Hide success message after 3 seconds
        setTimeout(() => {
            this.successMessage.classList.add('hidden');
        }, 3000);
    }

    resetForm() {
        // Clear inputs
        this.goalInput.value = '';
        this.styleSelect.value = '';

        // Reset validation
        this.updateCharCounter();
        this.validateInput();

        // Show input section with animation
        this.showSection('input');

        // Focus on input
        setTimeout(() => {
            this.goalInput.focus();
        }, 300);
    }

    showSection(sectionName) {
        // Hide all sections
        this.inputSection.classList.add('hidden');
        this.loadingSection.classList.add('hidden');
        this.outputSection.classList.add('hidden');
        this.errorSection.classList.add('hidden');

        // Show the requested section
        switch (sectionName) {
            case 'input':
                this.inputSection.classList.remove('hidden');
                break;
            case 'loading':
                this.loadingSection.classList.remove('hidden');
                break;
            case 'output':
                this.outputSection.classList.remove('hidden');
                break;
            case 'error':
                this.errorSection.classList.remove('hidden');
                break;
        }

        // Scroll to top of the visible section
        setTimeout(() => {
            const visibleSection = document.querySelector('.main-content section:not(.hidden)');
            if (visibleSection) {
                visibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.showSection('error');
    }

    getErrorMessage(error) {
        if (error.message.includes('API Error: 429')) {
            return 'Too many requests. Please wait a moment and try again.';
        } else if (error.message.includes('API Error: 401')) {
            return 'Authentication failed. Please try again later.';
        } else if (error.message.includes('API Error: 500')) {
            return 'Server error. Please try again in a few moments.';
        } else if (error.message.includes('Failed to fetch')) {
            return 'Network error. Please check your connection and try again.';
        } else {
            return 'Something went wrong. Please try again.';
        }
    }
}

// Utility functions for enhanced user experience
class UIEnhancements {
    static addRippleEffect(element) {
        element.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    static addHoverEffects() {
        // Add subtle hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('button, .form-control, .action-btn');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-1px)';
            });

            element.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the main app instance
    const app = new PromptGenerator();

    // Add UI enhancements
    UIEnhancements.addHoverEffects();

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.generate-btn, .action-btn, .retry-btn');
    buttons.forEach(button => {
        UIEnhancements.addRippleEffect(button);
    });

    // Add some Easter eggs for engagement
    let clickCount = 0;
    document.querySelector('.title-gradient').addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            document.querySelector('.title-gradient').style.animation = 'titlePulse 0.5s ease-in-out';
            setTimeout(() => {
                document.querySelector('.title-gradient').style.animation = 'titlePulse 3s ease-in-out infinite';
            }, 500);
            clickCount = 0;
        }
    });

    // Add keyboard shortcuts info (subtle)
    const goalInput = document.getElementById('goalInput');
    goalInput.setAttribute('title', 'Tip: Press Ctrl+Enter to generate');

    // Performance optimization: Lazy load non-critical features
    setTimeout(() => {
        // Add any non-critical features here
        console.log('🚀 Prompto is ready! Create amazing AI prompts instantly.');
    }, 1000);
});

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Export for potential future use
window.PromptGenerator = PromptGenerator;