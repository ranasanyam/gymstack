'use client';
import * as React from 'react';
import { useState } from 'react';
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { Input } from "@/app/components/ui/input";
import { Button } from '@/app/components/ui/button';
import { Label } from "@/app/components/ui/label";
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signUp } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
export default function SignUp() {
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        mobileNumber: '',
        city: '',
        gender: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle signup logic here
        setLoading(true);

        try {

            const { data, error } = await signUp(formData.email, formData.password, { 
                full_name: formData.fullName,
                mobile_number: formData.mobileNumber,
                city: formData.city,
                gender: formData.gender || undefined,
            });



            if(error) {
                toast({
                    variant: 'destructive',
                    title: 'Signup failed',
                    description: error.message,
                });
                setLoading(false);
                return;
            }
            
            toast({
                title: 'Account created!',
                // description: 'Please check your email to verify your account.',
                description: 'Welcome to GymStack 🎉'
            });
            // redirect user to select role page
            router.push('/auth/select-role');
            
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
            })
        } finally {
            setLoading(false);
        }
    }
    return (
        <AuthLayout
        title="Create your account"
        subtitle="Get started with GymStack today"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="sapce-y-2">
                    <Label htmlFor="fullName" className="text-white/80">Full Name *</Label>
                    <Input 
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="mobileNumber" className="text-white/80">Mobile Number *</Label>
                        <Input
                        id="mobileNumber"
                        type="tel"
                        placeholder="9876543210"
                        value={formData.mobileNumber}
                        onChange={(e) => handleChange('mobileNumber', e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-white/80">City *</Label>
                        <Input
                        id="city"
                        type="text"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
                        />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80">Password *</Label>
                    <div className="relative">
                        <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                        minLength={6}
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
                            Create Account
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                        )}
                    </Button>
                </motion.div>
                <p className='text-center text-white/60'>
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Log in
                </Link>
                </p>
            </form>
        </AuthLayout>
    )
}