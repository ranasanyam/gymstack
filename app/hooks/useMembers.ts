// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '../integrations/supabase/client';
// import { toast } from 'sonner';
// import { Database } from '../integrations/supabase/types';

// // type MembershipType = Database['public']['Enums']['membership_type'];

// // export interface GymMember {
// //   id: string;
// //   user_id: string;
// //   gym_id: string;
// //   membership_type: MembershipType;
// //   start_date: string;
// //   end_date: string | null;
// //   assigned_trainer_id: string | null;
// //   membership_plan_id: string | null;
// //   registration_id: string | null;
// //   avatar_url: string | null;
// //   payment_received: boolean | null;
// //   created_at: string;
// //   updated_at: string;
// //   profile?: {
// //     full_name: string;
// //     mobile_number: string;
// //     email: string | null;
// //     avatar_url: string | null;
// //     gender: string | null;
// //     date_of_birth: string | null;
// //     address: string | null;
// //     goals: string[] | null;
// //   };
// //   membership_plan?: {
// //     id: string;
// //     name: string;
// //     duration_months: number;
// //     price: number;
// //   };
// //   gym?: {
// //     id: string;
// //     name: string;
// //   };
// //   status: string | null;
// //   is_active: boolean | null;
// // }

// // export interface CreateMemberInput {
// //   gym_id: string;
// //   mobile_number: string;
// //   full_name: string;
// //   membership_type: MembershipType;
// //   end_date?: string;
// //   assigned_trainer_id?: string;
// //   membership_plan_id?: string;
// //   registration_id?: string;
// //   avatar_url?: string;
// //   email?: string;
// //   gender?: string;
// //   date_of_birth?: string;
// //   address?: string;
// //   city?: string;
// //   goals?: string[];
// //   payment_received?: boolean;
// // }

// // export function useGymMembers(gymId: string | undefined) {
// //   return useQuery({
// //     queryKey: ['gym-members', gymId],
// //     queryFn: async () => {
// //       if (!gymId) return [];
      
// //       // First get members
// //       const { data: members, error } = await supabase
// //         .from('gym_members')
// //         .select('*, membership_plan:membership_plans(id, name, duration_months, price)')
// //         .eq('gym_id', gymId)
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;
// //       if (!members || members.length === 0) return [];

// //       // Get profiles for all members
// //       const userIds = members.map(m => m.user_id);
// //       const { data: profiles } = await supabase
// //         .from('profiles')
// //         .select('user_id, full_name, mobile_number, email, avatar_url, gender, date_of_birth, address, goals')
// //         .in('user_id', userIds);

// //       // Combine data
// //       const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
// //       return members.map(member => ({
// //         ...member,
// //         profile: profileMap.get(member.user_id) || null,
// //       })) as GymMember[];
// //     },
// //     enabled: !!gymId,
// //   });
// // }



// // export function useGymMemberCount(gymId: string | undefined) {
// //   return useQuery({
// //     queryKey: ['gym-member-count', gymId],
// //     queryFn: async () => {
// //       if (!gymId) return 0;
// //       const { count, error } = await supabase
// //         .from('gym_members')
// //         .select('*', { count: 'exact', head: true })
// //         .eq('gym_id', gymId);
// //       if (error) throw error;
// //       return count || 0;
// //     },
// //     enabled: !!gymId,
// //   });
// // }

// // export function useMemberById(memberId: string | undefined) {
// //   return useQuery({
// //     queryKey: ['member', memberId],
// //     queryFn: async () => {
// //       if (!memberId) return null;
      
// //       const { data: member, error } = await supabase
// //         .from('gym_members')
// //         .select('*, membership_plan:membership_plans(id, name, duration_months, price), gym:gyms(id, name)')
// //         .eq('id', memberId)
// //         .maybeSingle();

// //       if (error) throw error;
// //       if (!member) return null;

// //       // Get profile
// //       const { data: profile } = await supabase
// //         .from('profiles')
// //         .select('user_id, full_name, mobile_number, email, avatar_url, gender, date_of_birth, address, goals')
// //         .eq('user_id', member.user_id)
// //         .maybeSingle();

// //       return { ...member, profile } as GymMember;
// //     },
// //     enabled: !!memberId,
// //   });
// // }

// // export function useMemberMemberships(userId: string | undefined) {
// //   return useQuery({
// //     queryKey: ['member-memberships', userId],
// //     queryFn: async () => {
// //       if (!userId) return [];
      
