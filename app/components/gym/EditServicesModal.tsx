import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useUpdateGym } from '@/app/hooks/useGyms';

interface EditServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: string;
  currentServices: string[];
}

const SERVICES = [
  { id: 'personal_training', label: 'Personal Training', icon: '👤' },
  { id: 'group_classes', label: 'Group Classes', icon: '👥' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'zumba', label: 'Zumba', icon: '💃' },
  { id: 'crossfit', label: 'CrossFit', icon: '🏋️' },
  { id: 'boxing', label: 'Boxing', icon: '🥊' },
  { id: 'nutrition', label: 'Nutrition Counseling', icon: '🥗' },
  { id: 'physiotherapy', label: 'Physiotherapy', icon: '🩺' },
  { id: 'massage', label: 'Massage', icon: '💆' },
  { id: 'steam_sauna', label: 'Steam/Sauna', icon: '♨️' },
  { id: 'supplements', label: 'Supplements', icon: '💊' },
  { id: 'diet_plan', label: 'Diet Planning', icon: '📋' },
];

export function EditServicesModal({ open, onOpenChange, gymId, currentServices }: EditServicesModalProps) {
  const updateGym = useUpdateGym();
  const [selected, setSelected] = useState<string[]>(currentServices);

  useEffect(() => {
    setSelected(currentServices);
  }, [currentServices]);

  const toggleService = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGym.mutateAsync({ id: gymId, services: selected });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Services</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Services</Label>
            <div className="grid grid-cols-2 mt-2 sm:grid-cols-3 gap-3">
              {SERVICES.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    selected.includes(service.id)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-muted/50 border-border hover:bg-muted'
                  }`}
                >
                  <span className="text-lg mr-2">{service.icon}</span>
                  <span className="text-sm font-medium text-white">{service.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateGym.isPending}>
              {updateGym.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}