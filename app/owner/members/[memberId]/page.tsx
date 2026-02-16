'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    User,
    Calendar,
    CreditCard,
    Activity,
    Edit2, 
    Save, 
    X
} from 'lucide-react';
import { DashboardLayout } from '@/app/components/layout/DashboardLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Avatar, AvatarFallback} from '@/app/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useMemberById, useUpdateMember } from '@/app/hooks/useMembers';
import { useMemberPaymentHistory } from '@/app/hooks/usePayments';
import { useMembershipPlans } from '@/app/hooks/useGyms';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export default function MemberDetails() {
    const { memberId } = useParams();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('details');


    const { data: member, isLoading } = useMemberById(memberId?.toString());
    const { data: payments } = useMemberPaymentHistory(memberId?.toString());
    const { data: plans } = useMembershipPlans(member?.gym_id);
    const updateMember = useUpdateMember();


    const [editForm, setEditForm] = useState({
        membership_type: '',
        end_date: '',
        membership_plan_id: ''
    });


    const handleEdit = () => {
        if (member) {
            setEditForm({
                membership_type: member.membership_type,
                end_date: member.end_date || '',
                membership_plan_id: member.membership_plan_id || ''
            });
            setIsEditing(true);
        }
    }

    const handleSave = async () => {
        if (!memberId) return;
        console.log('updateing')
        // try {
        //     await updateMember.mutateAsync({
        //         id: memberId.toString(),
        //         membership_type: editForm.membership_type as any,
        //         end_date: editForm.end_date || null,
        //         membership_plan_id: editForm.membership_plan_id || null
        //     });
        //     setIsEditing(false);
        // } catch (err) {
        //     toast.error('Failed to update member')
        // }
    }
    if (isLoading) {
        return (
        <DashboardLayout title="Member Details">
            <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            </div>
        </DashboardLayout>
        );
    }
 
    if (!member) {
        return (
        <DashboardLayout title="Member Not Found">
            <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Member not found</h2>
            <Button onClick={() => router.push('/owner/members')}>Back to Members</Button>
            </div>
        </DashboardLayout>
        );
    }
    
    const daysRemaining = member.end_date
        ? differenceInDays(new Date(member.end_date), new Date())
        : null;

    return (
        <DashboardLayout title="Member Details">
            <div className="space-y-6">
                {/* Back Button & Header */}
                <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/owner/members')}>
                    <ArrowLeft className="w-5 h-5 cursor-pointer" />
                </Button>
                <div className="flex-1 flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-[#f97015]/10 text-primary text-2xl">
                        {member.profile?.full_name?.charAt(0) || 'M'}
                    </AvatarFallback>
                    </Avatar>
                    <div>
                    <h1 className="text-2xl font-display font-bold">{member.profile?.full_name || 'Unknown'}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={member.membership_type === 'paid' ? 'default' : 'secondary'}>
                        {member.membership_type.toUpperCase()}
                        </Badge>
                        {member.registration_id && (
                        <span className="text-sm text-muted-foreground">ID: {member.registration_id}</span>
                        )}
                    </div>
                    </div>
                </div>
                {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={updateMember.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                    </div>
                )}
                </div>
        
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card">
                    <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Gym</p>
                    <p className="font-semibold">{member.gym?.name || 'N/A'}</p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                    <p className={`font-semibold ${daysRemaining !== null && daysRemaining < 7 ? 'text-destructive' : ''}`}>
                        {daysRemaining !== null ? (daysRemaining > 0 ? `${daysRemaining} days` : 'Expired') : 'No end date'}
                    </p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Payments</p>
                    <p className="font-semibold">{payments?.length || 0}</p>
                    </CardContent>
                </Card>
                {/* <Card className="bg-card">
                    <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="font-semibold">{attendance?.length || 0} check-ins</p>
                    </CardContent>
                </Card> */}
                </div>
        
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full max-w-md">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="membership">Membership</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                </TabsList>
        
                <TabsContent value="details" className="mt-6">
                    <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                        <div>
                            <Label className="text-muted-foreground">Full Name</Label>
                            <p className="font-medium">{member.profile?.full_name || '-'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Mobile Number</Label>
                            <p className="font-medium">{member.profile?.mobile_number || '-'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{member.profile?.email || '-'}</p>
                        </div>
                        </div>
                        <div className="space-y-4">
                        <div>
                            <Label className="text-muted-foreground">Gender</Label>
                            <p className="font-medium capitalize">{member.profile?.gender || '-'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Date of Birth</Label>
                            <p className="font-medium">
                            {member.profile?.date_of_birth
                                ? format(new Date(member.profile.date_of_birth), 'MMM d, yyyy')
                                : '-'}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Address</Label>
                            <p className="font-medium">{member.profile?.address || '-'}</p>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                </TabsContent>
        
                <TabsContent value="membership" className="mt-6">
                    <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Membership Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditing ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                            <Label>Membership Type</Label>
                            <Select
                                value={editForm.membership_type}
                                onValueChange={(v) => setEditForm(prev => ({ ...prev, membership_type: v }))}
                            >
                                <SelectTrigger>
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="personal">Personal</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                            <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={editForm.end_date}
                                onChange={(e) => setEditForm(prev => ({ ...prev, end_date: e.target.value }))}
                            />
                            </div>
                            {plans && plans.length > 0 && (
                            <div className="space-y-2">
                                <Label>Membership Plan</Label>
                                <Select
                                value={editForm.membership_plan_id}
                                onValueChange={(v) => setEditForm(prev => ({ ...prev, membership_plan_id: v }))}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map(plan => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name} - ₹{plan.price}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            )}
                        </div>
                        ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                            <Label className="text-muted-foreground">Membership Type</Label>
                            <p className="font-medium capitalize">{member.membership_type}</p>
                            </div>
                            <div>
                            <Label className="text-muted-foreground">Start Date</Label>
                            <p className="font-medium">{format(new Date(member.start_date), 'MMM d, yyyy')}</p>
                            </div>
                            <div>
                            <Label className="text-muted-foreground">End Date</Label>
                            <p className="font-medium">
                                {member.end_date ? format(new Date(member.end_date), 'MMM d, yyyy') : 'No end date'}
                            </p>
                            </div>
                            <div>
                            <Label className="text-muted-foreground">Plan</Label>
                            <p className="font-medium">{member.membership_plan?.name || 'No plan'}</p>
                            </div>
                        </div>
                        )}
                    </CardContent>
                    </Card>
                </TabsContent>
        
                <TabsContent value="payments" className="mt-6">
                    <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {payments && payments.length > 0 ? (
                        <div className="space-y-3">
                            {payments.map(payment => (
                            <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                <p className="font-medium">₹{payment.amount}</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(payment.payment_date), 'MMM d, yyyy')}
                                </p>
                                </div>
                                <div className="text-right">
                                <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                                    {payment.status?.toUpperCase()}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">
                                    {payment.payment_method}
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <p className="text-center text-muted-foreground py-8">No payment history</p>
                        )}
                    </CardContent>
                    </Card>
                </TabsContent>
        
                {/* <TabsContent value="attendance" className="mt-6">
                    <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {attendance && attendance.length > 0 ? (
                        <div className="space-y-2">
                            {attendance.slice(0, 20).map(record => (
                            <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-full">
                                    <Activity className="w-4 h-4 text-green-500" />
                                </div>
                                <span className="font-medium">
                                    {format(new Date(record.check_in_time), 'MMM d, yyyy')}
                                </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                {format(new Date(record.check_in_time), 'h:mm a')}
                                </span>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <p className="text-center text-muted-foreground py-8">No attendance records</p>
                        )}
                    </CardContent>
                    </Card>
                </TabsContent> */}
                </Tabs>
            </div>
            </DashboardLayout>
    )
}