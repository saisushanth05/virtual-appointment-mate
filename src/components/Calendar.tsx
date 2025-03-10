
import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Calendar as ShadcnCalendar 
} from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAppointment } from '@/context/AppointmentContext';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ className }) => {
  const { 
    selectedDate, 
    setSelectedDate,
    getTimeSlotsByDate 
  } = useAppointment();

  // Disallow past dates
  const disabledDays = {
    before: new Date(),
  };

  // Get available slots for the selected date
  const availableSlotsCount = selectedDate 
    ? getTimeSlotsByDate(selectedDate).filter(slot => slot.isAvailable).length 
    : 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Select Date</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>
            {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Choose a date'}
          </span>
        </div>
      </div>
      
      <div className="glass-panel rounded-lg p-4 animate-fade-in">
        <ShadcnCalendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={disabledDays}
          className={cn("pointer-events-auto rounded-md border-none")}
        />
      </div>
      
      {selectedDate && (
        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg animate-slide-up">
          <div>
            <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d')}</p>
            <p className="text-sm text-muted-foreground">
              {availableSlotsCount} available slot{availableSlotsCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (selectedDate) {
                  const prevDay = addDays(selectedDate, -1);
                  if (prevDay >= new Date()) {
                    setSelectedDate(prevDay);
                  }
                }
              }}
              disabled={selectedDate ? isSameDay(selectedDate, new Date()) : true}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (selectedDate) {
                  setSelectedDate(addDays(selectedDate, 1));
                }
              }}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
