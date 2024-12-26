"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../components/SupabaseClient'; // Adjust path as necessary
import Chatbot from '../../components/Chatbot';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ModeToggle } from '@/components/dark-toggle';
import { Toaster, toast } from 'sonner';
import { MdAddShoppingCart } from 'react-icons/md';

const ProductPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]); // State for products
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
                const response = await fetch('/api/products');
                const data = await response.json();
                if (data.success) {
                    setProducts(data.data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleSelectProduct = (productId) => {
        const product = products.find(product => product.id === productId);
        if (product) {
            setSelectedProduct(product); // Set the selected product directly
        } else {
            console.error("Product not found");
        }
    };

    // Function to reset selection
    const handleResetSelection = () => {
        setSelectedProduct(null);
    };

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = async (productId) => {
        const productToAdd = products.find(product => product.id === productId);
        if (productToAdd) {
            // Save to local storage
            const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            currentCart.push(productToAdd);
            localStorage.setItem('cartItems', JSON.stringify(currentCart));

            // Save to Supabase
            const { data, error } = await supabase
                .from('cart')
                .insert([
                    { 
                        product_id: productToAdd.id, 
                        title: productToAdd.title,
                        author: productToAdd.author,
                        image: productToAdd.imageLink, 
                        price: productToAdd.price, // Add price
                        user_id: user.id, // Add user_id
                        quantity: 1 
                    }
                ]);

            if (error) {
                console.error('Error adding item to Supabase:', error);
                toast('There was an issue adding the item to your cart.');
            } else {
                toast(`${productToAdd.title} has been added to your cart!`);
            }
        }
    };

    const handleRedirectCart = async () => {
        if (pathname === '/products') {
            await router.push('/cart'); // Redirect to cart
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        await router.push('/auth'); // Redirect to auth page after sign out
    };
    const skeletonPlaceholders = Array.from({ length: 15 }, (_, index) => index);

    if (!products.length) return <div>
        <div className="container mx-auto p-5">
        <div className='flex justify-between items-center py-2'>
                <div className='cursor-pointer'>BookBot</div>
                <div className='flex items-center space-x-2'>
                    <ModeToggle />
                    <FaShoppingCart onClick={handleRedirectCart} className='mr-4 cursor-pointer' />
                    <p>{user?.email}</p>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <IoIosLogOut
                                    onClick={handleSignOut}
                                    className="dark:text-white rounded-full h-6 w-6 ml-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Sign Out</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            {/* Search Input */}
            <div className="mb-5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search books..."
                    className="border light:border-gray-300 dark:border-gray-700 text-black rounded-lg p-2 w-full"
                />
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {skeletonPlaceholders.map((_, index) => (
                    <li key={index} className="border light:border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
                        <div className="animate-pulse flex flex-col items-center p-4">
                            <div className="bg-gray-300 h-56 w-full mb-2"></div>
                            <div className="bg-gray-300 h-4 w-3/4 mb-1"></div>
                            <div className="bg-gray-300 h-4 w-1/2 mb-1"></div>
                            <div className="bg-gray-300 h-4 w-1/4"></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>;

    return (
        <div className="container mx-auto p-5">
    {/* Top Navigation Bar */}
    <div className='flex flex-col md:flex-row justify-between items-center py-2'>
        <div className='cursor-pointer text-xl font-bold'>BookBot</div>
        <div className='flex items-center space-x-2 mt-2 md:mt-0'>
            <ModeToggle />
            <FaShoppingCart onClick={handleRedirectCart} className='mr-4 cursor-pointer' />
            <p className="hidden md:block">{user?.email}</p>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <IoIosLogOut
                            onClick={handleSignOut}
                            className="dark:text-white rounded-full h-6 w-6 ml-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Sign Out</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </div>

    {/* Search Input */}
    <div className="mb-5">
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search books..."
            className="border light:border-gray-300 dark:border-gray-700 light:text-black rounded-lg p-2 w-full"
        />
    </div>

    {selectedProduct ? (
        // Display selected product details
        <div className="mt-10 flex flex-col md:flex-row py-10 md:py-5 border rounded-lg shadow-lg light:shadow-black bg-transparent relative">
            <img
                src={selectedProduct.imageLink}
                alt={selectedProduct.title}
                className="md:h-96 mx-5 object-cover"
            />
            <div className="flex-grow mx-5 md:mx-0 my-5 light:text-gray-700 dark:text-gray-100">
                <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                <p>Written by: {selectedProduct.author}</p>
                <p>Published in the year {selectedProduct.year} | Language: {selectedProduct.language}</p>
                <p>This book has {selectedProduct.pages} pages</p>

                <div className='flex'>
                    <p className='mt-5 mr-2 border light:text-black py-2 px-4 rounded transition'>${selectedProduct.price}</p>
                    <button
                        onClick={() => handleAddToCart(selectedProduct.id)}
                        className="mt-5 bg-black text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Close Icon */}
            <button
                onClick={handleResetSelection}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

    ) : (
        // Display list of filtered products
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredProducts.map(product => (
                <li
                    className="border light:border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                    key={product.id}
                >
                    <button onClick={() => handleSelectProduct(product.id)} className="w-full py-4 md:py-1 flex md:flex-col justify-between">
                        <img
                            src={product.imageLink}
                            alt={product.title}
                            className="w-40 md:w-full h-56 object-cover px-2 md:px-10"
                        />
                        <div className='flex justify-between items-center'>
                            <div className="p-4 text-start bottom-0">
                                <h3 className="text-md font-semibold">{product.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{product.author}</p>
                                <p className="text-xs text-gray-600 mt-1">${product.price}</p>
                            </div>
                            <MdAddShoppingCart />
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    )}
    <div className="mt-auto"> 
        {/* Ensure Chatbot is positioned correctly */}
        <Chatbot
            onProductSelect={handleSelectProduct}
            onProductSearch={setSearchQuery}
            onAddToCart={handleAddToCart}
        />
    </div>

    {/* Toaster for notifications */}
    <Toaster />
</div>

    );
};

export default ProductPage;
