import { db } from '../models/store';
import { User, Appointment } from '../types';

export class AppController {
  // Authentication Logic (RF-F1)
  static async login(email: string, password: string): Promise<User | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = db.getUserByEmail(email);
    if (user) return user;
    return null;
  }

  // Data Retrieval Logic
  static getStudentDashboardData(userId: string) {
    return {
      appointments: db.getAppointments(userId),
      courses: db.getCourses(userId),
      notifications: db.getNotifications(userId)
    };
  }

  static getAdminDashboardData() {
    return {
      metrics: db.getMetrics()
    };
  }

  static getCourses(userId: string) {
    return db.getCourses(userId);
  }

  static getNotifications(userId: string) {
    return db.getNotifications(userId);
  }

  static markNotificationRead(id: string) {
    db.markNotificationAsRead(id);
  }

  // Preference Logic (RF-F2)
  static toggleHighContrast(userId: string, currentVal: boolean) {
    if (!currentVal) {
      document.documentElement.classList.add('grayscale', 'contrast-125');
    } else {
      document.documentElement.classList.remove('grayscale', 'contrast-125');
    }
    return db.updateUserPreferences(userId, { 
      highContrast: !currentVal
    });
  }

  static updatePreferences(userId: string, prefs: Partial<User['preferences']>) {
    return db.updateUserPreferences(userId, prefs);
  }

  static updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'email'>>) {
    return db.updateUserProfile(userId, data);
  }

  // Appointment Logic (RF-F6)
  static addAppointment(userId: string, appointmentData: Omit<Appointment, 'id' | 'status'>) {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      status: 'pending',
      ...appointmentData
    };
    db.addAppointment(newAppointment);
    return newAppointment;
  }

  static updateAppointmentStatus(id: string, status: Appointment['status']) {
    return db.updateAppointmentStatus(id, status);
  }

  static getAppointments(userId: string) {
    return db.getAppointments(userId);
  }

  // Privacy Logic (RF-F19)
  static updateConsents(userId: string, consents: Partial<User['consents']>) {
    return db.updateUserConsents(userId, consents);
  }
}