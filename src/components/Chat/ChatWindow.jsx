import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi! I'm your AI movie assistant. Need help finding a movie, checking showtimes, or booking tickets?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send history excluding the first welcome message to avoid Gemini API errors
      // (Gemini requires history to start with a 'user' message)
      const history = messages.slice(1);
      
      const response = await axios.post('http://localhost:5050/api/chat', {
        message: input,
        history
      });

      const botMessage = { role: 'model', content: response.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-[#111] border border-zinc-800 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center h-[10%]">
            <div className="flex items-center space-x-2">
              <div className="bg-red-600/20 p-2 rounded-lg text-red-500">
                <Bot size={20} />
              </div>
              <h3 className="font-semibold text-white">Movie Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[75%] hide-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 mt-auto ${msg.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                    {msg.role === 'user' ? (
                      <div className="bg-zinc-800 rounded-full p-1 border border-zinc-700 text-white">
                        <User size={16} />
                      </div>
                    ) : (
                      <div className="bg-red-600 rounded-full p-1 text-white shadow-lg shadow-red-600/20">
                        <Bot size={16} />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-red-600 text-white rounded-br-none shadow-md shadow-red-900/20' 
                      : 'bg-zinc-800 text-zinc-200 border border-zinc-700/50 rounded-bl-none shadow-md'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row max-w-[80%]">
                  <div className="flex-shrink-0 mr-2 mt-auto">
                    <div className="bg-red-600 rounded-full p-1 text-white">
                      <Bot size={16} />
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none border border-zinc-700 text-zinc-400 flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="bg-zinc-900 border-t border-zinc-800 p-3 h-[15%]">
            <div className="flex items-center space-x-2 bg-black border border-zinc-800 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-red-600 focus-within:border-red-600 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about movies..."
                className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="text-red-500 disabled:text-zinc-600 hover:text-red-400 disabled:hover:text-zinc-600 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
