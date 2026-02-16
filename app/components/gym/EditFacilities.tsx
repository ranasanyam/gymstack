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

interface EditFacilitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: string;
  currentFacilities: string[];
}

const FACILITIES = [
  { id: 'ac', label: 'AC', icon: '❄️' },
  { id: 'cardio', label: 'Cardio', icon: '🏃' },
  { id: 'cctv', label: 'CCTV', icon: '📹' },
  { id: 'fire_protection', label: 'Fire Protection', icon: '🔥' },
  { id: 'hot_water', label: 'Hot Water', icon: '♨️' },
  { id: 'locker', label: 'Locker', icon: '🔐' },
  { id: 'parking', label: 'Parking', icon: '🅿️' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'shower', label: 'Shower', icon: '🚿' },
  { id: 'speakers', label: 'Speakers', icon: '🔊' },
  { id: 'trainers', label: 'Trainers', icon: '💪' },
  { id: 'weight', label: 'Weight', icon: '🏋️' },
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'workout', label: 'Workout', icon: '🏋️‍♂️' },
];

export function EditFacilitiesModal({ open, onOpenChange, gymId, currentFacilities }: EditFacilitiesModalProps) {
  const updateGym = useUpdateGym();
  const [selected, setSelected] = useState<string[]>(currentFacilities);

  useEffect(() => {
    setSelected(currentFacilities);
  }, [currentFacilities]);

  const toggleFacility = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGym.mutateAsync({ id: gymId, facilities: selected });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Facilities</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Facilities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {FACILITIES.map(facility => (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() => toggleFacility(facility.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selected.includes(facility.id)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-muted/50 border-border hover:bg-muted'
                  }`}
                >
                  <span className="text-lg mr-2">{facility.icon}</span>
                  <span className="text-sm font-medium text-white">{facility.label}</span>
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