import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '../integrations/supabase/types';

type MembershipType = Database['public']['Enums']['membership_type'];

export interface GymMember {
  id: string;
  user_id: string;
  gym_id: string;
  membership_type: MembershipType;
  start_date: string;
  end_date: string | null;
  assigned_trainer_id: string | null;
  membership_plan_id: string | null;
  registration_id: string | null;
  avatar_url: string | null;
  payment_received: boolean | null;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string;
    mobile_number: string;
    email: string | null;
    avatar_url: string | null;
    gender: string | null;
    date_of_birth: string | null;
    address: string | null;
    goals: string[] | null;
  };
  membership_plan?: {
    id: string;
    name: string;
    duration_months: number;
    price: number;
  };
  gym?: {
    id: string;
    name: string;
  };
}

export interface CreateMemberInput {
  gym_id: string;
  mobile_number: string;
  full_name: string;
  membership_type: MembershipType;
  end_date?: string;
  assigned_trainer_id?: string;
  membership_plan_id?: string;
  registration_id?: string;
  avatar_url?: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  goals?: string[];
  payment_received?: boolean;
}

export function useGymMembers(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gym-members', gymId],
    queryFn: async () => {
      if (!gymId) return [];
      
      // First get members
      const { data: members, error } = await supabase
        .from('gym_members')
        .select('*, membership_plan:membership_plans(id, name, duration_months, price)')
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!members || members.length === 0) return [];

      // Get profiles for all members
      const userIds = members.map(m => m.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, mobile_number, email, avatar_url, gender, date_of_birth, address, goals')
        .in('user_id', userIds);

      // Combine data
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      return members.map(member => ({
        ...member,
        profile: profileMap.get(member.user_id) || null,
      })) as GymMember[];
    },
    enabled: !!gymId,
  });
}

export function useGymMemberCount(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gym-member-count', gymId],
    queryFn: async () => {
      if (!gymId) return 0;
      const { count, error } = await supabase
        .from('gym_members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!gymId,
  });
}

export function useMemberById(memberId: string | undefined) {
  return useQuery({
    queryKey: ['member', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      
      const { data: member, error } = await supabase
        .from('gym_members')
        .select('*, membership_plan:membership_plans(id, name, duration_months, price), gym:gyms(id, name)')
        .eq('id', memberId)
        .maybeSingle();

      if (error) throw error;
      if (!member) return null;

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id, full_name, mobile_number, email, avatar_url, gender, date_of_birth, address, goals')
        .eq('user_id', member.user_id)
        .maybeSingle();

      return { ...member, profile } as GymMember;
    },
    enabled: !!memberId,
  });
}

export function useMemberMemberships(userId: string | undefined) {
  return useQuery({
    queryKey: ['member-memberships', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('gym_members')
        .select('*, gym:gyms(id, name, address, city), membership_plan:membership_plans(id, name, duration_months, price)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMemberInput) => {
      // Use edge function to avoid session switch
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/create-member`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            gym_id: input.gym_id,
            full_name: input.full_name,
            mobile_number: input.mobile_number,
            email: input.email,
            gender: input.gender,
            date_of_birth: input.date_of_birth,
            address: input.address,
            city: input.city,
            goals: input.goals,
            membership_type: input.membership_type,
            membership_plan_id: input.membership_plan_id,
            end_date: input.end_date,
            registration_id: input.registration_id,
            avatar_url: input.avatar_url,
            payment_received: input.payment_received,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add member');
      }

      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gym-members', variables.gym_id] });
      queryClient.invalidateQueries({ queryKey: ['gym-member-count', variables.gym_id] });
      toast.success('Member added successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GymMember> & { id: string }) => {
      const { data, error } = await supabase
        .from('gym_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-members'] });
      queryClient.invalidateQueries({ queryKey: ['member'] });
      toast.success('Member updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gym_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-members'] });
      queryClient.invalidateQueries({ queryKey: ['gym-member-count'] });
      toast.success('Member removed successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
