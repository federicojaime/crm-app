// src/components/FloatingManualChat.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../styles/ChatStyles.css";

// API endpoint
const API = "https://agente-production-9bec.up.railway.app";

export default function FloatingManualChat() {
    // Estados principales
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [history, setHistory] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [manualLoaded, setManualLoaded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [newMessageAlert, setNewMessageAlert] = useState(false);
    const [userHasScrolled, setUserHasScrolled] = useState(false);
    
    // Referencias
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);
    const latestMessageRef = useRef(null);
    const prevHistoryLengthRef = useRef(0);
    
    // Comprobación inicial del estado de los manuales
    useEffect(() => {
        checkManualStatus();
    }, []);
    
    // Gestión del enfoque en el input cuando se abre el chat
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 300);
        }
    }, [isOpen, isMinimized]);
    
    // ===== SISTEMAS DE SCROLL AVANZADOS =====
    
    // 1. Control de detección cuando el usuario ha scrolleado manualmente
    const handleScroll = useCallback(() => {
        if (!chatContainerRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 30;
        
        // Si está cerca del final, consideramos que no está en modo scroll manual
        if (isAtBottom) {
            setUserHasScrolled(false);
            if (newMessageAlert) setNewMessageAlert(false);
        } else {
            setUserHasScrolled(true);
        }
    }, [newMessageAlert]);
    
    // 2. Instalación del detector de scroll
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
            return () => chatContainer.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);
    
    // 3. Sistema principal de scroll inteligente
    useEffect(() => {
        if (history.length === 0) return;
        
        const hasNewMessage = history.length > prevHistoryLengthRef.current;
        prevHistoryLengthRef.current = history.length;
        
        if (!hasNewMessage) return;
        
        // Determinar si debemos mostrar alerta o hacer scroll
        if (userHasScrolled) {
            // Si el usuario está en mitad de lectura, mostrar notificación en lugar de scroll forzado
            setNewMessageAlert(true);
        } else {
            // Si es una respuesta del asistente (último mensaje), scroll al inicio de la respuesta
            const lastMessage = history[history.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && latestMessageRef.current) {
                setTimeout(() => {
                    latestMessageRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
            // Si es un mensaje del usuario, scroll al final
            else if (lastMessage && lastMessage.role === 'user') {
                setTimeout(() => {
                    chatContainerRef.current?.scrollTo({
                        top: chatContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [history, userHasScrolled]);
    
    // Función para scroll hacia el último mensaje (usado por el botón de alerta)
    const scrollToLatestMessage = () => {
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            setNewMessageAlert(false);
        }
    };
    
    // Verificar estado del manual
    const checkManualStatus = async () => {
        try {
            const response = await fetch(`${API}/status`);
            
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.ok && data.manualesCargados) {
                setManualLoaded(true);
                
                // Mensaje inicial si no hay historia
                if (history.length === 0) {
                    setHistory([{
                        id: 'initial-message',
                        role: "assistant",
                        content: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte con respecto al manual?"
                    }]);
                }
            } else {
                setManualLoaded(false);
            }
        } catch (error) {
            console.error("Error al verificar estado de los manuales:", error);
            setManualLoaded(false);
        }
    };
    
    // Manejo de auto-altura del textarea
    const handleTextareaChange = (e) => {
        const textarea = e.target;
        setMsg(textarea.value);
        
        // Auto-height
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = `${newHeight}px`;
    };
    
    // Enviar mensaje con gestión mejorada de errores
    const sendMessage = async () => {
        if (!msg.trim()) return;
        
        // ID único para el mensaje
        const userMsgId = `user-${Date.now()}`;
        const userMessage = { 
            id: userMsgId, 
            role: "user", 
            content: msg 
        };
        
        // Actualizar historia con mensaje del usuario
        setHistory(prev => [...prev, userMessage]);
        setMsg("");
        setLoading(true);
        
        // Resetear altura del textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
        
        try {
            // Usar POST directamente con fetch nativo
            const response = await fetch(`${API}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: msg,
                    history: [...history, userMessage].slice(-4).map(item => ({
                        role: item.role,
                        content: item.content
                    }))
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Actualizar estado del manual si la API lo devuelve
            if (data.manualesCargados !== undefined) {
                setManualLoaded(data.manualesCargados);
            }
            
            // Añadir respuesta del asistente
            const assistantMessage = { 
                id: `assistant-${Date.now()}`, 
                role: "assistant", 
                content: data.answer
            };
            
            setHistory(prev => [...prev, assistantMessage]);
            
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            
            // Añadir mensaje de error amigable
            const errorMessage = { 
                id: `error-${Date.now()}`, 
                role: "assistant", 
                content: "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo."
            };
            
            setHistory(prev => [...prev, errorMessage]);
            
            // Verificar estado del manual en caso de error
            checkManualStatus();
        } finally {
            setLoading(false);
        }
    };
    
    // Manejar envío con Enter (permitiendo nueva línea con Shift+Enter)
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    // Control de interfaz
    const toggleChat = () => {
        if (isMinimized) {
            setIsMinimized(false);
        } else if (!isOpen) {
            setIsOpen(true);
        }
    };
    
    const minimizeChat = () => {
        setIsMinimized(true);
    };
    
    const closeChat = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };
    
    // Renderizar contenido Markdown con seguridad
    const renderMessageContent = (content) => (
        <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );

    return (
        <>
            {/* Botón flotante con badge de notificación cuando minimizado */}
            {(!isOpen || isMinimized) && (
                <button
                    onClick={toggleChat}
                    className={`chat-float-button ${!isOpen ? "pulse-animation" : ""}`}
                    aria-label="Abrir chat"
                >
                    <div className="float-button-content">
                        <span className="chat-icon">💬</span>
                        {isMinimized && <span className="chat-label">Asistente</span>}
                    </div>
                </button>
            )}

            {/* Contenedor principal del chat */}
            {isOpen && (
                <div className={`chat-container ${isMinimized ? "minimized" : "active"}`}>
                    {/* Cabecera */}
                    <div className="chat-header">
                        <div className="chat-avatar">
                            <img src="/path/to/bot-avatar.png" alt="Bot" onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M12 16v-4'%3E%3C/path%3E%3Cpath d='M12 8h.01'%3E%3C/path%3E%3C/svg%3E";
                            }} />
                        </div>
                        <div className="chat-title">
                            <h3>Asistente del Manual</h3>
                        </div>
                        <div className="chat-controls">
                            <button onClick={minimizeChat} className="control-button minimize" aria-label="Minimizar">
                                <span>—</span>
                            </button>
                            <button onClick={closeChat} className="control-button close" aria-label="Cerrar">
                                <span>×</span>
                            </button>
                        </div>
                    </div>

                    {/* Indicador de estado del manual */}
                    <div className="manual-status">
                        <div className={`status-indicator ${manualLoaded ? "active" : "inactive"}`}></div>
                        <span className="status-text">
                            {manualLoaded ? "Manuales disponibles" : "Manuales no disponibles"}
                        </span>
                    </div>

                    {/* Área de mensajes */}
                    <div 
                        className="chat-messages" 
                        ref={chatContainerRef}
                    >
                        {history.length === 0 ? (
                            <div className="welcome-message">
                                <div className="welcome-icon">📚</div>
                                <h4>Bienvenido al asistente del manual</h4>
                                <p>Hazme cualquier pregunta sobre el contenido del manual y te ayudaré a encontrar la información que necesitas.</p>
                            </div>
                        ) : (
                            history.map((msg, index) => {
                                const isLatestAssistantMessage = 
                                    msg.role === "assistant" && 
                                    index === history.length - 1 && 
                                    history[history.length - 1].role === "assistant";
                                
                                return (
                                    <div
                                        key={msg.id}
                                        ref={isLatestAssistantMessage ? latestMessageRef : null}
                                        className={`message ${msg.role === "user" ? "user-message" : "assistant-message"} ${isLatestAssistantMessage ? "latest-message" : ""}`}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="message-avatar">
                                                <div className="avatar-circle">🤖</div>
                                            </div>
                                        )}
                                        <div className="message-bubble">
                                            <div className="message-content">
                                                {msg.role === "assistant"
                                                    ? renderMessageContent(msg.content)
                                                    : msg.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* Indicador de escritura con animación moderna */}
                        {loading && (
                            <div className="message assistant-message typing-indicator-container">
                                <div className="message-avatar">
                                    <div className="avatar-circle">🤖</div>
                                </div>
                                <div className="message-bubble typing-message">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Botón de alerta de nuevo mensaje */}
                        {newMessageAlert && (
                            <button 
                                className="new-message-alert"
                                onClick={scrollToLatestMessage}
                            >
                                <span className="alert-icon">↓</span>
                                <span>Nueva respuesta</span>
                            </button>
                        )}
                    </div>

                    {/* Área de entrada con enfoque en UX */}
                    <div className="chat-input-container">
                        <div className={`input-wrapper ${isFocused ? 'focused' : ''}`}>
                            <textarea
                                ref={inputRef}
                                value={msg}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Escribe tu pregunta sobre el manual..."
                                rows={1}
                                className="chat-input"
                            />
                            <button
                                onClick={sendMessage}
                                className={`send-button ${!msg.trim() ? "disabled" : "active"}`}
                                disabled={loading || !msg.trim()}
                                aria-label="Enviar mensaje"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                </svg>
                            </button>
                        </div>
                        {/* Notificación de atajo con Shift+Enter */}
                        <div className="input-hint">
                            <span>Presiona <kbd>Enter</kbd> para enviar o <kbd>Shift</kbd>+<kbd>Enter</kbd> para nueva línea</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}