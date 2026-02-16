'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Users,
    Dumbbell,
    CreditCard,
    Star,
    Plus,
    Pencil,
    Wrench,
    Landmark,
    Wallet
} from 'lucide-react';
import { DashboardLayout } from '@/app/components/layout/DashboardLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { useGymById, useMembershipPlans } from '@/app/hooks/useGyms';
import { useGymMembers, useGymMemberCount } from '@/app/hooks/useMembers';
import { useGymTrainers } from '@/app/hooks/useTrainers';
import { useGymRevenue } from '@/app/hooks/usePayments';
import { AddMemberModal } from '@/app/components/gym/AddMemberModal';
import { EditGymModal } from '@/app/components/gym/EditGymModal';
import { EditFacilitiesModal } from '@/app/components/gym/EditFacilities';
import { EditServicesModal } from '@/app/components/gym/EditServicesModal';
import { EditMembershipPlansModal } from '@/app/components/gym/EditMembershipPlansModal';
import { format, differenceInDays } from 'date-fns';



const FACILITIES_MAP: Record<string, { label: string; icon: string }> = {
  ac: { label: 'AC', icon: '❄️' },
  cardio: { label: 'Cardio', icon: '🏃' },
  cctv: { label: 'CCTV', icon: '📹' },
  fire_protection: { label: 'Fire Protection', icon: '🔥' },
  hot_water: { label: 'Hot Water', icon: '♨️' },
  locker: { label: 'Locker', icon: '🔐' },
  parking: { label: 'Parking', icon: '🅿️' },
  security: { label: 'Security', icon: '🛡️' },
  shower: { label: 'Shower', icon: '🚿' },
  speakers: { label: 'Speakers', icon: '🔊' },
  trainers: { label: 'Trainers', icon: '💪' },
  weight: { label: 'Weight', icon: '🏋️' },
  wifi: { label: 'WiFi', icon: '📶' },
  workout: { label: 'Workout', icon: '🏋️‍♂️' },
};

const SERVICES_MAP: Record<string, { label: string; icon: string }> = {
  personal_training: { label: 'Personal Training', icon: '👤' },
  group_classes: { label: 'Group Classes', icon: '👥' },
  yoga: { label: 'Yoga', icon: '🧘' },
  zumba: { label: 'Zumba', icon: '💃' },
  crossfit: { label: 'CrossFit', icon: '🏋️' },
  boxing: { label: 'Boxing', icon: '🥊' },
  nutrition: { label: 'Nutrition Counseling', icon: '🥗' },
  physiotherapy: { label: 'Physiotherapy', icon: '🩺' },
  massage: { label: 'Massage', icon: '💆' },
  steam_sauna: { label: 'Steam/Sauna', icon: '♨️' },
  supplements: { label: 'Supplements', icon: '💊' },
  diet_plan: { label: 'Diet Planning', icon: '📋' },
};


