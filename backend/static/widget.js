// Profit Flow Chat Widget v2.0 (WebSocket)
// Embed script for external websites

(function () {
  'use strict';

  // Configuration
  const API_BASE = window.PROFIT_FLOW_API || 'http://localhost:8001';
  const WIDGET_ID = window.PROFIT_FLOW_WIDGET_ID || 'default';

  // Styles
  const STYLES = `
    /* Import Inter font */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    #pf-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      letter-spacing: -0.01em;
    }
    
    #pf-widget-bubble {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    #pf-widget-bubble:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
    }
    
    #pf-widget-bubble svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    
    #pf-chat-window {
      display: none;
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 100px);
      background: #0a0a0a;
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
      overflow: hidden;
      flex-direction: column;
      transform-origin: bottom right;
    }
    
    #pf-chat-window.open {
      display: flex;
      animation: pf-scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes pf-scale-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    #pf-chat-header {
      padding: 20px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      position: relative;
      z-index: 10;
    }
    
    #pf-chat-header-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    #pf-chat-header-avatar svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    
    #pf-chat-header-info {
      flex: 1;
    }
    
    #pf-chat-header-title {
      color: white;
      font-weight: 600;
      font-size: 16px;
      margin: 0;
      line-height: 1.2;
    }
    
    #pf-chat-header-status {
      color: rgba(255, 255, 255, 0.9);
      font-size: 13px;
      margin: 2px 0 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    #pf-chat-header-status::before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
    }
    
    #pf-chat-close {
      background: rgba(255,255,255,0.1);
      border: none;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: background 0.2s;
    }
    
    #pf-chat-close:hover {
      background: rgba(255,255,255,0.2);
    }
    
    #pf-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scroll-behavior: smooth;
      background: #0a0a0a;
    }
    
    #pf-chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    
    #pf-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
    }
    
    .pf-message {
      max-width: 85%;
      padding: 14px 18px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
      animation: pf-slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    
    @keyframes pf-slide-up-fade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .pf-message-user {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    
    .pf-message-bot {
      background: #18181b;
      color: #e4e4e7;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(255,255,255,0.05);
    }

    .pf-message-manager {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      margin-top: 10px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }
    
    .pf-message-manager::before {
      content: 'Менеджер';
      position: absolute;
      top: -18px;
      left: 0;
      font-size: 11px;
      color: #10b981;
      font-weight: 600;
    }
    
    .pf-message-typing {
      padding: 16px 20px;
      display: flex;
      gap: 5px;
      align-items: center;
      width: fit-content;
    }
    
    .pf-typing-dot {
      width: 6px;
      height: 6px;
      background: #a1a1aa;
      border-radius: 50%;
      animation: pf-pulse 1.4s infinite;
    }
    
    .pf-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .pf-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes pf-pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.1); }
    }
    
    #pf-chat-input-container {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      gap: 10px;
      background: #0a0a0a;
    }
    
    #pf-chat-input {
      flex: 1;
      padding: 14px 18px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 26px;
      background: #18181b;
      color: white;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }
    
    #pf-chat-input:focus {
      border-color: #6366f1;
      background: #27272a;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    
    #pf-chat-input::placeholder {
      color: #71717a;
    }
    
    #pf-chat-send {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #6366f1;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    #pf-chat-send:hover {
      background: #4f46e5;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    
    #pf-chat-send svg {
      width: 20px;
      height: 20px;
      fill: white;
      margin-left: 2px;
    }
    
    #pf-powered-by {
      text-align: center;
      padding: 12px;
      font-size: 11px;
      color: #52525b;
      background: #0a0a0a;
      border-top: 1px solid rgba(255,255,255,0.03);
    }
    
    #pf-powered-by a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    #pf-powered-by a:hover {
      opacity: 1;
    }
  `;

  // Icons
  const ICONS = {
    chat: `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`,
    bot: `<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/></svg>`,
    close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    send: `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`
  };

  // State
  let isOpen = false;
  let chatId = null;
  let sessionId = localStorage.getItem('pf_session_id') || generateSessionId();
  let processedIds = new Set();
  let pendingMessages = []; // For optimistic updates
  let socket = null;

  localStorage.setItem('pf_session_id', sessionId);

  function generateSessionId() {
    return 'pf_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Create widget HTML
  function createWidget() {
    // Load Socket.IO Client
    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.7.4/socket.io.min.js';
    script.onload = () => {
      console.log("Socket.IO loaded");
      if (chatId) connectSocket();
    };
    document.head.appendChild(script);

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // Create container
    const container = document.createElement('div');
    container.id = 'pf-widget-container';
    container.innerHTML = `
      <div id="pf-chat-window">
        <div id="pf-chat-header">
          <div id="pf-chat-header-avatar">${ICONS.bot}</div>
          <div id="pf-chat-header-info">
            <p id="pf-chat-header-title">Чат поддержки</p>
            <p id="pf-chat-header-status">● Онлайн</p>
          </div>
          <button id="pf-chat-close">${ICONS.close}</button>
        </div>
        <div id="pf-chat-messages">
          <div class="pf-message pf-message-bot">
            Привет! 👋 Я AI-ассистент. Чем могу помочь?
          </div>
        </div>
        <div id="pf-chat-input-container">
          <input type="text" id="pf-chat-input" placeholder="Введите сообщение..." />
          <button id="pf-chat-send">${ICONS.send}</button>
        </div>
        <div id="pf-powered-by">
          Powered by <a href="https://profitflow.ai" target="_blank">Profit Flow</a>
        </div>
      </div>
      <div id="pf-widget-bubble">${ICONS.chat}</div>
    `;

    document.body.appendChild(container);

    // Event listeners
    document.getElementById('pf-widget-bubble').addEventListener('click', toggleChat);
    document.getElementById('pf-chat-close').addEventListener('click', toggleChat);
    document.getElementById('pf-chat-send').addEventListener('click', sendMessage);
    document.getElementById('pf-chat-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function toggleChat() {
    isOpen = !isOpen;
    const chatWindow = document.getElementById('pf-chat-window');
    const bubble = document.getElementById('pf-widget-bubble');

    if (isOpen) {
      chatWindow.classList.add('open');
      bubble.innerHTML = ICONS.close;
      document.getElementById('pf-chat-input').focus();

      // Create or load chat session
      if (!chatId) {
        initChat();
      } else {
        connectSocket();
        scrollToBottom();
      }
    } else {
      chatWindow.classList.remove('open');
      bubble.innerHTML = ICONS.chat;
    }
  }

  async function initChat() {
    try {
      const response = await fetch(`${API_BASE}/chats/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          external_id: sessionId,
          platform: 'web',
          client_name: 'Посетитель сайта'
        })
      });

      if (response.ok) {
        const data = await response.json();
        chatId = data.id;

        // Load history if any
        if (data.messages && data.messages.length > 0) {
          renderHistory(data.messages);
        }

        connectSocket();
      }
    } catch (error) {
      console.error('Failed to init chat:', error);
    }
  }

  function connectSocket() {
    if (socket && socket.connected) return;
    if (typeof io === 'undefined') return;

    socket = io(API_BASE, {
      path: '/socket.io',
      transports: ['websocket'], // Force WebSocket only
      upgrade: false // Disable upgrade since we are forcing it
    });

    socket.on('connect', () => {
      console.log("Socket connected");
      if (chatId) socket.emit('join_chat', chatId);
    });

    socket.on('new_message', (data) => {
      // data: {id, role, content, ...}
      if (processedIds.has(data.id)) return;
      processedIds.add(data.id);

      const type = data.role === 'user' ? 'user' : (data.role === 'manager' ? 'manager' : 'bot');

      // Handle optimistic duplicate for user messages
      if (type === 'user') {
        const index = pendingMessages.indexOf(data.content);
        if (index > -1) {
          // We found the pending message, so it's already displayed.
          // Remove from pending and DO NOT add to UI again.
          pendingMessages.splice(index, 1);
          return;
        }
      }

      // Add message to UI
      addMessage(data.content, type);

      // Hide typing if bot/manager message
      if (type !== 'user') {
        hideTyping();
      }
    });

    socket.on('typing_start', () => {
      showTyping();
    });

    socket.on('disconnect', () => {
      console.log("Socket disconnected");
    });
  }

  function renderHistory(messages) {
    const container = document.getElementById('pf-chat-messages');
    if (messages.length > 0) {
      container.innerHTML = '';
    }

    messages.forEach(msg => {
      processedIds.add(msg.id);
      const type = msg.role === 'user' ? 'user' : (msg.role === 'manager' ? 'manager' : 'bot');
      addMessage(msg.content, type);
    });
  }

  async function sendMessage() {
    const input = document.getElementById('pf-chat-input');
    const message = input.value.trim();

    if (!message) return;

    input.value = '';

    // Add user message optimistically
    addMessage(message, 'user');
    pendingMessages.push(message);

    // showTyping(); // Removed optimistic typing indicator for Human mode support

    // Use Socket.IO to send
    if (socket && socket.connected) {
      socket.emit('send_message', {
        chat_id: chatId,
        content: message
      });
    } else {
      // Fallback: init chat then emit
      if (!chatId) await initChat();
      if (socket && socket.connected) {
        socket.emit('send_message', { chat_id: chatId, content: message });
      } else {
        // Really offline or socket failed
        addMessage("Ошибка: Сокет не подключен", "bot");
        hideTyping();
      }
    }
  }

  function addMessage(text, type) {
    const messagesContainer = document.getElementById('pf-chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `pf-message pf-message-${type}`;
    messageEl.textContent = text;
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
  }

  function scrollToBottom() {
    const messagesContainer = document.getElementById('pf-chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping() {
    const messagesContainer = document.getElementById('pf-chat-messages');
    if (document.getElementById('pf-typing-indicator')) return;

    const typingEl = document.createElement('div');
    typingEl.id = 'pf-typing-indicator';
    typingEl.className = 'pf-message pf-message-bot pf-message-typing';
    typingEl.innerHTML = `
      <span class="pf-typing-dot"></span>
      <span class="pf-typing-dot"></span>
      <span class="pf-typing-dot"></span>
    `;
    messagesContainer.appendChild(typingEl);
    scrollToBottom();
  }

  function hideTyping() {
    const typingEl = document.getElementById('pf-typing-indicator');
    if (typingEl) typingEl.remove();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
