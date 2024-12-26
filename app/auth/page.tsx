"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/components/SupabaseClient'; 
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Toaster, toast } from 'sonner';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // New state for name
    const [isSignUp, setIsSignUp] = useState(true); // Toggle between sign-up and login
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Effect to check if user is already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push('/products'); // Redirect to products if user is logged in
            }
        };
        checkUser();
    }, [router]);

    const handleAuth = async () => {
        try {
            if (isSignUp) {
                const { user, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                // Optionally insert user details into your database
                // await supabase.from('users').insert([{ id: user.id, name }]);
                router.push('/verify');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast('Login successful!');
                router.push('/products');
            }
        } catch (error) {
            console.error(error);
            toast(error.message);
        }
    };

    return (
        <div className='flex h-screen'>
            {/* Left Side - Black and Purple Gradient */}
            <div className='w-2/3 bg-gradient-to-b rounded-3xl from-black to-purple-900 flex items-center justify-center'>
                <div className="text-white text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Our Book Store!</h1>
                    <p className="text-lg">Discover a world of knowledge and adventure.</p>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-1/3 flex items-center justify-center">
                <div className="w-3/4 max-w-md p-5 bg-black bg-opacity-80 rounded-3xl border border-gray-700">
                    <h1 className="text-2xl font-normal text-center my-8 text-white">{isSignUp ? 'Sign Up' : 'Log In'}</h1>
                    {isSignUp && (
                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-700 bg-transparent text-white rounded-lg p-2 w-full"
                            />
                        </div>
                    )}
                    <div className="mb-5">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-700 bg-transparent text-white rounded-lg p-2 w-full"
                        />
                    </div>
                    <div className="mb-5 relative"> {/* Added relative positioning */}
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-700 bg-transparent text-white rounded-lg p-2 w-full pr-10" // Added padding for icon
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer">
                            {showPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />}
                        </button>
                    </div>
                    <button
                        onClick={handleAuth}
                        className="w-full mt-6 bg-white text-black py-2 px-4 rounded hover:scale-105 transition"
                    >
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                    <p className="mt-4 text-center text-white text-xs">
                        {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
                        <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-500 ml-2">
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default AuthPage;
