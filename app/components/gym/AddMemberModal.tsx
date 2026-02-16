import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMembershipPlans } from '@/app/hooks/useGyms';
import { useAddMember, useGymMemberCount } from '@/app/hooks/useMembers';
import { useCreatePayment } from '@/app/hooks/usePayments';
import { format, addMonths } from 'date-fns';
import { supabase } from '@/app/integrations/supabase/client';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: string;
  gymName?: string;
}

const GOALS_OPTIONS = [
  'Muscle Building',
  'Weight Loss',
  'Weight Gain',
  'General Fitness',
  'Cardio Health',
  'Flexibility',
  'Sports Training',
  'Rehabilitation',
];

export function AddMemberModal({ open, onOpenChange, gymId, gymName }: AddMemberModalProps) {
  const { data: plans } = useMembershipPlans(gymId);
  const { data: memberCount } = useGymMemberCount(gymId);
  const addMember = useAddMember();
  const createPayment = useCreatePayment();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [uploading, setUploading] = useState(false);

  const registrationId = `REG-${String((memberCount || 0) + 1).padStart(4, '0')}`;
  const selectedPlan = plans?.find(p => p.id === selectedPlanId);
  const totalFee = selectedPlan?.price || 0;

  // Auto-calculate end date when plan or start date changes
  useEffect(() => {
    if (selectedPlan && startDate) {
      const start = new Date(startDate);
      const end = addMonths(start, selectedPlan.duration_months);
      setEndDate(format(end, 'yyyy-MM-dd'));
    }
  }, [selectedPlan, startDate]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `member-avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gym-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gym-assets')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const membershipType = selectedPlan ? 'paid' : 'free';

    try {
      const result = await addMember.mutateAsync({
        gym_id: gymId,
        full_name: fullName,
        mobile_number: +mobileNumber,
        email,
        gender,
        goals: selectedGoals,
        date_of_birth: dateOfBirth,
        address,
        city,
        membership_type: membershipType,
        membership_plan_id: selectedPlanId || undefined,
        registration_id: registrationId,
        avatar_url: avatarUrl || undefined,
        end_date: endDate || undefined
      });

      // If payment received, record the payment
      if (paymentReceived && totalFee > 0 && result) {
        await createPayment.mutateAsync({
          member_id: result.id,
          gym_id: gymId,
          amount: totalFee,
          payment_method: 'cash',
          status: 'completed',
        });
      }

      // Reset form
      resetForm();
      onOpenChange(false);
    } catch (err) {
      console.error('Error adding member:', err);
    }
  };

  const resetForm = () => {
    setAvatarUrl('');
    setAvatarFile(null);
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setGender('');
    setSelectedGoals([]);
    setDateOfBirth('');
    setAddress('');
    setCity('');
    setSelectedPlanId('');
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setEndDate('');
    setPaymentReceived(false);
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member {gymName && `to ${gymName}`}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="absolute -top-1 -right-1 p-1 bg-destructive rounded-full"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
            <div>
              <Label htmlFor="avatar" className="cursor-pointer text-primary hover:underline">
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground mt-1">Registration ID: {registrationId}</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label>Fitness Goals</Label>
            <div className="flex flex-wrap gap-2">
              {GOALS_OPTIONS.map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedGoals.includes(goal)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Membership */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Membership Plan</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans?.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price} ({plan.duration_months} months)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold text-primary">₹{totalFee.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Checkbox */}
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="paymentReceived"
              checked={paymentReceived}
              onCheckedChange={(checked) => setPaymentReceived(checked === true)}
            />
            <Label htmlFor="paymentReceived" className="cursor-pointer">
              Check if you received payment
            </Label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMember.isPending || !fullName || !mobileNumber}>
              {addMember.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}