// //       const { data, error } = await supabase
// //         .from('gym_members')
// //         .select('*, gym:gyms(id, name, address, city), membership_plan:membership_plans(id, name, duration_months, price)')
// //         .eq('user_id', userId)
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;
// //       return data;
// //     },
// //     enabled: !!userId,
// //   });
// // }

// // export function useAddMember() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (input: CreateMemberInput) => {
// //       // Use edge function to avoid session switch
// //       const { data: { session } } = await supabase.auth.getSession();
// //       console.log('session', session);
// //       if (!session) throw new Error('Not authenticated');

// //             const { data, error }= await supabase.functions.invoke('create-member', {
// //               body: {
// //                 test: 'debug',
// //           //                    gym_id: input.gym_id,
// //           //   full_name: input.full_name,
// //           //  mobile_number: input.mobile_number,
// //           //    email: input.email,
// //           //    gender: input.gender,
// //           //    date_of_birth: input.date_of_birth,
// //           //    address: input.address,
// //           //    city: input.city,/
// //           //   goals: input.goals,
// //           //    membership_type: input.membership_type,
// //           //    membership_plan_id: input.membership_plan_id,
// //           //    end_date: input.end_date,
// //           //    registration_id: input.registration_id,
// //           //    avatar_url: input.avatar_url,
// //           //    payment_received: input.payment_received,
// //               }
// //             });

// //       // const response = await fetch(
// //       //   `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-member`,
// //       //   {
// //       //     method: 'POST',
// //       //     headers: {
// //       //       'Content-Type': 'application/json',
// //       //       'Authorization': `Bearer ${session.access_token}`,
// //       //     },
// //       //     body: JSON.stringify({
// //       //       gym_id: input.gym_id,
// //       //       full_name: input.full_name,
// //       //       mobile_number: input.mobile_number,
// //       //       email: input.email,
// //       //       gender: input.gender,
// //       //       date_of_birth: input.date_of_birth,
// //       //       address: input.address,
// //       //       city: input.city,
// //       //       goals: input.goals,
// //       //       membership_type: input.membership_type,
// //       //       membership_plan_id: input.membership_plan_id,
// //       //       end_date: input.end_date,
// //       //       registration_id: input.registration_id,
// //       //       avatar_url: input.avatar_url,
// //       //       payment_received: input.payment_received,
// //       //     }),
// //       //   }
// //       // );

// //       // const result = await response.json();

// //       // if (!response.ok) {
// //       //   throw new Error(result.error || 'Failed to add member');
// //       // }

// //       // return result;

// //       if(error) throw error;
// //       return data;
// //     },
// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['gym-members', variables.gym_id] });
// //       queryClient.invalidateQueries({ queryKey: ['gym-member-count', variables.gym_id] });
// //       toast.success('Member added successfully!');
// //     },
// //     onError: (error) => {
// //       toast.error(error.message);
// //     },
// //   });
// // }

// // // export function useUpdateMember() {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: async ({ id, ...updates }: Partial<GymMember> & { id: string }) => {
// // //       const { data, error } = await supabase
// // //         .from('gym_members')
// // //         .update(updates)
// // //         .eq('id', id)
// // //         .select()
// // //         .single();

// // //       if (error) throw error;
// // //       return data;
// // //     },
// // //     onSuccess: () => {
// // //       queryClient.invalidateQueries({ queryKey: ['gym-members'] });
// // //       queryClient.invalidateQueries({ queryKey: ['member'] });
// // //       toast.success('Member updated successfully!');
// // //     },
// // //     onError: (error) => {
// // //       toast.error(error.message);
// // //     },
// // //   });
// // // }

// // export function useUpdateMember() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async ({ id, updates }) => {
// //       const { data: { session }} = await supabase.auth.getSession();


// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-member`,
// //         {
// //           method:'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Authorization: `Bearer ${session?.access_token}`,
// //           },
// //           body: JSON.stringify({ id, updates }),
// //         }
// //       )

// //       if(!res.ok) {
// //         const err = await res.json();
// //         throw new Error(err.error);
// //       }
// //       return res.json();
// //     }
// //   })
// // }

// // export function useDeactivateMember() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (id: string) => {
// //       const { data: { session } } = await supabase.auth.getSession();

// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/deactivate-member`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${session?.access_token}`,
// //           },
// //           body: JSON.stringify({ id }),
// //         }
// //       );

// //       if (!res.ok) {
// //         const err = await res.json();
// //         throw new Error(err.error);
// //       }
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["gym-members"] });
// //     },
// //   });
// // }

// // export function useDeleteMember() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (id: string) => {
// //       // const { error } = await supabase.from('gym_members').delete().eq('id', id);
// //       const { error } = await supabase.from('gym_members').update({ status: 'inactive', is_active: false }).eq('id', id);s
// //       if (error) throw error;
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['gym-members'] });
// //       queryClient.invalidateQueries({ queryKey: ['gym-member-count'] });
// //       toast.success('Member removed successfully!');
// //     },
// //     onError: (error) => {
// //       toast.error(error.message);
// //     },
// //   });
// // }

// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { supabase } from '../integrations/supabase/client';
// // import { toast } from 'sonner';
// // import { Database } from '../integrations/supabase/types';










// // type MembershipType = Database['public']['Enums']['membership_type'];

// // /* ======================================================
// //    TYPES
// // ====================================================== */

// // export interface GymMember {
// //   id: string;
// //   user_id: string;
// //   gym_id: string;
// //   membership_type: MembershipType;
// //   start_date: string;
// //   end_date: string | null;
// //   assigned_trainer_id: string | null;
// //   membership_plan_id: string | null;
// //   registration_id: string | null;
// //   avatar_url: string | null;
// //   status: string | null;
// //   is_active: boolean | null;
// //   created_at: string;
// //   updated_at: string;

// //   profile?: {
// //     user_id: string;
// //     full_name: string;
// //     mobile_number: string;
// //     email: string | null;
// //     avatar_url: string | null;
// //     gender: string | null;
// //     date_of_birth: string | null;
// //     address: string | null;
// //     goals: string[] | null;
// //   } | null;

// //   membership_plan?: {
// //     id: string;
// //     name: string;
// //     duration_months: number;
// //     price: number;
// //   } | null;

// //   gym?: {
// //     id: string;
// //     name: string;
// //     address?: string;
// //     city?: string;
// //   } | null;
// // }

// // export interface CreateMemberInput {
// //   gym_id: string;
// //   mobile_number: string;
// //   full_name: string;
// //   membership_type: MembershipType;
// //   end_date?: string;
// //   assigned_trainer_id?: string;
// //   membership_plan_id?: string;
// //   registration_id?: string;
// //   avatar_url?: string;
// //   email?: string;
// //   gender?: string;
// //   date_of_birth?: string;
// //   address?: string;
// //   city?: string;
// //   goals?: string[];
// // }

// // /* ======================================================
// //    FETCH MEMBERS (WITH PROFILE + PLAN JOIN)
// // ====================================================== */

// // export function useGymMembers(gymId?: string | undefined) {
// //   return useQuery({
// //     queryKey: ['gym-members', gymId],
// //     enabled: !!gymId,
// //     queryFn: async () => {
// //       if (!gymId) return [] as GymMember[];
      
// //       // Fetch members with membership plans
// //       const { data: members, error: membersError } = await supabase
// //         .from('gym_members')
// //         .select('*, membership_plan:membership_plans(id, name, duration_months, price)')
// //         .eq('gym_id', gymId)
// //         .order('created_at', { ascending: false });

// //       if (membersError) throw membersError;
// //       if (!members || members.length === 0) return [] as GymMember[];

// //       // Fetch all profiles for these members
// //       const userIds = members.map(m => m.user_id);
// //       const { data: profiles, error: profilesError } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .in('user_id', userIds);

// //       if (profilesError) throw profilesError;

// //       // Combine data
// //       const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
// //       return members.map(member => ({
// //         ...member,
// //         profile: profileMap.get(member.user_id) || null,
// //       })) as unknown as GymMember[];
// //     },
// //   });
// // }

// // /* ======================================================
// //    MEMBER COUNT
// // ====================================================== */

// // export function useGymMemberCount(gymId?: string) {
// //   return useQuery({
// //     queryKey: ['gym-member-count', gymId],
// //     enabled: !!gymId,
// //     queryFn: async () => {
// //       if (!gymId) return 0;
      
// //       const { count, error } = await supabase
// //         .from('gym_members')
// //         .select('*', { count: 'exact', head: true })
// //         .eq('gym_id', gymId);

