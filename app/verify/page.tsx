"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../components/SupabaseClient';

const VerifyPage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push('/products'); // Redirect to products if user is logged in
            }
        };
        checkUser();
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-black">
            <div className="text-white text-center">
                <h1 className="text-3xl font-bold mb-4">Verifying Your Email...</h1>
                <p>A verification email has been sent to the address you provided. Please check your inbox and click the link to confirm your email address.</p>
                <p>Then you will be redirected to our main page. Thank you!</p>
            </div>
        </div>

    );
};

export default VerifyPage;
