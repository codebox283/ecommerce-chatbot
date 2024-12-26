import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from '@/components/dark-toggle';
import { supabase } from './supabaseClient'; // Adjust the import path as necessary

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null); // Clear user state after sign out
    };

    return (
        <div className='flex justify-between items-center py-2 px-4 bg-black text-white'>
            <div className='cursor-pointer text-xl'>BookBot</div>
            <div className='flex items-center space-x-4'>
                <ModeToggle />
                <FaShoppingCart className='cursor-pointer' />
                <p>{user?.email}</p>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoIosLogOut
                                onClick={handleSignOut}
                                className="dark:text-white rounded-full h-6 w-6 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Sign Out</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
