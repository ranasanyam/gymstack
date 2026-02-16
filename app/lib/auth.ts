import { supabase } from "../integrations/supabase/client";

export type AppRole = 'owner' | 'trainer' | 'member';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  city: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export async function signUp(
  email: string,
  password: string,
  metadata: {
    full_name: string;
    mobile_number: string;
    city: string;
    gender?: string;
    date_of_birth?: string;
  }
) {


  // check if mobile already exists

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('mobile_number', metadata.mobile_number)
    .maybeSingle();

  if(existingProfile) {
    return {
      data: null,
      error: { message: 'Mobile number already registered.'}
    }
  }

  // create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if(error || !data.user) return { data, error };

  // create profile now
  const { error: profileError } = await supabase.from('profiles').insert({
    user_id: data.user.id,
    full_name: metadata.full_name,
    mobile_number: metadata.mobile_number,
    email,
    city: metadata.city,
    gender: metadata.gender ?? null,
    date_of_birth: metadata.date_of_birth ?? null
  });

  if(profileError) {
    return { data: null, error: profileError };
  }

  return { data, error: null };
  
}
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching role:', error);
    return null;
  }
  return data?.role as AppRole || null;
}

export async function setUserRole(userId: string, role: AppRole) {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
    .select()
    .single();
  
  return { data, error };
}

export async function getUserContext(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();


  const { data: memberships } = await supabase
    .from('gym_members')
    .select(`
      *,
      gym(*)
    `)
    .eq('user_id', userId);

  return { 
    profile,
    role: roleRow?.role ?? null,
    memberships: memberships ?? []
  }
}
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if(error || !data.user) return { data: null, error };

  const context = await getUserContext(data.user.id);

  return { 
    user: data.user,
    profile: context.profile,
    role: context.role,
    memberships: context.memberships,
    error: null
  };
}

export function getRoleDashboardPath(role: AppRole | null): string {
  switch (role) {
    case 'owner':
      return '/owner/dashboard';
    case 'trainer':
      return '/trainer/dashboard';
    case 'member':
      return '/member/dashboard';
    default:
      return '/auth/select-role';
  }
}

export function getDashoardPath(
  role: AppRole | null | undefined,
  memberships: any[] | undefined
): string {
  if(role === 'owner') return '/owner/dashboard';
  if(role === 'trainer') return '/trainer/dashboard';

  if(memberships && memberships?.length > 0) {
    return '/member/dashboard';
  }
  return '/auth/select-role';
}