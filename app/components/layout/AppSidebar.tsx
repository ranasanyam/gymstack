'use client';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  Apple,
  Bell,
  BarChart3,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { NavLink } from '../NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/app/components/ui/sidebar';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';
import { AppRole } from '@/app/lib/auth';
import { usePathname } from 'next/navigation';
const ownerMenuItems = [
  { title: 'Dashboard', url: '/owner/dashboard', icon: LayoutDashboard },
  { title: 'Gyms', url: '/owner/gyms', icon: Building2 },
  { title: 'Members', url: '/owner/members', icon: Users },
  { title: 'Trainers', url: '/owner/trainers', icon: UserCog },
  { title: 'Attendance', url: '/owner/attendance', icon: CalendarCheck },
  { title: 'Payments', url: '/owner/payments', icon: CreditCard },
  { title: 'Workout Plans', url: '/owner/workouts', icon: Dumbbell },
  { title: 'Diet Plans', url: '/owner/diets', icon: Apple },
  { title: 'Notifications', url: '/owner/notifications', icon: Bell },
  { title: 'Reports', url: '/owner/reports', icon: BarChart3 },
  { title: 'Settings', url: '/owner/settings', icon: Settings },
];

const trainerMenuItems = [
  { title: 'Dashboard', url: '/trainer/dashboard', icon: LayoutDashboard },
  { title: 'Assigned Members', url: '/trainer/members', icon: Users },
  { title: 'Workout Plans', url: '/trainer/workouts', icon: Dumbbell },
  { title: 'Diet Plans', url: '/trainer/diets', icon: Apple },
  { title: 'Profile', url: '/trainer/profile', icon: User },
];

const memberMenuItems = [
  { title: 'Dashboard', url: '/member/dashboard', icon: LayoutDashboard },
  { title: 'Workout', url: '/member/workout', icon: Dumbbell },
  { title: 'Diet', url: '/member/diet', icon: Apple },
  { title: 'Attendance', url: '/member/attendance', icon: CalendarCheck },
  { title: 'Payments', url: '/member/payments', icon: CreditCard },
  { title: 'Notifications', url: '/member/notifications', icon: Bell },
  { title: 'Profile', url: '/member/profile', icon: User },
];

function getMenuItems(role: AppRole | null) {
  switch (role) {
    case 'owner':
      return ownerMenuItems;
    case 'trainer':
      return trainerMenuItems;
    case 'member':
      return memberMenuItems;
    default:
      return memberMenuItems;
  }
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const pathname = usePathname();
  const router = useRouter();
  const navigate = router.push;
  const { role, profile } = useAuth();

  const menuItems = getMenuItems(role);
  const currentPath = pathname;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <Sidebar
      className={collapsed ? 'w-16' : 'w-64'}
      collapsible="icon"
      style={{ '--sidebar-width': (collapsed ? '3.5rem' : '16rem') } as React.CSSProperties}
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg shrink-0">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-display font-bold text-sidebar-foreground">
              GymStack
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {/* {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider px-3">
              Menu
            </SidebarGroupLabel>
          )} */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      href={item.url}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        currentPath === item.url
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed && profile && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="w-5 h-5 text-sidebar-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile.full_name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
