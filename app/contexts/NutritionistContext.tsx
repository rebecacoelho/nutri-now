import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppointmentsResponse } from '@/api';

interface NutritionistData {
  id: number;
  nome: string;
  email: string;
  horarios_disponiveis: string[];
}

interface NutritionistContextData {
  nutritionistData: NutritionistData | null;
  appointments: AppointmentsResponse[];
  setNutritionistData: (data: NutritionistData) => Promise<void>;
  setAppointments: (appointments: AppointmentsResponse[]) => Promise<void>;
  loading: boolean;
}

const NutritionistContext = createContext<NutritionistContextData>({} as NutritionistContextData);

export function NutritionistProvider({ children }: { children: ReactNode }) {
  const [nutritionistData, setNutritionistDataState] = useState<NutritionistData | null>(null);
  const [appointments, setAppointmentsState] = useState<AppointmentsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [nutritionistDataStr, appointmentsStr] = await Promise.all([
        AsyncStorage.getItem('@nutricionista/data'),
        AsyncStorage.getItem('@nutricionista/appointments')
      ]);

      if (nutritionistDataStr) {
        setNutritionistDataState(JSON.parse(nutritionistDataStr));
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

  const setNutritionistData = async (data: NutritionistData) => {
    try {
      await AsyncStorage.setItem('@nutricionista/data', JSON.stringify(data));
      setNutritionistDataState(data);
    } catch (error) {
      console.error('Erro ao salvar dados do nutricionista:', error);
    }
  };

  const setAppointments = async (newAppointments: AppointmentsResponse[]) => {
    try {
      await AsyncStorage.setItem('@nutricionista/appointments', JSON.stringify(newAppointments));
      setAppointmentsState(newAppointments);
    } catch (error) {
      console.error('Erro ao salvar consultas:', error);
    }
  };

  return (
    <NutritionistContext.Provider
      value={{
        nutritionistData,
        appointments,
        setNutritionistData,
        setAppointments,
        loading
      }}
    >
      {children}
    </NutritionistContext.Provider>
  );
}

export function useNutritionist() {
  const context = useContext(NutritionistContext);
  if (!context) {
    throw new Error('useNutritionist deve ser usado dentro de um NutritionistProvider');
  }
  return context;
} 