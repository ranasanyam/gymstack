import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '../integrations/supabase/types';

type PaymentMethod = Database['public']['Enums']['payment_method'];
type PaymentStatus = Database['public']['Enums']['payment_status'];

export interface Payment {
  id: string;
  member_id: string;
  gym_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  status: PaymentStatus;
  created_at: string;
  member?: {
    profile?: {
      full_name: string;
      mobile_number: string;
    };
  };
}

export interface CreatePaymentInput {
  member_id: string;
  gym_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status?: PaymentStatus;
}

export function useGymPayments(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gym-payments', gymId],
    queryFn: async () => {
      if (!gymId) return [];
      
      // Get payments
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*, member:gym_members(id, user_id)')
        .eq('gym_id', gymId)
        .order('payment_date', { ascending: false })
        .limit(100);

      if (error) throw error;
      if (!payments || payments.length === 0) return [];

      // Get user IDs from members
      const userIds = payments
        .map(p => (p.member as any)?.user_id)
        .filter(Boolean);

      // Get profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, mobile_number')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return payments.map(payment => ({
        ...payment,
        member: {
          ...(payment.member || {}),
          profile: profileMap.get((payment.member as any)?.user_id) || null,
        },
      })) as Payment[];
    },
    enabled: !!gymId,
  });
}

export function useMemberPaymentHistory(memberId: string | undefined) {
  return useQuery({
    queryKey: ['member-payment-history', memberId],
    queryFn: async () => {
      if (!memberId) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', memberId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
  });
}

export function useMemberPayments(userId: string | undefined) {
  return useQuery({
    queryKey: ['member-payments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // First get member records for this user
      const { data: memberRecords, error: memberError } = await supabase
        .from('gym_members')
        .select('id')
        .eq('user_id', userId);

      if (memberError) throw memberError;
      
      const memberIds = memberRecords?.map(m => m.id) || [];
      if (memberIds.length === 0) return [];

      const { data, error } = await supabase
        .from('payments')
        .select('*, gym:gyms(id, name)')
        .in('member_id', memberIds)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useGymRevenue(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gym-revenue', gymId],
    queryFn: async () => {
      if (!gymId) return { total: 0, thisMonth: 0, lastMonth: 0 };
      
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      const { data, error } = await supabase
        .from('payments')
        .select('amount, payment_date, status')
        .eq('gym_id', gymId)
        .eq('status', 'completed');

      if (error) throw error;

      const total = data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const thisMonth = data?.filter(p => p.payment_date >= thisMonthStart)
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const lastMonth = data?.filter(p => p.payment_date >= lastMonthStart && p.payment_date <= lastMonthEnd)
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      return { total, thisMonth, lastMonth };
    },
    enabled: !!gymId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePaymentInput) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gym-payments', variables.gym_id] });
      queryClient.invalidateQueries({ queryKey: ['gym-revenue', variables.gym_id] });
      queryClient.invalidateQueries({ queryKey: ['member-payment-history'] });
      toast.success('Payment recorded!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-payments'] });
      queryClient.invalidateQueries({ queryKey: ['gym-revenue'] });
      toast.success('Payment status updated!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
