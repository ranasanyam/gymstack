import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface GymTrainer {
  id: string;
  user_id: string;
  gym_id: string;
  specialization: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string;
    mobile_number: string;
    email: string | null;
    avatar_url: string | null;
  };
}

export interface CreateTrainerInput {
  gym_id: string;
  mobile_number: string;
  full_name: string;
  specialization?: string;
}

export function useGymTrainers(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gym-trainers', gymId],
    queryFn: async () => {
      if (!gymId) return [];
      
      // Get trainers
      const { data: trainers, error } = await supabase
        .from('gym_trainers')
        .select('*')
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!trainers || trainers.length === 0) return [];

      // Get profiles for all trainers
      const userIds = trainers.map(t => t.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, mobile_number, email, avatar_url')
        .in('user_id', userIds);

      // Combine data
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      return trainers.map(trainer => ({
        ...trainer,
        profile: profileMap.get(trainer.user_id) || null,
      })) as GymTrainer[];
    },
    enabled: !!gymId,
  });
}

export function useTrainerGyms(userId: string | undefined) {
  return useQuery({
    queryKey: ['trainer-gyms', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('gym_trainers')
        .select('*, gym:gyms(id, name, address, city)')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useAddTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTrainerInput) => {
      // First, find or create the user by mobile number
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('mobile_number', input.mobile_number)
        .maybeSingle();

      if (profileError) throw profileError;

      let userId: string;

      if (existingProfile) {
        userId = existingProfile.user_id;
      } else {
        // Create a new auth user with valid password
        const tempEmail = `${input.mobile_number}@temp.fithub.app`;
        const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: tempEmail,
          password: tempPassword,
          options: {
            data: {
              full_name: input.full_name,
              mobile_number: input.mobile_number,
              city: '',
            },
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');
        
        userId = authData.user.id;

        // Wait for profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 500));

        // Set the trainer role
        await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'trainer' });
      }

      // Add the trainer to the gym
      const { data, error } = await supabase
        .from('gym_trainers')
        .insert({
          user_id: userId,
          gym_id: input.gym_id,
          specialization: input.specialization,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gym-trainers', variables.gym_id] });
      toast.success('Trainer added successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GymTrainer> & { id: string }) => {
      const { data, error } = await supabase
        .from('gym_trainers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-trainers'] });
      toast.success('Trainer updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gym_trainers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-trainers'] });
      toast.success('Trainer removed successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
