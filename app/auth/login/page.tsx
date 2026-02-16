'use client';
import * as React from 'react';
import { useState } from 'react';
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { useToast } from '@/app/hooks/use-toast';
import { signIn, getDashoardPath } from '../../lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/app/contexts/AuthContext';
// import { getRoleDashboardPath } from '@/app/lib/auth';
export default function Login() {
    const { toast } = useToast();
    const router = useRouter();
    // const navigate = router.push;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    // const { refreshProfile, refreshRole } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here

        setLoading(true);
        try {
            const response = await signIn(email, password);

            console.log("response", response);
            if(response?.error) {
                toast({
                    variant: 'destructive',
                    title: 'Login failed',
                    description: response?.error?.message,
                });
                setLoading(false);
                return;
            }
            const { role, memberships } = response;

            const redirectPath = getDashoardPath(role, memberships);
            router.push(redirectPath);
            // if(data.user) {
            //     await Promise.all([refreshProfile(), refreshRole()]);

            //     const { supabase } = await import('@/app/integrations/supabase/client');
            //     const { data: roleData } = await supabase
            //         .from('user_roles')
            //         .select('role')
            //         .eq('user_id', data.user.id)
            //         .maybeSingle();
            //     const path = getRoleDashboardPath(roleData?.role as any);
            //     navigate(path);
            // }
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Login failed',
                description: 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to continue"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80">Password</Label>
                    <div className="relative">
                        <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary pr-10"
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                        >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                            Forgot password?
                        </Link>
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
                        <>
                            Sign In
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                        )}
                    </Button>
                </motion.div>
                <p className="text-center text-white/60">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Sign up
                </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