// //       if (error) throw error;

// //       return count ?? 0;
// //     },
// //   });
// // }

// // /* ======================================================
// //    SINGLE MEMBER
// // ====================================================== */

// // export function useMemberById(memberId?: string) {
// //   return useQuery({
// //     queryKey: ['member', memberId],
// //     enabled: !!memberId,
// //     queryFn: async () => {
// //       if (!memberId) return null;
      
// //       const { data: member, error: memberError } = await supabase
// //         .from('gym_members')
// //         .select('*, membership_plan:membership_plans(id, name, duration_months, price), gym:gyms(id, name, address, city)')
// //         .eq('id', memberId)
// //         .maybeSingle();

// //       if (memberError) throw memberError;
// //       if (!member) return null;

// //       // Fetch profile separately
// //       const { data: profile, error: profileError } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .eq('user_id', member.user_id)
// //         .maybeSingle();

// //       if (profileError) throw profileError;

// //       return {
// //         ...member,
// //         profile: profile || null,
// //       } as unknown as GymMember;
// //     },
// //   });
// // }

// // /* ======================================================
// //    MEMBER MEMBERSHIPS (FOR MEMBER DASHBOARD)
// // ====================================================== */

// // export function useMemberMemberships(userId?: string) {
// //   return useQuery({
// //     queryKey: ['member-memberships', userId],
// //     enabled: !!userId,
// //     queryFn: async () => {
// //       if (!userId) return [] as GymMember[];
      
// //       const { data, error } = await supabase
// //         .from('gym_members')
// //         .select('*, gym:gyms(id, name, address, city), membership_plan:membership_plans(id, name, duration_months, price)')
// //         .eq('user_id', userId)
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;

// //       return data as unknown as GymMember[];
// //     },
// //   });
// // }

// // /* ======================================================
// //    ADD MEMBER
// // ====================================================== */

// // export function useAddMember() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (input: CreateMemberInput) => {
// //       // 1️⃣ Check if profile exists
// //       let { data: profile } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .eq('mobile_number', input.mobile_number)
// //         .maybeSingle();

// //       // 2️⃣ Create profile if not exists
// //       if (!profile) {
// //         // Generate a UUID for the new user
// //         const userId = crypto.randomUUID();
        
// //         const { data: newProfile, error: profileError } = await supabase
// //           .from('profiles')
// //           .insert({
// //             user_id: userId,
// //             full_name: input.full_name,
// //             mobile_number: input.mobile_number,
// //             email: input.email || null,
// //             gender: input.gender || null,
// //             date_of_birth: input.date_of_birth || null,
// //             address: input.address || null,
// //             city: input.city,
// //             goals: input.goals || null,
// //           } as any)
// //           .select()
// //           .single();

// //         if (profileError) throw profileError;
// //         profile = newProfile;
// //       }

// //       // 3️⃣ Insert membership
// //       const { data, error } = await supabase
// //         .from('gym_members')
// //         .insert({
// //           user_id: profile.user_id,
// //           gym_id: input.gym_id,
// //           membership_type: input.membership_type,
// //           membership_plan_id: input.membership_plan_id,
// //           assigned_trainer_id: input.assigned_trainer_id,
// //           end_date: input.end_date,
// //           registration_id: input.registration_id,
// //           avatar_url: input.avatar_url,
// //           status: 'active' as any,
// //           is_active: true as any,
// //         } as any)
// //         .select()
// //         .single();

// //       if (error) throw error;

// //       return data;
// //     },

// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['gym-members', variables.gym_id] });
// //       queryClient.invalidateQueries({ queryKey: ['gym-member-count', variables.gym_id] });
// //       toast.success('Member added successfully!');
// //     },

// //     onError: (error: any) => {
// //       toast.error(error.message);
// //     },
// //   });
// // }

// // /* ======================================================
// //    UPDATE MEMBER
// // ====================================================== */

// // export function useUpdateMember() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async ({
// //       id,
// //       updates,
// //     }: {
// //       id: string;
// //       updates: Partial<{
// //         membership_type: MembershipType;
// //         end_date: string | null;
// //         assigned_trainer_id: string | null;
// //         membership_plan_id: string | null;
// //         registration_id: string | null;
// //         avatar_url: string | null;
// //         status: string;
// //         is_active: boolean;
// //       }>;
// //     }) => {
// //       const { data, error } = await supabase
// //         .from('gym_members')
// //         .update(updates as any)
// //         .eq('id', id)
// //         .select()
// //         .single();

