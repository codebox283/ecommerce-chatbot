"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../components/SupabaseClient';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from '@/components/dark-toggle';
import { MdDelete } from 'react-icons/md';
import { Toaster, toast } from 'sonner';
import Chatbot from '@/components/Chatbot';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const pathname = usePathname();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchUserAndCartItems = async () => {
            try {
                // Fetch user
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(user);

                // Fetch cart items from Supabase
                const { data: items, error: fetchError } = await supabase
                    .from('cart')
                    .select('*')
                    .eq('user_id', user.id);

                if (fetchError) throw fetchError;

                setCartItems(items);
            } catch (error) {
                toast.error(error);
                console.error("Error fetching user or cart items:", error);
            }
        };

        fetchUserAndCartItems();
    }, []);

    useEffect(() => {
        // Calculate total price whenever cartItems change
        const calculateTotalPrice = () => {
            const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
            setTotalPrice(total);
        };

        calculateTotalPrice();
    }, [cartItems]);

    const handleRemoveFromCart = async (productId) => {
        try {
            // Remove item from local state
            const updatedCart = cartItems.filter(item => item.id !== productId);
            setCartItems(updatedCart);

            // Remove item from Supabase
            const { error } = await supabase
                .from('cart')
                .delete()
                .eq('id', productId); // Assuming you have an id column for cart items

            if (error) throw error;
            toast.success("Item successfully removed from cart");
        } catch (error) {
            toast.error("Error removing item from cart:");
            console.error("Error removing item from cart:", error);
        }
    };

    const handleCheckout = async () => {
        toast.success('Payment processed successfully! (Fake Payment)');

        try {
            // Clear cart in Supabase
            await supabase
                .from('cart')
                .delete()
                .eq('user_id', user.id); // Remove all items for the current user

            setCartItems([]); // Clear local state
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    const handleRedirectProducts = async () => {
        if (pathname === '/cart') {
            await router.push('/products'); // Redirect to cart
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        await router.push('/auth'); // Redirect to auth page after sign out
    };

    return (
        <div className="container mx-auto p-5">
            <div className='flex justify-between items-center py-2'>
                <p onClick={handleRedirectProducts} className='cursor-pointer'>BookBot</p>
                <div className='flex items-center space-x-2'>
                    <ModeToggle />
                    <FaShoppingCart className='mr-4' />
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

            {cartItems.length === 0 ? (
                <p className="text-center">Your cart is empty.</p>
            ) : (
                <div className='md:px-40 py-4'>
                    <ul className="w-full border light:border-gray-300 dark:border-gray-700 rounded-lg">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex p-2 items-center justify-between overflow-hidden">
                                <div className='flex'>
                                <img src={item.image} alt={item.title} className="w-fit h-20 md:h-40 m-2 object-cover" />
                                <div className="p-2 md:p-4 text-start">
                                    <h3 className="md:text-xl font-semibold">{item.title}</h3>
                                    <p className="text-xs md:text-sm dark:text-gray-400 mt-1">{item.author}</p>
                                </div>
                                </div>
                                <div className='flex space-x-2'>
                                    <p className="text-3xl mt-2">${item.price}</p>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        className="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className='flex justify-between my-2 px-10'>
                        <p>Total price:</p>
                        <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between my-2 px-10'>
                        <p>Discount:</p>
                        <p>-$0</p>
                    </div>
                    <div className='flex justify-between my-2 px-10'>
                        <p></p>
                        <p className='text-3xl'>${totalPrice.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="mt-5 w-full light:bg-black light:text-white dark:bg-white dark:text-black py-2 my-2 px-10 rounded hover:light:bg-gray-200 transition"
                    >
                        Checkout
                    </button>
                </div>
            )}
            <Chatbot />
            <Toaster />
        </div>
    );
};

export default CartPage;
