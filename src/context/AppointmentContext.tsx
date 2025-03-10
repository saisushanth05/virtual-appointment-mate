
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type TimeSlot = {
  id: string;
  date: string; // ISO date string
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  isAvailable: boolean;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  timeSlotId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  timeSlot: TimeSlot;
  createdAt: string; // ISO date string
};

// Context interface
interface AppointmentContextType {
  doctors: Doctor[];
  availableTimeSlots: TimeSlot[];
  appointments: Appointment[];
  selectedDoctor: Doctor | null;
  selectedDate: Date | undefined;
  selectedTimeSlot: TimeSlot | null;
  isBookingModalOpen: boolean;
  
  // Actions
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  setIsBookingModalOpen: (isOpen: boolean) => void;
  bookAppointment: (patientName: string, patientEmail: string, notes?: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  getTimeSlotsByDate: (date: Date) => TimeSlot[];
  getDoctorAppointments: (doctorId: string) => Appointment[];
}

// Create the context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Provider component
export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sample data - would come from an API in a real app
  const [doctors] = useState<Doctor[]>([
    {
      id: 'd1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Practitioner',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 'd2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      id: 'd3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrician',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
  ]);

  // Generate time slots for the next 7 days
  const generateInitialTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    // Generate slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(now.getDate() + day);
      
      // 9 AM to 5 PM with 30-minute slots
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startHour = hour.toString().padStart(2, '0');
          const startMinute = minute.toString().padStart(2, '0');
          
          const endHour = minute === 30 ? hour.toString().padStart(2, '0') : (hour + 1).toString().padStart(2, '0');
          const endMinute = minute === 30 ? '00' : '30';
          
          const startTime = `${startHour}:${startMinute}`;
          const endTime = `${endHour}:${endMinute}`;
          
          // Randomly make some slots unavailable
          const isAvailable = Math.random() > 0.3;
          
          slots.push({
            id: `ts-${date.toISOString().split('T')[0]}-${startTime}`,
            date: date.toISOString(),
            startTime,
            endTime,
            isAvailable,
          });
        }
      }
    }
    
    return slots;
  };

  // State
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>(generateInitialTimeSlots());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Get time slots for a specific date
  const getTimeSlotsByDate = (date: Date): TimeSlot[] => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return availableTimeSlots.filter(slot => {
      const slotDateStr = new Date(slot.date).toISOString().split('T')[0];
      return slotDateStr === dateStr;
    });
  };

  // Get appointments for a specific doctor
  const getDoctorAppointments = (doctorId: string): Appointment[] => {
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  };

  // Book an appointment
  const bookAppointment = (patientName: string, patientEmail: string, notes?: string) => {
    if (!selectedDoctor || !selectedTimeSlot) return;
    
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      patientName,
      patientEmail,
      doctorId: selectedDoctor.id,
      timeSlotId: selectedTimeSlot.id,
      status: 'scheduled',
      notes,
      timeSlot: selectedTimeSlot,
      createdAt: new Date().toISOString(),
    };
    
    // Update appointments
    setAppointments([...appointments, newAppointment]);
    
    // Update time slot availability
    setAvailableTimeSlots(
      availableTimeSlots.map(slot => 
        slot.id === selectedTimeSlot.id ? { ...slot, isAvailable: false } : slot
      )
    );
    
    // Reset selection
    setSelectedTimeSlot(null);
    setIsBookingModalOpen(false);
  };

  // Cancel an appointment
  const cancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    // Update appointment status
    setAppointments(
      appointments.map(a => 
        a.id === appointmentId ? { ...a, status: 'cancelled' } : a
      )
    );
    
    // Make the time slot available again
    setAvailableTimeSlots(
      availableTimeSlots.map(slot => 
        slot.id === appointment.timeSlotId ? { ...slot, isAvailable: true } : slot
      )
    );
  };

  const value = {
    doctors,
    availableTimeSlots,
    appointments,
    selectedDoctor,
    selectedDate,
    selectedTimeSlot,
    isBookingModalOpen,
    setSelectedDoctor,
    setSelectedDate,
    setSelectedTimeSlot,
    setIsBookingModalOpen,
    bookAppointment,
    cancelAppointment,
    getTimeSlotsByDate,
    getDoctorAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Hook to use the appointment context
export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
