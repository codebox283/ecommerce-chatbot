"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../components/SupabaseClient';

const VerifyPage = () => {
    const router = useRouter();

    useEffect(() => {
        const verifyEmail = async () => {
            const { error } = await supabase.auth.verifyEmail();
            if (error) {
                console.error('Verification failed:', error.message);
                alert('Verification failed. Please try again.');
                return;
            }
            // Redirect to products page after successful verification
            router.push('/products');
        };

        verifyEmail();
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-black">
            <div className="text-white text-center">
                <h1 className="text-3xl font-bold mb-4">Verifying Your Email...</h1>
                <p>A verification email has been sent to the address you provided. Please check your inbox and click the link to confirm your email address.</p>
            </div>
        </div>

    );
};

export default VerifyPage;
