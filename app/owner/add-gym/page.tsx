'use client';
import React, { use, useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, MapPin, Upload, ArrowRight, Loader2 } from 'lucide-react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { useAuth } from '@/app/contexts/AuthContext';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
import { supabase } from '@/app/integrations/supabase/client';


export default function AddGym() {
    const { user } = useAuth();
    const router = useRouter();
    const toast = useToast();
    const navigate = router.push;

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        contactNumber: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle add gym logic here
        if (!user) return;
        setLoading(true);

        try {
            const { error } = await supabase.from('gyms').insert({
                owner_id: user.id,
                name: formData.name,
                address: formData.address,
                city: formData.city,
                contact_number: formData.contactNumber,
            });
            if(error) {
                // toast({

                // })
                alert('Failed to add gym: ' + error.message);
                setLoading(false);
                return;
            }
            alert('Gym added successfully!');
            navigate('/owner/dashboard');
        } catch (err) {
            // toast({
            //     variant: 'destructive',
            //     title: 'Error',
            //     description: 'An unexpected error occurred',
            // });
            alert('An unexpected error occurred');

        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='w-full max-w-2xl'
            >
                <div className='flex items-center gap-3 mb-8 justify-center'>
                    <div className='p-3 bg-gradient-primary rounded-xl'>
                        <Dumbbell className='w-8 h-8 text-white' />
                    </div>
                    <span className="text-3xl font-display font-bold text-white">
                        GymStack
                    </span>
                </div>          
                <div className='glass rounded-2xl p-8'>
                    <div className='mb-8'>
                        <h1 className='text-2xl font-display font-bold text-white mb-2'>
                            Add Your Gym
                        </h1>
                        <p className='text-white/60'>
                        Enter your gym details to get started. You can add more gyms later.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='name' className='text-white/80'>Gym Name</Label>
                            <Input 
                            id="name"
                            type="text"
                            placeholder="Enter your gym name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                            className='bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary'
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-white/80">Address *</Label>
                            <Textarea
                                id="address"
                                placeholder="Enter gym address"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                required
                                rows={3}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-white/80">City *</Label>
                                <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary pl-10"
                                />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber" className="text-white/80">Contact Number *</Label>
                                <Input
                                id="contactNumber"
                                type="tel"
                                placeholder="9876543210"
                                value={formData.contactNumber}
                                onChange={(e) => handleChange('contactNumber', e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-white/80">Gym Images (optional)</Label>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                                {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                                >
                                    <Upload className="w-6 h-6 text-white/40" />
                                </div>
                                ))}
                            </div>
                            <p className="text-xs text-white/40">
                                You can add images later from the gym settings
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/owner/dashboard')}
                                className="flex-1 bg-primary border-white/20 text-white hover:bg-white/10"
                            >
                                Skip for now
                            </Button>
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-2"
                                >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                    Add Gym
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                                </Button>
                            </motion.div>
                        </div>
                    </form>

                </div>


            </motion.div>
        
        </div>
    )
}