// //       if (error) throw error;

// //       return data;
// //     },

// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['gym-members'] });
// //       toast.success('Member updated successfully!');
// //     },

// //     onError: (error: any) => {
// //       toast.error(error.message);
// //     },
// //   });
// // }

// // /* ======================================================
// //    DEACTIVATE MEMBER (SOFT DELETE)
// // ====================================================== */

// // export function useDeactivateMember() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (id: string) => {
// //       const { error } = await supabase
// //         .from('gym_members')
// //         .update({
// //           status: 'inactive' as any,
// //           is_active: false as any,
// //         } as any)
// //         .eq('id', id);

// //       if (error) throw error;
// //     },

// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['gym-members'] });
// //       queryClient.invalidateQueries({ queryKey: ['gym-member-count'] });
// //       toast.success('Member deactivated successfully!');
// //     },

// //     onError: (error: any) => {
// //       toast.error(error.message);
// //     },
// //   });
// // }




// type MembershipType = Database['public']['Enums']['membership_type'];

// type GymMemberRow =
//   Database['public']['Tables']['gym_members']['Row'];

// type GymMemberInsert =
//   Database['public']['Tables']['gym_members']['Insert'];

// type GymMemberUpdate =
//   Database['public']['Tables']['gym_members']['Update'];

// type ProfileInsert =
//   Database['public']['Tables']['profiles']['Insert'];

// /* ======================================================
//    FETCH MEMBERS (JOINED)
// ====================================================== */

// export function useGymMembers(gymId?: string) {
//   return useQuery({
//     queryKey: ['gym-members', gymId],
//     enabled: !!gymId,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('gym_members')
//         .select(`
//           *,
//           membership_plan:membership_plans(id, name, duration_months, price),
//           profile:profiles!gym_members_user_id_fkey(
//             user_id,
//             full_name,
//             mobile_number,
//             email,
//             avatar_url,
//             gender,
//             date_of_birth,
//             address,
//             goals
//           )
//         `)
//         .eq('gym_id', gymId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       return data ?? [];
//     },
//   });
// }

// /* ======================================================
//    MEMBER COUNT
// ====================================================== */

// export function useGymMemberCount(gymId?: string) {
//   return useQuery({
//     queryKey: ['gym-member-count', gymId],
//     enabled: !!gymId,
//     queryFn: async () => {
//       const { count, error } = await supabase
//         .from('gym_members')
//         .select('*', { count: 'exact', head: true })
//         .eq('gym_id', gymId);

//       if (error) throw error;

//       return count ?? 0;
//     },
//   });
// }

// /* ======================================================
//    SINGLE MEMBER
// ====================================================== */

// export function useMemberById(memberId?: string) {
//   return useQuery({
//     queryKey: ['member', memberId],
//     enabled: !!memberId,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('gym_members')
//         .select(`
//           *,
//           membership_plan:membership_plans(id, name, duration_months, price),
//           gym:gyms(id, name, address, city),
//           profile:profiles!gym_members_user_id_fkey(
//             user_id,
//             full_name,
//             mobile_number,
//             email,
//             avatar_url,
//             gender,
//             date_of_birth,
//             address,
//             goals
//           )
//         `)
//         .eq('id', memberId)
//         .maybeSingle();

//       if (error) throw error;

//       return data ?? null;
//     },
//   });
// }

// /* ======================================================
//    MEMBER MEMBERSHIPS (FOR MEMBER DASHBOARD)
// ====================================================== */

// export function useMemberMemberships(userId?: string) {
//   return useQuery({
//     queryKey: ['member-memberships', userId],
//     enabled: !!userId,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('gym_members')
//         .select(`
//           *,
//           gym:gyms(id, name, address, city),
//           membership_plan:membership_plans(id, name, duration_months, price)
//         `)
//         .eq('user_id', userId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       return data ?? [];
//     },
//   });
// }

// /* ======================================================
//    ADD MEMBER
// ====================================================== */

