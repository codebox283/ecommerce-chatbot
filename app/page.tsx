"use client";

import { useState } from 'react';
import axios from 'axios';
import Chatbot from './components/Chatbot';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const newMessage: Message = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/chat', { message: input });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.reply, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <Chatbot />
    </div>
  );
};

export default Home;
