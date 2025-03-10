
import React from 'react';
import { format } from 'date-fns';
import { useAppointment, Doctor } from '@/context/AppointmentContext';
import TimeSlotComponent from '@/components/TimeSlot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock } from 'lucide-react';

interface DoctorAvailabilityProps {
  className?: string;
}

const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({ className }) => {
  const { 
    doctors, 
    selectedDate, 
    selectedDoctor, 
    setSelectedDoctor, 
    getTimeSlotsByDate 
  } = useAppointment();

  // If no doctor is selected, select the first one
  React.useEffect(() => {
    if (doctors.length > 0 && !selectedDoctor) {
      setSelectedDoctor(doctors[0]);
    }
  }, [doctors, selectedDoctor, setSelectedDoctor]);

  const availableTimeSlots = selectedDate 
    ? getTimeSlotsByDate(selectedDate).filter(slot => slot.isAvailable)
    : [];

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  if (!selectedDate) {
    return (
      <div className={className}>
        <div className="text-center py-10">
          <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium">Select a Date</h3>
          <p className="text-muted-foreground">
            Please select a date to view available time slots
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Select Provider</h3>
        <p className="text-sm text-muted-foreground">
          Choose a healthcare provider for your appointment
        </p>
      </div>

      <Tabs defaultValue={selectedDoctor?.id || doctors[0]?.id} className="w-full">
        <TabsList className="w-full mb-4">
          {doctors.map((doctor) => (
            <TabsTrigger
              key={doctor.id}
              value={doctor.id}
              onClick={() => handleDoctorSelect(doctor)}
              className="flex-1"
            >
              {doctor.name.split(' ')[1]}
            </TabsTrigger>
          ))}
        </TabsList>

        {doctors.map((doctor) => (
          <TabsContent key={doctor.id} value={doctor.id} className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{doctor.name}</h4>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
            </div>

            <h4 className="font-medium mb-3">
              Available slots for {format(selectedDate, 'EEEE, MMMM d')}
            </h4>

            {availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 animate-slide-up">
                {availableTimeSlots.map((timeSlot) => (
                  <TimeSlotComponent key={timeSlot.id} timeSlot={timeSlot} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg animate-fade-in">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-medium">No available slots</h4>
                <p className="text-sm text-muted-foreground">
                  Please select another date
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DoctorAvailability;
