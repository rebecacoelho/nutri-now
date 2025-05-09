import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppointmentsResponse } from '@/api';

interface PatientData {
  id: number;
  nome: string;
  email: string;
  data_nascimento: string;
  peso: number;
  altura: number;
  objetivo: string;
  genero: string;
  endereco: string;
  plano_alimentar: string;
}

interface PatientContextData {
  patientData: PatientData | null;
  appointments: AppointmentsResponse[];
  setPatientData: (data: PatientData) => Promise<void>;
  setAppointments: (appointments: AppointmentsResponse[]) => Promise<void>;
  loading: boolean;
}

const PatientContext = createContext<PatientContextData>({} as PatientContextData);

export default function PatientProvider({ children }: { children: ReactNode }) {
  const [patientData, setPatientDataState] = useState<PatientData | null>(null);
  const [appointments, setAppointmentsState] = useState<AppointmentsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [patientDataStr, appointmentsStr] = await Promise.all([
        AsyncStorage.getItem('@paciente/data'),
        AsyncStorage.getItem('@paciente/appointments')
      ]);

      if (patientDataStr) {
        setPatientDataState(JSON.parse(patientDataStr));
      }

      if (appointmentsStr) {
        setAppointmentsState(JSON.parse(appointmentsStr));
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPatientData = async (data: PatientData) => {
    try {
      await AsyncStorage.setItem('@paciente/data', JSON.stringify(data));
      setPatientDataState(data);
    } catch (error) {
      console.error('Erro ao salvar dados do paciente:', error);
    }
  };

  const setAppointments = async (newAppointments: AppointmentsResponse[]) => {
    try {
      await AsyncStorage.setItem('@paciente/appointments', JSON.stringify(newAppointments));
      setAppointmentsState(newAppointments);
    } catch (error) {
      console.error('Erro ao salvar consultas:', error);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patientData,
        appointments,
        setPatientData,
        setAppointments,
        loading
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient deve ser usado dentro de um PatientProvider');
  }
  return context;
} 