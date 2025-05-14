import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppointmentsResponse, getAppointments } from '@/api';
import { onTokenRefreshed } from '../utils/tokenEvents';

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
  telefone: string;
}

interface PatientContextData {
  patientData: PatientData | null;
  appointments: AppointmentsResponse[];
  setPatientData: (data: PatientData) => Promise<void>;
  fetchAppointments: () => Promise<void>;
  loading: boolean;
}

const PatientContext = createContext<PatientContextData>({} as PatientContextData);

export default function PatientProvider({ children }: { children: ReactNode }) {
  const [patientData, setPatientDataState] = useState<PatientData | null>(null);
  const [appointments, setAppointmentsState] = useState<AppointmentsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        const patientDataStr = await AsyncStorage.getItem('@paciente/data');
        if (patientDataStr) {
          setPatientDataState(JSON.parse(patientDataStr));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do paciente:', error);
      }
    };

    loadPatientData();

    const unsubscribe = onTokenRefreshed(() => {
      fetchAppointments();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const setPatientData = async (data: PatientData) => {
    try {
      await AsyncStorage.setItem('@paciente/data', JSON.stringify(data));
      setPatientDataState(data);
    } catch (error) {
      console.error('Erro ao salvar dados do paciente:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments();
      setAppointmentsState(response);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patientData,
        appointments,
        setPatientData,
        fetchAppointments,
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