'use client';
import { Dumbbell, ArrowRight } from 'lucide-react';
import Link from "next/link";
import { motion } from "framer-motion";
import { stat } from 'fs';

const features = [
    { title: 'Manage Members', description: 'Track memberships, payments, and attendance' },
    { title: 'Workout Plans', description: 'Create personalized weekly workout routines' },
    { title: 'Diet Plans', description: 'Design nutrition plans for your members' },
    { title: 'Analytics', description: 'Get insights into your gym performance' },
  ];
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white">
            GymStack
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href='/auth/login' className="text-white font-medium">
            Log In
          </Link>
          <Link href='/auth/signup' className="px-4 py-2 bg-gradient-primary rounded-lg font-medium flex items-center gap-2">
            Sign Up
          </Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Transform Your<br />
              <span className="text-gradient">Gym Business</span>
            </h1>
            <p className='text-xl text-white/70 max-w-wxl mx-auto mb-10'>
              The all-in-one platform to manage members, trainers, workouts, and payments. 
              Built for modern gyms that want to grow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href='/auth/signup' className="px-4 py-2 bg-gradient-primary rounded-lg font-medium flex items-center gap-2">
              {/* <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6"> */}
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              {/* </Button> */}
            </Link>
            {/* <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Watch Demo
            </Button> */}

            <Link href="#" className="text-white/70 hover:text-white text-sm">
              Watch Demo
            </Link>
          </div>
          </motion.div>


          <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'
          >
            {features.map((feature,index) => (
              <div key={feature.title} className='glass rounded-xl p-6 hover:bg-white/10 transition-colors'>
                <h3 className='text-lg font-display font-semibold text-white mb-2'>
                  {feature.title}
                </h3>
                <p className='text-white/60 text-sm'>{feature.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            {[
              { value: '10K+', label: 'Active Gyms' },
              { value: '500K+', label: 'Members Managed' },
              { value: '50K+', label: 'Trainers' },
              { value: '98%', label: 'Customer Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <h4 className='text-4xl md:text-5xl font-display font-bold text-gradient'>
                  {stat.value}
                </h4>
                <p className='text-white/60 mt-2'>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </main>
                  <footer className="border-t border-white/10 mt-20 py-8">
            <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm">
              © 2024 FitHub. All rights reserved.
            </div>
          </footer>
    </div>
  );
}
