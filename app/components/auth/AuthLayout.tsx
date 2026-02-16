import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-display font-bold text-white">
                GymStack
              </span>
            </div>
            <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
              Transform Your<br />
              <span className="text-gradient">Gym Business</span>
            </h1>
            <p className="text-lg text-white/70 max-w-md">
              Manage members, trainers, workouts, and payments all in one powerful platform designed for modern gyms.
            </p>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-black/50 to-transparent" />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-white">
              GymStack
            </span>
          </div>

          <div className="glass rounded-2xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-white/60">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