// export interface CreateMemberInput {
//   gym_id: string;
//   mobile_number: string;
//   full_name: string;
//   membership_type: MembershipType;
//   membership_plan_id?: string;
//   assigned_trainer_id?: string;
//   end_date?: string;
//   registration_id?: string;
//   avatar_url?: string;
//   email?: string;
//   gender?: string;
//   date_of_birth?: string;
//   address?: string;
//   city?: string;
//   goals?: string[];
// }

// export function useAddMember() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (input: CreateMemberInput) => {
//       // 1️⃣ Check existing profile by mobile number
//       let { data: profile } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('mobile_number', input.mobile_number)
//         .maybeSingle();

//       // 2️⃣ Create profile if not exists (user_id NULL until signup)
//       if (!profile) {
//         const profileInsert: ProfileInsert = {
//           user_id: null,
//           full_name: input.full_name,
//           mobile_number: input.mobile_number,
//           email: input.email ?? null,
//           gender: input.gender ?? null,
//           date_of_birth: input.date_of_birth ?? null,
//           address: input.address ?? null,
//           city: input.city ?? null,
//           goals: input.goals ?? null,
//         };

//         const { data: newProfile, error: profileError } =
//           await supabase
//             .from('profiles')
//             .insert(profileInsert)
//             .select()
//             .single();

//         if (profileError) throw profileError;

//         profile = newProfile;
//       }

//       // 3️⃣ Insert membership
//       const memberInsert: GymMemberInsert = {
//         user_id: profile.user_id,
//         gym_id: input.gym_id,
//         membership_type: input.membership_type,
//         membership_plan_id: input.membership_plan_id ?? null,
//         assigned_trainer_id: input.assigned_trainer_id ?? null,
//         end_date: input.end_date ?? null,
//         registration_id: input.registration_id ?? null,
//         avatar_url: input.avatar_url ?? null,
//         status: 'active',
//         is_active: true,
//       };

//       const { data, error } = await supabase
//         .from('gym_members')
//         .insert(memberInsert)
//         .select()
//         .single();

//       if (error) throw error;

//       return data;
//     },

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ['gym-members', variables.gym_id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ['gym-member-count', variables.gym_id],
//       });

//       toast.success('Member added successfully!');
//     },

//     onError: (error: any) => {
//       toast.error(error.message);
//     },
//   });
// }

// /* ======================================================
//    UPDATE MEMBER
// ====================================================== */

// export function useUpdateMember() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       id,
//       updates,
//     }: {
//       id: string;
//       updates: GymMemberUpdate;
//     }) => {
//       const { data, error } = await supabase
//         .from('gym_members')
//         .update(updates)
//         .eq('id', id)
//         .select()
//         .single();

//       if (error) throw error;

//       return data;
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['gym-members'] });
//       toast.success('Member updated successfully!');
//     },

//     onError: (error: any) => {
//       toast.error(error.message);
//     },
//   });
// }

// /* ======================================================
//    DEACTIVATE MEMBER (SOFT DELETE)
// ====================================================== */

// export function useDeactivateMember() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: string) => {
//       const updates: GymMemberUpdate = {
//         status: 'inactive',
//         is_active: false,
//       };

//       const { error } = await supabase
//         .from('gym_members')
//         .update(updates)
//         .eq('id', id);

//       if (error) throw error;
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['gym-members'] });
//       queryClient.invalidateQueries({ queryKey: ['gym-member-count'] });
//       toast.success('Member deactivated successfully!');
//     },

//     onError: (error: any) => {
//       toast.error(error.message);
//     },
//   });
// }
// // 




import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'
import { toast } from 'sonner'
import { Database } from '../integrations/supabase/types'

/* ======================================================
   TYPES
====================================================== */

type MembershipType =
  Database['public']['Enums']['membership_type']

type MembershipStatus =
  Database['public']['Enums']['membership_status']

type GymMemberInsert =
  Database['public']['Tables']['gym_members']['Insert']

type GymMemberUpdate =
  Database['public']['Tables']['gym_members']['Update']

type ProfileInsert =
  Database['public']['Tables']['profiles']['Insert']


/* ======================================================
   FETCH MEMBERS (OWNER VIEW)
====================================================== */

export function useGymMembers(gymId?: string) {
  return useQuery({
    queryKey: ['gym-members', gymId],
    enabled: !!gymId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gym_members')
        .select(`
          *,
          membership_plan:membership_plans(id, name, duration_months, price),
          profile:profiles!gym_members_profile_id_fkey(
            id,
            full_name,
            mobile_number,
            email,
            avatar_url,
            gender,
            date_of_birth,
            address,
            goals
          )
        `)
        .eq('gym_id', gymId!)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })
}


