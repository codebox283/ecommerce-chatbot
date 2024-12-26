"use client";
import { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot';

const ProductPage = () => {
    const [products, setProducts] = useState([]); // State for products
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
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

    const handleSelectProduct = async (productId) => {
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

    if (!products.length) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold text-center mb-8">Books</h1>

            {/* Search Input */}
            <div className="mb-5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search books..."
                    className="border border-gray-300 text-black rounded-lg p-2 w-full"
                />
            </div>

            {selectedProduct ? (
                // Display selected product details
                <div className="mt-10 flex flex-col md:flex-row py-10 md:py-5 border rounded-lg shadow-lg bg-white relative">
                    <img
                        src={selectedProduct.imageLink}
                        alt={selectedProduct.title}
                        className="md:h-96 mx-5 object-cover"
                    />
                    <div className="flex-grow mx-5 md:mx-0 my-5">
                        <h2 className="text-2xl font-bold text-gray-700">{selectedProduct.title}</h2>
                        <p className="text-gray-700">Written by: {selectedProduct.author}</p>
                        <p className="text-gray-700">Published in the year {selectedProduct.year} | Language: {selectedProduct.language}</p>
                        <p className="text-gray-700">This book has {selectedProduct.pages} pages</p>

                        <div className='flex'>
                        <p className='mt-5 mr-2 border text-black py-2 px-4 rounded transition'>${selectedProduct.price}</p>
                        <button
                            onClick={() => handleAddToCart(selectedProduct.id)} // Implement this function as needed
                            className="mt-5 bg-black text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                        >
                            Add to Cart
                        </button></div>
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
                            className="border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                            key={product.id} // Use the unique id as the key
                        >
                            <button onClick={() => handleSelectProduct(product.id)} className="w-full py-4 md:py-1 flex md:flex-col justify-between">
                                <img
                                    src={product.imageLink}
                                    alt={product.title}
                                    className="w-40 md:w-full h-56 object-cover px-2 md:px-10"
                                />
                                <div className="p-4 text-start bottom-0">
                                    <h3 className="text-md font-semibold">{product.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{product.author}</p>
                                    <p className="text-xs text-gray-600 mt-1">${product.price}</p> {/* Assuming price is available */}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pass handleSelectProduct to Chatbot */}
            <Chatbot
                onProductSelect={handleSelectProduct}
                onProductSearch={setSearchQuery}
            />
        </div>
    );
};

export default ProductPage;
