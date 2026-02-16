
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, User, ArrowRight, Loader2, Dumbbell } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useToast } from '@/app/hooks/use-toast';
import { useAuth } from '@/app/contexts/AuthContext';
import { setUserRole } from '@/app/lib/auth';

type RoleOption = 'owner' | 'member';

export default function SelectRole() {
  const router = useRouter();
  const navigate = router.push;
  const { toast } = useToast();
  const { user, refreshRole } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    console.log('Continue clicked with role:', selectedRole);
    if (!selectedRole || !user) {
      console.log('selectedRole or user is missing', selectedRole, user);
      return;
    };
    setLoading(true);

    try {
      const { error } = await setUserRole(user.id, selectedRole);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to set your role. Please try again.',
        });
        setLoading(false);
        return;
      }

      await refreshRole();

      if (selectedRole === 'owner') {
        navigate('/owner/add-gym');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      id: 'owner' as const,
      icon: Building2,
      title: 'I am a Gym Owner',
      description: 'Manage your gym, members, trainers, and grow your fitness business',
    },
    {
      id: 'member' as const,
      icon: User,
      title: 'I am a Member',
      description: 'Find gyms, track workouts, follow diet plans, and achieve your fitness goals',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-display font-bold text-white">
            GymStack
          </span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-3">
            How will you use GymStack?
          </h1>
          <p className="text-white/60">
            Select your role to get started with the right experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {roleOptions.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => setSelectedRole(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-2xl text-left transition-all ${
                selectedRole === option.id
                  ? 'bg-gradient-primary ring-2 ring-primary'
                  : 'glass hover:bg-white/10'
              }`}
            >
              <div
                className={`inline-flex p-3 rounded-xl mb-4 ${
                  selectedRole === option.id
                    ? 'bg-white/20'
                    : 'bg-white/5'
                }`}
              >
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">
                {option.title}
              </h3>
              <p className="text-white/70 text-sm">
                {option.description}
              </p>
              {selectedRole === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedRole ? 1 : 0.5 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className="px-8 py-6 bg-gradient-primary hover:opacity-90 text-white font-semibold text-lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
