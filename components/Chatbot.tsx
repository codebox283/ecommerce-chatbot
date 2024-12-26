"use client";
import { useEffect, useState, useRef } from 'react';
import { IoSparklesOutline, IoSparklesSharp } from 'react-icons/io5';
import { TbSquareRoundedArrowUpFilled, TbSquareRoundedArrowUp } from "react-icons/tb";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface Message {
    text: string;
    sender: 'user' | 'bot';
    productId?: number; // Optional productId for products
}

interface Book {
    id: number;
    author: string;
    country: string;
    imageLink: string;
    language: string;
    link: string;
    pages: number;
    title: string;
    year: number;
}

interface ChatbotProps {
    onProductSelect: (productId: number) => void; // Callback to handle product selection
    onProductSearch: (searchQuery: string) => void; // Callback to handle product search
    onAddToCart: (productId: number) => void;
}

var unrecognizedCount = 0;
const Chatbot: React.FC<ChatbotProps> = ({ onProductSelect, onProductSearch, onAddToCart }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [productId, setProductId] = useState<number>();

    const router = useRouter();

    const handleToggleSize = () => {
        setIsExpanded(prev => !prev);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 3000); // Opens after 3 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Send a welcome message when the chat opens
            setMessages(prev => [
                ...prev,
                { text: "Hello! I'm here to help you find books. You can ask me:\n- Show books written by [Author Name]\n- Show books written in [Language]\n- Show book titled [Book Title]", sender: 'bot' }
            ]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    console.log(unrecognizedCount);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        // Add user's message to chat
        setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);

        // Process the user's input to determine the type of search
        let searchQuery = "";
        let queryType = ""; // Define the type of query

        const lowerCaseInput = inputValue.toLowerCase();

        // Handle greetings
        if (lowerCaseInput.includes("hey") || lowerCaseInput.includes("hi") || lowerCaseInput.includes("hello")) {
            setMessages(prev => [...prev, { text: "Hello! How can I assist you today?", sender: 'bot' }]);
            setInputValue(""); // Clear input field after greeting
            return;
        }

        // Handle help requests
        if (lowerCaseInput.includes("i need help") || lowerCaseInput.includes("help me") || lowerCaseInput.includes("what can you do")) {
            setMessages(prev => [...prev, { text: "I can help you find books based on various criteria. You can ask me:\n- Show books written by [Author Name]\n- Show books written in [Language]\n- Show books published in [Year]\n- Show book titled '[Book Title]'", sender: 'bot' }]);
            setInputValue(""); // Clear input field after help request
            return;
        }

        // Show all books
        if (lowerCaseInput.includes("clear search") || lowerCaseInput.includes("show all books") || lowerCaseInput.includes("can you clear the search area?") || lowerCaseInput.includes("clear") || lowerCaseInput.includes("what do you have")) {
            setMessages(prev => [...prev, { text: "Search area is now cleared. Showing all books", sender: 'bot' }]);
            router.push('/products')
            await onProductSearch(``);
            setInputValue(""); // Clear input field after help request
            return;
        }

        // Add selected item to cart
        if (lowerCaseInput === 'yes' && productId) {
            handleAddToCart(productId);
        } else if (lowerCaseInput === 'yes' && !productId) {
            setMessages(prev => [...prev, { text: "Please select a book to add to cart", sender: 'bot' }]);
        } else if (lowerCaseInput === 'no') {
            setMessages(prev => [...prev, { text: "Okay! Let me know if there's anything else you need.", sender: 'bot' }]);
        }

        if (
            lowerCaseInput.includes("remove from cart") ||
            lowerCaseInput.includes("remove this book from cart") ||
            lowerCaseInput.includes("delete from cart") ||
            lowerCaseInput.includes("delete this book from cart")
        ) {
            setMessages(prev => [
                ...prev,
                { text: "I cannot do that right now. You have to manually delete a book from the cart. Redirecting to cart...", sender: 'bot' },
            ]);

            setTimeout(() => {
                router.push('/cart');
            }, 3000); // Wait for 3 seconds before redirecting

            setInputValue(""); // Clear input field after help request
            return;
        }

        // Redirect to cart
        if (
            lowerCaseInput.includes("cart") ||
            lowerCaseInput.includes("go to cart") ||
            lowerCaseInput.includes("show my cart") ||
            lowerCaseInput.includes("route to cart") ||
            lowerCaseInput.includes("i want to check out")
        ) {
            setMessages(prev => [
                ...prev,
                { text: "Redirecting to cart...", sender: 'bot' },
            ]);

            setTimeout(() => {
                router.push('/cart');
            }, 3000); // Wait for 3 seconds before redirecting

            setInputValue(""); // Clear input field after help request
            return;
        }

        // Regular expressions for specific queries
        const authorRegex = /(show\s+)?books\s+(written\s+by|by|from)\s+(.*)/i;
        const languageRegex = /(show\s+)?books\s+(in|written\s+in)\s+(.*)/i;
        const yearRegex = /(show\s+)?books\s+(published\s+in|from)\s+(\d{4})/i;
        const titleRegex = /(show\s+)?book\s+titled\s+(.*)/i;
        const generalQueryRegex = /(can you show me|show me|what do you have)\s+(some\s+)?books/i;

        let match;

        // Handle specific author queries
        if ((match = authorRegex.exec(lowerCaseInput))) {
            unrecognizedCount = 0;
            searchQuery = match[3].trim(); // Capture the author's name
            queryType = "author";
            setMessages(prev => [...prev, { text: `Showing books written by ${searchQuery}...`, sender: 'bot' }]);

            // Handle language queries
        } else if ((match = languageRegex.exec(lowerCaseInput))) {
            unrecognizedCount = 0;
            searchQuery = match[3].trim(); // Capture the language
            queryType = "language";
            setMessages(prev => [...prev, { text: `Searching for books written in ${searchQuery}...`, sender: 'bot' }]);

            // Handle year queries
        } else if ((match = yearRegex.exec(lowerCaseInput))) {
            unrecognizedCount = 0;
            searchQuery = match[3].trim(); // Capture the year
            queryType = "year";
            setMessages(prev => [...prev, { text: `Searching for books published in ${searchQuery}...`, sender: 'bot' }]);

            // Handle title queries
        } else if ((match = titleRegex.exec(lowerCaseInput))) {
            unrecognizedCount = 0;
            searchQuery = match[2].trim(); // Capture the title
            queryType = "title";
            setMessages(prev => [...prev, { text: `Searching for the book titled "${searchQuery}"...`, sender: 'bot' }]);

            // Handle general queries about available books or requests for information
        } else if ((match = generalQueryRegex.exec(lowerCaseInput))) {
            unrecognizedCount = 0;
            setMessages(prev => [...prev, { text: "Here are some options you can explore:\n- Show me some books\n- What do you have?", sender: 'bot' }]);
            return;
        } else {
            unrecognizedCount++; // Increment the counter for each unrecognized input
            if (unrecognizedCount >= 4) {
                setMessages(prev => [
                    ...prev,
                    {
                        text: "It seems there has been a problem. I'm always learning! Your feedback is invaluable. Please share your thoughts at [main.nakshatra@gmail.com](mailto:main.nakshatra@gmail.com) or leave feedback at [my feedback page](https://nakshatra-portfolio.vercel.app/). Sorry for the inconvinience. `Thank you!",
                        sender: 'bot'
                    }
                ]);
                setMessages(prev => [...prev, { text: "I didn't understand that. Please try asking like:\n- Show books written by William Shakespeare\n- Show books written in English\n- Show books published in 2020\n- Show book titled '1969'", sender: 'bot' }]);
            } else {
                setMessages(prev => [...prev, { text: "I didn't understand that. Please try asking like:\n- Show books written by William Shakespeare\n- Show books written in English\n- Show books published in 2020\n- Show book titled '1969'", sender: 'bot' }]);
            }
            setInputValue(""); // Clear input field if unrecognized
            return; // Exit early if the input is not recognized
        }

        // Call onProductSearch with a structured query
        await onProductSearch(`${searchQuery}`);

        try {
            // Make a POST request to the chat API
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            });

            const data = await response.json();

            if (data.success) {
                // If data contains books, display them
                if (data.data && data.data.length > 0) {
                    setMessages(prev => [
                        ...prev,
                        { text: `Here are the results:`, sender: 'bot' },
                        ...data.data.map(book => ({
                            text: `${book.title} by ${book.author} (${book.year})`,
                            sender: 'bot',
                            productId: book.id, // Assuming each book has an ID
                        })),
                    ]);
                } else {
                    // If no books found, display the reply from the bot
                    setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
                }
            } else {
                setMessages(prev => [...prev, { text: "There was an error processing your request.", sender: 'bot' }]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessages(prev => [...prev, { text: "An error occurred while communicating with the server.", sender: 'bot' }]);
        }

        // Clear input field after processing
        setInputValue("");
    };

    const handleAddToCart = (productId: number) => {
        onAddToCart(productId);
        setMessages(prev => [...prev, { text: `The selected book with product id ${productId} has been added to cart`, sender: 'bot' }]);
        setMessages(prev => [...prev, { text: `Let me know if you want to visit the cart - Just type in 'cart'`, sender: 'bot' }]);
        setProductId(undefined);
    }

    const handleProductSelect = (productId: number) => {
        onProductSelect(productId); // Call the parent component's handler
        setProductId(productId);
        setMessages(prev => [...prev, { text: `Show details of product ID ${productId}`, sender: 'user' }]);
        setMessages(prev => [...prev, { text: `You selected product ID ${productId}. Would you like to add it to your cart? Reply with 'Yes' or 'No'`, sender: 'bot' }]);
    };

    return (
        <>
            <div
                className="fixed bottom-5 right-5 bg-transparent light:text-black dark:text-white rounded-full w-10 md:w-16 h-10 md:h-16 p-2 flex items-center justify-center cursor-pointer shadow-lg transition-transform transform hover:scale-125"
                onClick={() => setIsOpen(!isOpen)}
            >
                <IoChatbubbleEllipsesSharp className='w-full h-full' />
            </div>
            {isOpen && (
                <div className={`fixed bottom-20 right-5 md:right-20 ${isExpanded ? 'w-[90vw] max-w-[1000px] max-h-[80vh]' : 'w-[90vw] max-w-[400px] max-h-[70vh]'} backdrop-filter backdrop-blur-sm bg-black bg-opacity-60 border border-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300`}>
                    <div className="bg-gray-800 backdrop-filter backdrop-blur-sm bg-opacity-10 text-white p-4 text-lg font-semibold flex justify-between items-center">
                        Chat with AI
                        {/* Size Toggle Button */}
                        <div
                            className="m-0 hidden md:block -p-2 h-6 w-6 cursor-pointer"
                            onClick={handleToggleSize}
                        >
                            {!isExpanded ? (
                                <MdFullscreen className='h-full w-full transition-colors duration-200 text-white' />
                            ) : (
                                <MdFullscreenExit className='h-full w-full transition-colors duration-200 text-white' />
                            )}
                        </div>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[50vh] scrollbar-hidden space-y-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block space-x-2 p-2 rounded-lg ${msg.sender === 'user' ? 'bg-gray-200 text-black' : 'bg-transparent text-white'}`}>
                                    {msg.sender === 'user' ? null : <IoSparklesSharp className='h-4 w-4 -ml-2 mr-2' />}
                                    {msg.text}
                                </span>
                                {msg.productId && (
                                    <button onClick={() => handleProductSelect(msg.productId)} className="ml-2 bg-gray-700 text-white text-xs rounded px-2 py-1">
                                        show details
                                    </button>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex mt-auto p-2 border-t border-gray-700 ">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="flex-grow border border-gray-300 rounded-lg p-2 light:text-black dark:text-white focus:outline-none focus:ring-gray-200"
                        />
                        <div
                            className="m-0 -p-2 h-14 w-14 cursor-pointer"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleSendMessage}
                        >
                            {isHovered ? (
                                <TbSquareRoundedArrowUp className='h-full w-full transition-colors duration-200 text-white' />
                            ) : (
                                <TbSquareRoundedArrowUpFilled className='h-full w-full transition-colors duration-200 text-white' />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
