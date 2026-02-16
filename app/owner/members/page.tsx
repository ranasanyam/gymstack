'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Select, SelectContent,SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { useOwnerGyms } from '@/app/hooks/useGyms';
import { differenceInDays } from 'date-fns';
import { MoreVertical, Search, UserPlus, Users, Edit, Trash2, Building2, Clock, Plus } from 'lucide-react';
import { useGymMembers, useDeactivateMember } from '@/app/hooks/useMembers';
import { AddMemberModal } from '@/app/components/gym/AddMemberModal';

export default function OwnerMembers() {
    const router = useRouter();
    const navigate = router.push;
    const { data: gyms } = useOwnerGyms();
    const [selectedGym, setSelectedGym] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Set selectedGym to first gym's ID when gyms load
    useEffect(() => {
        if (gyms && gyms.length > 0 && !selectedGym) {
            setSelectedGym(gyms[0].id);
        }
    }, [gyms, selectedGym]);

    const gymId = selectedGym || gyms?.[0]?.id;
   
    const { data: members, isLoading } = useGymMembers(gymId);
    const deleteMember = useDeactivateMember();



    const filteredMembers = searchQuery ? members?.filter(member => 
        member.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.profile?.mobile_number?.toString().includes(searchQuery)
    ) : members;


    const getGymName = () => gyms?.find(g => g.id === gymId)?.name || '';
    return (
        <DashboardLayout title="Members">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <Select value={selectedGym || gyms?.[0]?.id || ''} onValueChange={setSelectedGym}>
                        <SelectTrigger className='w-50'>
                            <SelectValue placeholder="Select gym" />
                        </SelectTrigger>
                        <SelectContent>
                            {gyms?.map(gym => (
                                <SelectItem key={gym.id} value={gym.id}>{gym.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                    className='bg-gradient-primary hover:opacity-90'
                    onClick={() => setIsAddDialogOpen(true)}
                    >
                        <UserPlus className='w-4 h-4 mr-2' />
                        Add Member
                    </Button>
                </div>
                <div className="relative max-w-md">
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <Input placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
                </div>
                <div className='flex items-center gap-2 mb-4'>
                    <Users className='w-5 h-5 text-primary' />
                    <span className='font-semibold'>Members ({filteredMembers?.length || 0})</span>
                </div>

                {isLoading ? (
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[1,2,3].map(i => <Skeleton key={i} className='h-32 w-full' />)}
                    </div>
                ) : filteredMembers && filteredMembers?.length > 0 ? (
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {filteredMembers?.map((member, i) => {
                            const daysLeft = member.end_date ? differenceInDays(new Date(member.end_date), new Date()) : null;
                            return (
                                <motion.div key={member.id} initial={{ opacity: 0, y: 20}} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                    <Card className='cursor-pointer hover:border-[#f97015]/50' onClick={() => navigate(`/owner/members/${member.id}`)}>
                                        <CardContent className='p-4'>
                                            <div className='flex items-start gap-4'>
                                                <Avatar className="h-12 w-12">
                                                    {member?.avatar_url ? (
                                                        <AvatarImage src={member?.avatar_url} alt={member?.profile?.full_name} ></AvatarImage>
                                                    ) : null}
                                                    <AvatarFallback className='bg-[#f97015]/10 text-primary'>
                                                        {member?.profile?.full_name?.charAt(0) || 'M'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex-1 min-w-0'>
                                                    <div className='flex justify-between'>
                                                        <div className='min-w-0 flex-1'>
                                                            <h3 className='font-semibold truncate'>{member?.profile?.full_name || 'Unknow'}</h3>
                                                            <p className='text-sm text-muted-foreground'>{member?.profile?.mobile_number}</p>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                                                                <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={e => { e.stopPropagation(); navigate(`/owner/members/${member.id}`); }}>
                                                                    <Edit className="w-4 h-4 mr-2" />View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                className="text-destructive" 
                                                                onClick={e => { e.stopPropagation(); deleteMember.mutate(member.id); }}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />Remove
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <div className='flex gap-2 mt-2'>
                                                        <Badge variant={member?.membership_type === 'paid' ? 'default' : 'secondary'}>
                                                            {member?.membership_type?.toUpperCase()}
                                                        </Badge>
                                                        {member?.membership_plan && (
                                                            <Badge variant="outline" className='text-sm font-medium'>
                                                                {member?.membership_plan?.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className='flex gap-4 mt-2 text-xs text-muted-foreground'>
                                                        <span className='flex items-center gap-1'>
                                                            <Building2 className='w-3 h-3' />
                                                            {getGymName()}
                                                        </span>
                                                        {daysLeft !== null && (
                                                            <span className={`flex items-center gap-1 ${daysLeft < 7 ? 'text-destructive' : ''}`}>
                                                                <Clock className='w-3 h-3' />
                                                                {daysLeft > 0 ? `${daysLeft} days`: 'Expired'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className='p-12 text-center'>
                            <Users className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
                            <p className='text-muted-foreground'>No members yet.</p>
                            <Button onClick={() => setIsAddDialogOpen(true)} className='mt-4 bg-gradient-primary'>
                                <Plus className='w-4 h-4 mr-2' />
                                Add Member
                            </Button>
                        </CardContent>
                    </Card>
                )} 
            </div>
            {gymId && (
                <AddMemberModal 
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                gymId={gymId}
                gymName={getGymName()}
                />
            )}
        </DashboardLayout>
    )
}