/* ======================================================
   MEMBER COUNT
====================================================== */

export function useGymMemberCount(gymId?: string) {
  return useQuery({
    queryKey: ['gym-member-count', gymId],
    enabled: !!gymId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('gym_members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId!)

      if (error) throw error
      return count ?? 0
    },
  })
}


/* ======================================================
   SINGLE MEMBER
====================================================== */

export function useMemberById(memberId?: string) {
  return useQuery({
    queryKey: ['member', memberId],
    enabled: !!memberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gym_members')
        .select(`
          *,
          membership_plan:membership_plans(id, name, duration_months, price),
          gym:gyms(id, name, address, city),
          profile:profiles!gym_members_profile_id_fkey(
            id,
            full_name,
            mobile_number,
            email,
            avatar_url,
            gender,
            date_of_birth,
            address,
            goals
          )
        `)
        .eq('id', memberId!)
        .maybeSingle()

      if (error) throw error
      return data ?? null
    },
  })
}


/* ======================================================
   MEMBER MEMBERSHIPS (SELF DASHBOARD)
====================================================== */

export function useMemberMemberships(profileId?: string) {
  return useQuery({
    queryKey: ['member-memberships', profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gym_members')
        .select(`
          *,
          gym:gyms(id, name, address, city),
          membership_plan:membership_plans(id, name, duration_months, price)
        `)
        .eq('profile_id', profileId!)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })
}


/* ======================================================
   ADD MEMBER (OWNER CREATION FLOW)
====================================================== */

export interface CreateMemberInput {
  gym_id: string
  mobile_number: number
  full_name: string
  membership_type: MembershipType
  membership_plan_id?: string
  assigned_trainer_id?: string
  end_date?: string
  registration_id?: string
  avatar_url?: string
  email?: string
  gender?: string
  date_of_birth?: string
  address?: string
  city: string
  goals?: string[]
}

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateMemberInput) => {

      // 1️⃣ Find profile by mobile number
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile_number', input.mobile_number)
        .maybeSingle()

      if (profileError) throw profileError

      // 2️⃣ Create profile if not exists
      if (!profile) {
        const profileInsert: ProfileInsert = {
          user_id: null,
          full_name: input.full_name,
          mobile_number: input.mobile_number,
          email: input.email ?? null,
          gender: input.gender ?? null,
          date_of_birth: input.date_of_birth ?? null,
          address: input.address ?? null,
          city: input.city,
          goals: input.goals ?? null,
        }

        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert(profileInsert)
          .select()
          .single()

        if (error) throw error
        profile = newProfile
      }

      // 3️⃣ Insert gym membership (IMPORTANT: use profile_id)
      const memberInsert: GymMemberInsert = {
        profile_id: profile.id,
        gym_id: input.gym_id,
        membership_type: input.membership_type,
        membership_plan_id: input.membership_plan_id ?? null,
        assigned_trainer_id: input.assigned_trainer_id ?? null,
        end_date: input.end_date ?? null,
        registration_id: input.registration_id ?? null,
        avatar_url: input.avatar_url ?? null,
        status: 'active' as MembershipStatus,
        is_active: true,
      }

      const { data, error } = await supabase
        .from('gym_members')
        .insert(memberInsert)
        .select()
        .single()

      if (error) throw error
      return data
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gym-members', variables.gym_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['gym-member-count', variables.gym_id],
      })
      toast.success('Member added successfully!')
    },

    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}


/* ======================================================
   UPDATE MEMBER
====================================================== */

export function useUpdateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: GymMemberUpdate
    }) => {
      const { data, error } = await supabase
        .from('gym_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-members'] })
      toast.success('Member updated successfully!')
    },

    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}


/* ======================================================
   DEACTIVATE MEMBER (SOFT DELETE)
====================================================== */

export function useDeactivateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const updates: GymMemberUpdate = {
        status: 'inactive',
        is_active: false,
      }

      const { error } = await supabase
        .from('gym_members')
        .update(updates)
        .eq('id', id)

      if (error) throw error
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-members'] })
      queryClient.invalidateQueries({ queryKey: ['gym-member-count'] })
      toast.success('Member deactivated successfully!')
    },

    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}
