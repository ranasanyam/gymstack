'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useToast } from '@/app/hooks/use-toast';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';


export default function ForgotPassword() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/functions/v1/send-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const result  = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to send password reset email');
            }
            setSent(true);
            toast({
                title: 'Check your email',
                description: 'If an account exists, you will receive a password reset link.'
            })
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };
      if (sent) {
    return (
        <AuthLayout
            title="Check your email"
            subtitle="We've sent you a password reset link"
        >
            <div className="text-center space-y-6">
            <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
                </div>
            </div>
            
            <p className="text-white/60">
                If an account exists for <span className="text-white font-medium">{email}</span>, 
                you will receive an email with instructions to reset your password.
            </p>
            
            <p className="text-white/40 text-sm">
                Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="flex flex-col gap-3">
                <Button
                variant="outline"
                onClick={() => setSent(false)}
                className="w-full border-white/10 text-white hover:bg-white/5"
                >
                Try again
                </Button>
                
                <Link href="/auth/login">
                <Button variant="ghost" className="w-full text-primary hover:text-primary/80">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                </Button>
                </Link>
            </div>
            </div>
        </AuthLayout>
        );
    }

    return (
        <AuthLayout
        title="Forgot password?"
        subtitle="No worries, we'll send you reset instructions"
        >
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary pl-10"
                />
            </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-6"
            >
                {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                'Send reset link'
                )}
            </Button>
            </motion.div>

            <Link href="/auth/login">
            <Button variant="ghost" className="w-full text-white/60 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
            </Button>
            </Link>
        </form>
        </AuthLayout>
    );
}