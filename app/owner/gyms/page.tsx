'use client';
import React, { useState } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { Button } from "@/app/components/ui/button";
import { Building2, MapPin, Plus, Phone } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import { useOwnerGyms, useDeleteGym } from "@/app/hooks/useGyms";
import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { motion } from "framer-motion";

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

                                <Card className="bg-card border-border overflow-hidden group">
                                    <div className="h-40 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                        <Building2 className="w-16 h-16 text-primary/50" />
                                    </div>
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-display font-semibold text-lg text-foreground">
                                                    {gym.name}
                                                </h3>
                                                <Badge variant={gym.is_active ? 'default' : 'secondary'} className="mt-1">
                                                    {gym.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{gym.address}, {gym.city}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{gym.contact_number}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
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