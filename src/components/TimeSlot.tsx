
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { useAppointment, TimeSlot } from '@/context/AppointmentContext';

interface TimeSlotProps {
  timeSlot: TimeSlot;
}

const TimeSlotComponent: React.FC<TimeSlotProps> = ({ timeSlot }) => {
  const { selectedTimeSlot, setSelectedTimeSlot, setIsBookingModalOpen } = useAppointment();
  
  const isSelected = selectedTimeSlot?.id === timeSlot.id;
  
  const handleSelectTimeSlot = () => {
    if (!timeSlot.isAvailable) return;
    
    setSelectedTimeSlot(timeSlot);
    setIsBookingModalOpen(true);
  };

  return (
    <div
      onClick={handleSelectTimeSlot}
      className={cn(
        "p-3 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer",
        timeSlot.isAvailable ? "hover:bg-primary/5 active:bg-primary/10" : "opacity-50 cursor-not-allowed",
        isSelected ? "ring-2 ring-primary ring-offset-2" : "",
        timeSlot.isAvailable ? "glass-card" : "bg-muted/30"
      )}
    >
      <Clock className={cn(
        "h-4 w-4",
        timeSlot.isAvailable ? "text-primary" : "text-muted-foreground"
      )} />
      <div className="flex-1">
        <p className="font-medium">
          {timeSlot.startTime} - {timeSlot.endTime}
        </p>
        <p className="text-xs text-muted-foreground">
          {timeSlot.isAvailable ? "Available" : "Unavailable"}
        </p>
      </div>
    </div>
  );
};

export default TimeSlotComponent;
