'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, MapPin, Plus, Phone, Edit, Trash2, MoreVertical, Users, CreditCard, DroneIcon } from "lucide-react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { 
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useOwnerGyms, useDeleteGym, Gym } from "@/app/hooks/useGyms";
import { useGymMemberCount } from "@/app/hooks/useMembers";
import { useGymRevenue } from "@/app/hooks/usePayments";



function GymCard({ gym, onDelete }: { gym: Gym; onDelete: () => void }) {
    const router = useRouter();
    const navigate = router.push;

    const { data: memberCount } = useGymMemberCount(gym.id);
    const { data: revenue } = useGymRevenue(gym.id);

    return (
        <Card
        className="bg-card border-border overflow-hidden group cursor-pointer  transition-colors"
        onClick={() => navigate(`/owner/gyms/${gym.id}`)}
        >
            <div className="h-32 bg-linear-to-br from-[#f9701850]  to-[#f970158] flex items-center justify-center">
                <Building2 className="w-12 h-12 text-primary" />
            </div>
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-display font-semibold text-lg text-foreground">
                            {gym?.name}
                        </h3>
                        <Badge variant={gym?.is_active ? 'default' : 'secondary'} className="mt-1">
                            {gym?.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="w-4 h-4 text-white" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/owner/gyms/${gym.id}`);
                            }}>
                                <Edit className="w-4 h-4 mr-2" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{gym?.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{gym?.contact_number}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm text-white font-medium">{memberCount || 0}</span>
                        <span className="text-xs text-muted-foreground">members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="text-sm text-white font-medium">₹{revenue?.thisMonth?.toLocaleString() || 0}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


export default function OwnerGyms() {
    const { data: gyms, isLoading } = useOwnerGyms();
    const deleteGym = useDeleteGym();
    const [deletedId, setDeletedId] = useState<string | null>(null);

    const handleDelete = () => {
        if(deletedId) {
            deleteGym.mutate(deletedId);
            setDeletedId(null);
        }
    }
    return (
        <DashboardLayout title="My Gyms">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground">
                            Manage all your gym locations
                        </p>
                    </div>
                    <Link href="/owner/add-gym">
                        <Button className="bg-gradient-primary hover:opacity-90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Gym
                        </Button>
                    </Link>
                </div>
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3].map((i) => (
                            <Card key={i} className="bg-card border-border">
                                <CardContent className="p-t">
                                    <Skeleton className="h-40 w-full mb-4" />
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : gyms && gyms.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gyms.map((gym, index) => (
                            <motion.div
                            key={gym.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            >
                                <GymCard gym={gym} onDelete={() => setDeletedId(gym.id)} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                        <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                            No gyms yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Get started by adding your first gym location
                        </p>
                        <Link href="/owner/add-gym">
                            <Button className="bg-gradient-primary hover:opacity-90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Gym
                            </Button>
                        </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}