export default function GymDetails() {
    const params = useParams();
    const router = useRouter();
    const navigate = router.push;
    const gymId = params.gymId as string;
    const [activeTab, setActiveTab] = useState('details');
    const [showAddMember, setShowAddMember] = useState(false);
    const [showEditGym, setShowEditGym] = useState(false);
    const [showEditFacilities, setShowEditFacilities] = useState(false);
    const [showEditServices, setShowEditServices] = useState(false);
    const [showEditMembershipPlans, setShowEditMembershipPlans] = useState(false);


    const { data: gym, isLoading: gymLoading } = useGymById(gymId);
    const { data: members } = useGymMembers(gymId);
    const { data: memberCount } = useGymMemberCount(gymId);
    const { data: trainers } = useGymTrainers(gymId);
    const { data: revenue } = useGymRevenue(gymId);
    const { data: plans } = useMembershipPlans(gymId);

    

    if(gymLoading) {
        return (
            <DashboardLayout title="Gym Details">
                <div className='space-y-6'>
                    <Skeleton className='h-48 w-full' />
                    <Skeleton className='h-96 w-full' />
                </div>
            </DashboardLayout>
        )
    }

    if(!gym) {
        return (
            <DashboardLayout title="Gym Not Found">
                <div className='text-center py-12'>
                    <h2 className='text-xl font-semibold mb-4'>Gym Not Found</h2>
                    <Button onClick={() => navigate('/owner/gyms')}>Back to Gyms</Button>
                </div>
            </DashboardLayout>
        )
    }


    return (
        <DashboardLayout title={gym.name}>
            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Button variant='ghost' size="icon" onClick={() => navigate('/owner/gyms')}>
                        <ArrowLeft className='w-5 h-5' />
                    </Button>
                    <div className='flex-1'>
                        <h1 className='text-2xl font-display font-bold'>{gym?.name}</h1>
                        <p className='text-muted-foreground'>{gym?.address}, {gym?.city}</p>
                    </div>
                    <Badge variant={gym?.is_active ? 'default' : 'secondary'}>
                        {gym?.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <Card className='bg-card'>
                        <CardContent className='p-4 flex items-center gap-3'>
                            <div className='p-2 bg-[#f97015]/10 rounded-lg'>
                                <Users className='w-5 h-5 text-primary' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold'>{memberCount || 0}</p>
                                <p className='text-xs text-muted-foreground'>Members</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='bg-card'>
                        <CardContent className='p-4 flex items-center gap-3'>
                            <div className='p-2 bg-green-500/10 rounded-lg'>
                                <Dumbbell className='w-5 h-5 text-green-500' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold'>{trainers?.length || 0}</p>
                                <p className='text-xs text-muted-foreground'>Trainers</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='bg-card'>
                        <CardContent className='p-4 flex items-center gap-3'>
                            <div className='p-2 bg-amber-500/10 rounded-lg'>
                                <Wallet className='w-5 h-5 text-amber-500' />
                            </div>
                            <div>
                                <p className='text-2xl font-bold'>₹{revenue?.thisMonth?.toLocaleString() || 0}</p>
                                <p className='text-xs text-muted-foreground'>This Month</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card">
                        <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Landmark className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">₹{revenue?.total?.toLocaleString() || 0}</p>
                            <p className="text-xs text-muted-foreground">Total Revenue</p>
                        </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex w-full justify-start overflow-x-auto tabs-scroll-hide md:grid md:grid-cols-6 gap-0">
                        <TabsTrigger value="details" className="shrink-0 md:shrink">Details</TabsTrigger>
                        <TabsTrigger value="members" className="shrink-0 md:shrink">Members</TabsTrigger>
                        <TabsTrigger value="trainers" className="shrink-0 md:shrink">Trainers</TabsTrigger>
                        <TabsTrigger value="facilities" className="shrink-0 md:shrink">Facilities</TabsTrigger>
                        <TabsTrigger value="services" className="shrink-0 mdshrink">Services</TabsTrigger>
                        <TabsTrigger value="plans" className="shrink-0 md:shrink">Plans</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowEditGym(true)}>
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                            </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p className="font-medium">{gym.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <p className="text-sm text-muted-foreground">City</p>
                                <p className="font-medium">{gym.city}</p>
                                </div>
                                {gym.state && (
                                <div>
                                    <p className="text-sm text-muted-foreground">State</p>
                                    <p className="font-medium">{gym.state}</p>
                                </div>
                                )}
                            </div>
                            {gym.pincode && (
                                <div>
                                <p className="text-sm text-muted-foreground">Pincode</p>
                                <p className="font-medium">{gym.pincode}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">Contact</p>
                                <p className="font-medium">{gym.contact_number}</p>
                            </div>
                            </CardContent>
                        </Card>

                        {/* {gym.services && gym.services.length > 0 && (
                            <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Services Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                {gym.services.slice(0, 6).map(service => (
                                    <Badge key={service} variant="outline" className="text-sm">
                                    {SERVICES_MAP[service]?.icon} {SERVICES_MAP[service]?.label || service}
                                    </Badge>
                                ))}
                                {gym.services.length > 6 && (
                                    <Badge variant="secondary">+{gym.services.length - 6} more</Badge>
                                )}
                                </div>
                            </CardContent>
                            </Card>
                        )} */}
                        </div>
                    </TabsContent>

                    <TabsContent value="members" className="mt-6">
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Members ({members?.length || 0})</CardTitle>
                            <Button size="sm" onClick={() => setShowAddMember(true)}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add Member
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {members && members.length > 0 ? (
                            <div className="space-y-3">
                                {members.map(member => {
                                const daysRemaining = member.end_date
                                    ? differenceInDays(new Date(member.end_date), new Date())
                                    : null;
                                return (
                                    <div
                                    key={member.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                                    onClick={() => navigate(`/owner/members/${member.id}`)}
                                    >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                        {member.avatar_url ? (
                                            <AvatarImage src={member.avatar_url} alt={member.profile?.full_name} />
                                        ) : null}
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {member.profile?.full_name?.charAt(0) || 'M'}
                                        </AvatarFallback>
                                        </Avatar>
                                        <div>
                                        <p className="font-medium">{member.profile?.full_name || 'Unknown'}</p>
                                        <p className="text-sm text-muted-foreground">{member.profile?.mobile_number}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={member.membership_type === 'paid' ? 'default' : 'secondary'}>
                                        {member.membership_type}
                                        </Badge>
                                        {daysRemaining !== null && (
                                        <p className={`text-xs mt-1 ${daysRemaining < 7 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                                        </p>
                                        )}
                                    </div>
                                    </div>
                                );
                                })}
                            </div>
                            ) : (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No members yet</p>
                                <Button className="mt-4" onClick={() => setShowAddMember(true)}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add First Member
                                </Button>
                            </div>
                            )}
                        </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="trainers" className="mt-6">
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Trainers ({trainers?.length || 0})</CardTitle>
                            <Button size="sm" onClick={() => navigate('/owner/trainers')}>
                            Manage Trainers
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {trainers && trainers.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {trainers.map(trainer => (
                                <div key={trainer.id} className="flex items-center gap-3 p-3 rounded-lg border">
                                    <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-green-500/10 text-green-500">
                                        {trainer.profile?.full_name?.charAt(0) || 'T'}
                                    </AvatarFallback>
                                    </Avatar>
                                    <div>
                                    <p className="font-medium">{trainer.profile?.full_name || 'Unknown'}</p>
                                    <p className="text-sm text-muted-foreground">{trainer.specialization || 'General'}</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <p className="text-center text-muted-foreground py-8">No trainers yet</p>
                            )}
                        </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="facilities" className="mt-6">
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Facilities</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowEditFacilities(true)}>
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {gym.facilities && gym.facilities.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {gym.facilities.map(facility => (
                                <div key={facility} className="p-3 rounded-lg border bg-accent/30 flex items-center gap-2">
                                    <span className="text-lg">{FACILITIES_MAP[facility]?.icon || '✓'}</span>
                                    <span className="text-sm font-medium">
                                    {FACILITIES_MAP[facility]?.label || facility}
                                    </span>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No facilities added</p>
                                <Button variant="outline" onClick={() => setShowEditFacilities(true)}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add Facilities
                                </Button>
                            </div>
                            )}
                        </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="services" className="mt-6">
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Services</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowEditServices(true)}>
                            <Pencil className="w-4 h-4 mr-1" />
                            {gym?.services && gym?.services?.length > 0 ? "Edit" : "Add"}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {gym.services && gym.services.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {gym.services.map(service => (
                                <div key={service} className="p-3 rounded-lg border bg-accent/30 flex items-center gap-2">
                                    <span className="text-lg">{SERVICES_MAP[service]?.icon || '✓'}</span>
                                    <span className="text-sm font-medium">
                                    {SERVICES_MAP[service]?.label || service}
                                    </span>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="text-center py-8">
                                <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">No services added</p>
                                <Button variant="outline" onClick={() => setShowEditServices(true)}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add Services
                                </Button>
                            </div>
                            )}
                        </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="plans" className="mt-6">
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Membership Plans</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowEditMembershipPlans(true)}>
                                <Pencil className="w-4 h-4 mr-1" />
                                {plans?.length === 0 ? 'Add New Plan' : 'Edit Plans'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {plans && plans.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {plans.map(plan => (
                                <div key={plan.id} className="p-4 rounded-lg border bg-accent/30">
                                    <h4 className="font-semibold text-lg">{plan.name}</h4>
                                    <p className="text-2xl font-bold text-primary mt-2">
                                    ₹{plan.price.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                    {plan.duration_months} {plan.duration_months === 1 ? 'month' : 'months'}
                                    </p>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <p className="text-center text-muted-foreground py-8">No membership plans added</p>
                            )}
                        </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            {/* Modals */}
            <AddMemberModal
                open={showAddMember}
                onOpenChange={setShowAddMember}
                gymId={gymId!}
                gymName={gym.name}
            />

            {gym && (
                <>
                <EditGymModal
                    open={showEditGym}
                    onOpenChange={setShowEditGym}
                    gym={gym}
                />
                <EditFacilitiesModal
                    open={showEditFacilities}
                    onOpenChange={setShowEditFacilities}
                    gymId={gym.id}
                    currentFacilities={gym.facilities || []}
                />
                <EditServicesModal
                    open={showEditServices}
                    onOpenChange={setShowEditServices}
                    gymId={gym.id}
                    currentServices={gym.services || []}
                />
                <EditMembershipPlansModal 
                open={showEditMembershipPlans}
                onOpenChange={setShowEditMembershipPlans}
                gymId={gym.id}
                />
                </>
            )}
        </DashboardLayout>
    )
}