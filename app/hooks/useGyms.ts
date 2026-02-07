import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export interface Gym {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  city: string;
  state: string | null;
  pincode: string | null;
  contact_number: string;
  gym_images: string[] | null;
  gpay_qr: string | null;
  phonepe_qr: string | null;
  facilities: string[] | null;
  services: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGymInput {
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  contact_number: string;
  gym_images?: string[];
  gpay_qr?: string;
  phonepe_qr?: string;
  facilities?: string[];
  services?: string[];
}

export interface MembershipPlan {
  id: string;
  gym_id: string;
  name: string;
  duration_months: number;
  price: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMembershipPlanInput {
  gym_id: string;
  name: string;
  duration_months: number;
  price: number;
  description?: string;
}

export function useOwnerGyms() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['owner-gyms', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Gym[];
    },
    enabled: !!user,
  });
}

export function useGymById(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gym', gymId],
    queryFn: async () => {
      if (!gymId) return null;
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', gymId)
        .maybeSingle();

      if (error) throw error;
      return data as Gym | null;
    },
    enabled: !!gymId,
  });
}

export function useGymsByCity(city: string) {
  return useQuery({
    queryKey: ['gyms-by-city', city],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .eq('city', city)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as Gym[];
    },
    enabled: !!city,
  });
}

export function useMembershipPlans(gymId: string | undefined) {
  return useQuery({
    queryKey: ['membership-plans', gymId],
    queryFn: async () => {
      if (!gymId) return [];
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('gym_id', gymId)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      return data as MembershipPlan[];
    },
    enabled: !!gymId,
  });
}

export function useCreateGym() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGymInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('gyms')
        .insert({
          owner_id: user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Gym;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-gyms'] });
      toast.success('Gym created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMembershipPlanInput) => {
      const { data, error } = await supabase
        .from('membership_plans')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as MembershipPlan;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans', variables.gym_id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('membership_plans').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      toast.success('Plan deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateGym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Gym> & { id: string }) => {
      const { data, error } = await supabase
        .from('gyms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Gym;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-gyms'] });
      queryClient.invalidateQueries({ queryKey: ['gym'] });
      toast.success('Gym updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteGym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gyms').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-gyms'] });
      toast.success('Gym deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
