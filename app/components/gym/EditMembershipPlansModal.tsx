'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useMembershipPlans, useCreateMembershipPlan, useDeleteMembershipPlan, MembershipPlan } from '@/app/hooks/useGyms';
import { toast } from 'sonner';

interface EditMembershipPlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: string;
}

interface PlanFormData {
  name: string;
  duration_months: string;
  price: string;
  description: string;
}

const initialFormData: PlanFormData = {
  name: '',
  duration_months: '',
  price: '',
  description: '',
};

export function EditMembershipPlansModal({ open, onOpenChange, gymId }: EditMembershipPlansModalProps) {
  const { data: plans, isLoading } = useMembershipPlans(gymId);
  const createPlan = useCreateMembershipPlan();
  const deletePlan = useDeleteMembershipPlan();

  const [formData, setFormData] = useState<PlanFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const hasPlans = plans && plans.length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.duration_months || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createPlan.mutateAsync({
        gym_id: gymId,
        name: formData.name,
        duration_months: parseInt(formData.duration_months),
        price: parseFloat(formData.price),
        description: formData.description || undefined,
      });

      setFormData(initialFormData);
      toast.success('Membership plan added successfully!');
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan.mutateAsync(planId);
        toast.success('Plan deleted successfully!');
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Membership Plans</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Existing Plans Section */}
            {hasPlans && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Current Plans</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {plans?.map(plan => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {plan.duration_months} months - ₹{plan.price}
                        </p>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={deletePlan.isPending}
                        className="p-2 hover:bg-destructive/20 text-destructive rounded transition-colors"
                      >
                        {deletePlan.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add/Edit Plan Form */}
            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="font-semibold text-lg">
                {hasPlans ? 'Add New Plan' : 'Create Your First Plan'}
              </h3>
              <form onSubmit={handleAddPlan} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Basic, Premium"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration_months">Duration (months) *</Label>
                    <Input
                      id="duration_months"
                      name="duration_months"
                      type="number"
                      placeholder="e.g., 1, 3, 6, 12"
                      value={formData.duration_months}
                      onChange={handleInputChange}
                      className="bg-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 999"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="bg-input"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Optional description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="bg-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData(initialFormData);
                      setEditingId(null);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPlan.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {createPlan.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Plan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Close Button */}
            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setFormData(initialFormData);
                  setEditingId(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}