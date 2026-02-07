import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "./use-toast";

export interface Gym {
    id: string;
    owner_id: string;
    name: string;
    address: string;
    city: string;
    contact_number: string;
    gym_images: string[] | null;
    gpay_qr: string | null;
    phonepe_qr: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;

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
        }, enabled: !!user 
    })
}

export function useDeleteGym() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('gyms').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['owner-gyms'] });
            toast({
                title: 'Success',
                description: 'Gym deleted successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete gym.',
            });
        }
    })
}
