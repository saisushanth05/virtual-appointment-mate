
import { Doctor, TimeSlot, Appointment } from '@/context/AppointmentContext';

// Generate time slots for the next 7 days
export const generateTimeSlots = (): TimeSlot[] => {
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

// Sample doctors
export const doctors: Doctor[] = [
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
];

// Sample appointments
export const generateSampleAppointments = (timeSlots: TimeSlot[]): Appointment[] => {
  const appointments: Appointment[] = [];
  
  // Create some sample appointments
  const sampleData = [
    {
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorId: 'd1',
      status: 'scheduled' as const,
      notes: 'Regular checkup',
    },
    {
      patientName: 'Emma Wilson',
      patientEmail: 'emma.wilson@example.com',
      doctorId: 'd2',
      status: 'completed' as const,
      notes: 'Follow-up appointment for heart condition',
    },
    {
      patientName: 'Lucas Smith',
      patientEmail: 'lucas.smith@example.com',
      doctorId: 'd3',
      status: 'cancelled' as const,
      notes: 'Vaccination',
    },
    {
      patientName: 'Olivia Brown',
      patientEmail: 'olivia.brown@example.com',
      doctorId: 'd1',
      status: 'scheduled' as const,
      notes: 'Feeling dizzy for the past 3 days',
    },
  ];
  
  // Assign time slots to appointments
  for (let i = 0; i < sampleData.length; i++) {
    // Get a random available time slot
    const availableSlots = timeSlots.filter(slot => slot.isAvailable);
    if (availableSlots.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    const selectedSlot = availableSlots[randomIndex];
    
    // Create appointment
    appointments.push({
      id: `appt-${i}`,
      patientName: sampleData[i].patientName,
      patientEmail: sampleData[i].patientEmail,
      doctorId: sampleData[i].doctorId,
      timeSlotId: selectedSlot.id,
      status: sampleData[i].status,
      notes: sampleData[i].notes,
      timeSlot: selectedSlot,
      createdAt: new Date().toISOString(),
    });
    
    // Mark slot as unavailable
    timeSlots = timeSlots.map(slot => 
      slot.id === selectedSlot.id ? { ...slot, isAvailable: false } : slot
    );
  }
  
  return appointments;
};
