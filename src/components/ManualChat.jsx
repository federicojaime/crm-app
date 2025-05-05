// src/components/FloatingManualChat.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../styles/ChatStyles.css";

const API = "http://localhost:4000";

export default function FloatingManualChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [history, setHistory] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [manualLoaded, setManualLoaded] = useState(false);
    const [lastMessageIndex, setLastMessageIndex] = useState(0);

    // Referencias para el contenedor de chat y elementos de mensajes
    const chatContainerRef = useRef(null);
    const lastMessageRef = useRef(null);
    const inputRef = useRef(null);
    const messageRefs = useRef({});

    // Comprobar al inicio si el manual ya está cargado
    useEffect(() => {
        checkManualStatus();
    }, []);

    // Scroll inteligente cuando se recibe una nueva respuesta
    useEffect(() => {
        if (history.length > 0 && lastMessageIndex < history.length - 1) {
            // Si hay un nuevo mensaje asistente después de un mensaje usuario
            const newMessageIndex = history.length - 1;
            const messageElement = messageRefs.current[newMessageIndex];

            if (messageElement && history[newMessageIndex].role === 'assistant') {
                // Scroll al inicio del mensaje del asistente
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            setLastMessageIndex(history.length - 1);
        }
    }, [history, lastMessageIndex]);

    // Enfoque en el input cuando se abre el chat
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isMinimized]);

    // Verificar estado del manual usando el endpoint /status
    const checkManualStatus = async () => {
        try {
            // Usamos el endpoint /status para verificar si el manual está cargado
            const { data } = await axios.get(`${API}/status`);

            // Verificamos el estado del manual directamente desde la respuesta
            if (data.ok && data.manualCargado) {
                setManualLoaded(true);
                console.log("Manual detectado como cargado");

                // Añadimos un mensaje inicial del bot si no hay historia
                if (history.length === 0) {
                    setHistory([{
                        role: "assistant",
                        content: "¡Hola! Soy tu asistente virtual. El manual ya está cargado y listo para responder tus consultas. ¿En qué puedo ayudarte?"
                    }]);
                }
            } else {
                console.log("Manual no detectado o no cargado");
                setManualLoaded(false);
            }
        } catch (error) {
            console.error("Error al verificar estado del manual:", error);
            setManualLoaded(false);
        }
    };

    const sendMessage = async () => {
        if (!msg.trim()) return;

        // Añadimos el mensaje del usuario a la historia
        const newHistory = [...history, { role: "user", content: msg }];
        setHistory(newHistory);
        setMsg("");
        setLoading(true);

        try {
            const { data } = await axios.post(`${API}/chat`, {
                message: msg,
                history: newHistory.slice(-4) // Enviamos solo los últimos mensajes para limitar el contexto
            });

            // Actualizamos el estado del manual si viene en la respuesta
            if (data.manualCargado !== undefined) {
                setManualLoaded(data.manualCargado);
            }

            // Añadimos la respuesta del asistente
            setHistory([...newHistory, { role: "assistant", content: data.answer }]);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            setHistory([
                ...newHistory,
                {
                    role: "assistant",
                    content: "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo."
                }
            ]);

            // Si hay un error, intentamos verificar el estado del manual
            checkManualStatus();
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

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

    // Función para renderizar el contenido de mensajes con soporte Markdown
    const renderMessageContent = (content) => {
        return (
            <div className="markdown-content">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        );
    };

    // Función para asignar una referencia a un mensaje
    const setMessageRef = (index, el) => {
        messageRefs.current[index] = el;
    };

    return (
        <>
            {/* Botón flotante para abrir el chat */}
            {(!isOpen || isMinimized) && (
                <button
                    onClick={toggleChat}
                    className="chat-float-button"
                    aria-label="Abrir chat"
                >
                    <span className="chat-icon">💬</span>
                    {isMinimized && <span className="chat-label">Asistente</span>}
                </button>
            )}

            {/* Contenedor principal del chat */}
            {isOpen && (
                <div className={`chat-container ${isMinimized ? "minimized" : ""}`}>
                    {/* Cabecera */}
                    <div className="chat-header">
                        <div className="chat-title">
                            <span className="chat-icon">🤖</span>
                            <h3>Asistente del Manual</h3>
                        </div>
                        <div className="chat-controls">
                            <button onClick={minimizeChat} className="control-button minimize" aria-label="Minimizar">
                                <span>_</span>
                            </button>
                            <button onClick={closeChat} className="control-button close" aria-label="Cerrar">
                                <span>×</span>
                            </button>
                        </div>
                    </div>

                    {/* Indicador de estado del manual */}
                    <div className="manual-status">
                        <div className={`status-indicator ${manualLoaded ? "active" : "inactive"}`}></div>
                        <span>{manualLoaded
                            ? "Online"
                            : "Offline"}
                        </span>
                    </div>

                    {/* Área de mensajes */}
                    <div className="chat-messages" ref={chatContainerRef}>
                        {history.length === 0 && (
                            <div className="welcome-message">
                                <p>Bienvenido al asistente del manual.</p>
                                <p>Hazme cualquier pregunta sobre el contenido del manual.</p>
                            </div>
                        )}

                        {history.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`message ${msg.role === "user" ? "user-message" : "assistant-message"}`}
                                ref={(el) => setMessageRef(idx, el)}
                            >
                                <div className="message-content">
                                    {msg.role === "assistant"
                                        ? renderMessageContent(msg.content)
                                        : msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="message assistant-message">
                                <div className="message-content typing">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Área de entrada */}
                    <div className="chat-input-container">
                        <textarea
                            ref={inputRef}
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu pregunta sobre el manual..."
                            rows={1}
                            className="chat-input"
                        />
                        <button
                            onClick={sendMessage}
                            className="send-button"
                            disabled={loading || !msg.trim()}
                            aria-label="Enviar mensaje"
                        >
                            <span>📤</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}