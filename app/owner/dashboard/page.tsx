'use client';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/app/components/layout/DashboardLayout';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  Users, 
  Building2, 
  CreditCard, 
  TrendingUp,
  Calendar,
  Dumbbell,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OwnerDashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const navigate = router.push;

  const stats = [
    { title: 'Total Members', value: 156, icon: Users, change: '+12% from last month', changeType: 'positive' as const },
    { title: 'Active Gyms', value: 3, icon: Building2, change: '2 pending setup', changeType: 'neutral' as const },
    { title: 'Monthly Revenue', value: '₹1.2L', icon: CreditCard, change: '+8% from last month', changeType: 'positive' as const },
    { title: 'Attendance Rate', value: '78%', icon: TrendingUp, change: '+5% this week', changeType: 'positive' as const },
  ];

  const quickActions = [
    { title: 'Add New Member', description: 'Register a new gym member', icon: Users, path: '/owner/members' },
    { title: 'Create Workout Plan', description: 'Design a new workout routine', icon: Dumbbell, path: '/owner/workouts' },
    { title: 'View Reports', description: 'Check your gym analytics', icon: TrendingUp, path: '/owner/reports' },
    { title: 'Schedule', description: 'Manage gym schedules', icon: Calendar, path: '/owner/attendance' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-primary rounded-2xl p-8 text-white"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0]}! 💪
          </h1>
          <p className="text-white/80 mb-6">
            Here's what's happening with your gyms today.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => navigate('/owner/gyms')}
            >
              Manage Gyms
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white/10 hover:bg-white/20 text-white border-0"
              onClick={() => navigate('/owner/add-gym')}
            >
              Add New Gym
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => navigate(action.path)}
                className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 transition-colors group"
              >
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3 group-hover:bg-primary/20 transition-colors">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">
              Recent Members
            </h3>
            <div className="space-y-4">
              {['Rahul Sharma', 'Priya Singh', 'Amit Kumar'].map((name, i) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">Joined {i + 1} day ago</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">
              Today's Attendance
            </h3>
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <p className="text-5xl font-display font-bold text-primary">42</p>
                <p className="text-muted-foreground mt-2">Members checked in today</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
