import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppointmentsResponse, getAppointments } from '@/api';
import { onTokenRefreshed } from '../utils/tokenEvents';

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
  fetchAppointments: () => Promise<void>;
  loading: boolean;
}

const NutritionistContext = createContext<NutritionistContextData>({} as NutritionistContextData);

export default function NutritionistProvider({ children }: { children: ReactNode }) {
  const [nutritionistData, setNutritionistDataState] = useState<NutritionistData | null>(null);
  const [appointments, setAppointmentsState] = useState<AppointmentsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNutritionistData = async () => {
      try {
        const nutritionistDataStr = await AsyncStorage.getItem('@nutricionista/data');
        if (nutritionistDataStr) {
          setNutritionistDataState(JSON.parse(nutritionistDataStr));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do nutricionista:', error);
      }
    };

    loadNutritionistData();

    const unsubscribe = onTokenRefreshed(() => {
      fetchAppointments();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const setNutritionistData = async (data: NutritionistData) => {
    try {
      await AsyncStorage.setItem('@nutricionista/data', JSON.stringify(data));
      setNutritionistDataState(data);
    } catch (error) {
      console.error('Erro ao salvar dados do nutricionista:', error);
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
    <NutritionistContext.Provider
      value={{
        nutritionistData,
        appointments,
        setNutritionistData,
        fetchAppointments,
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