import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PacienteData {
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  genero: string;
  email: string;
  senha: string;
  endereco: string;
  telefone: string;
  data_nascimento: string;
}

export interface NutricionistaData {
  nome: string;
  email: string;
  senha: string;
  endereco: string;
  telefone: string;
  horarios_disponiveis: Record<string, any>;
}

export interface RegisterUserData {
  email: string;
  password: string;
  is_paciente: boolean;
  is_nutricionista: boolean;
  paciente_data?: PacienteData;
  nutricionista_data?: NutricionistaData;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface ApiResponse {
  id?: number;
  mensagem?: string;
  [key: string]: any;
}

export interface TokenResponse {
  access: string;
}

export interface AppointmentData {
  nutricionista: string | number;
  data_consulta: string;
}

export interface AppointmentResponse {
  data_consulta: string;
  nutricionista: string | number;
  paciente: number;
  realizada: boolean;
}

export interface AppointmentsResponse {
  id: number;
  data_consulta: string; 
  nutricionista_nome: string;
  paciente_nome: string;
  realizada: boolean;
};

export interface SubstitutionItem {
  descricao: string;
  kcal: number;
  grupo: string;
}

export interface Substitution {
  descrição: string;
  items: SubstitutionItem[];
}

export interface MealItem {
  descricao: string;
  kcal: number;
  grupo: string;
  substituicoes: Substitution[];
}

export interface Meal {
  horario: string;
  nome: string;
  items: MealItem[];
}

export interface JsonData {
  refeicoes: Meal[];
}

export interface MealPlanData {
  paciente: number;
  id_nutricionista: number;
  dados_json: JsonData;
}

export interface MealDiaryEntry {
  [key: string]: string;
}

export interface AvailabilityData {
  id_nutricionista: number;
  horarios_disponiveis: Record<string, any>;
}

const API_URL = "https://nutrinow.onrender.com";

export const formatDateToAPI = (date: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  const parts = date.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }
  
  return date;
};

export const formatDateToDisplay = (date: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
  
  return date;
};

export const registerUser = async (userData: RegisterUserData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/registrar_usuario/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao registrar usuário');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const loginUser = async (userData: LoginUserData) => {
  try {
    const response = await fetch(`${API_URL}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao fazer login');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<TokenResponse> => {
  try {
    const token = await AsyncStorage.getItem("refreshToken");

    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: token
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao fazer login');
    }

    const data = await response.json();
    await AsyncStorage.setItem("accessToken", data.access);
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const getAllNutritionists = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/listar_nutricionistas/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao buscar nutricionistas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const makeAppointment = async (appointmentData: AppointmentData): Promise<AppointmentResponse> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/criar_consulta/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nutricionista: String(appointmentData.nutricionista),
        data_consulta: appointmentData.data_consulta
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao criar consulta');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const confirmAppointment = async (appointmentId: string) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/realizar_consulta/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id_consulta: appointmentId,
        realizada: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao confirmar consulta');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const updateNutritionistAvailability = async (availabilityData: AvailabilityData) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/atualiza_horarios_disponiveis/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(availabilityData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao atualizar disponibilidade');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const getAppointments = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const nutritionistId = await AsyncStorage.getItem("@nutricionista/userId");
    const patientId = await AsyncStorage.getItem("@paciente/userId");

    const response = await fetch(`${API_URL}/lista_consultas/${nutritionistId ?? patientId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao buscar informações das consultas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const getPatientData = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const patientId = await AsyncStorage.getItem("@paciente/userId");
    const response = await fetch(`${API_URL}/info_paciente/${patientId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao buscar informações do paciente');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const getNutritionistData = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const nutritionistId = await AsyncStorage.getItem("@nutricionista/userId");

    const response = await fetch(`${API_URL}/info_nutricionista/${nutritionistId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao buscar informações do nutricionista');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const createMealPlan = async (mealPlanData: MealPlanData) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/criar_plano_alimentar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(mealPlanData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao criar plano alimentar');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const getMealPlan = async (mealPlanId: string) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!mealPlanId) {
      return null;
    }

    const response = await fetch(`${API_URL}/retorna_plano_alimentar/${mealPlanId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao buscar plano alimentar');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const updateMealDiary = async (pacientId: string, diario_alimentar: MealDiaryEntry[]) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!pacientId) {
      return null;
    }

    const response = await fetch(`${API_URL}/adicionar_alimento_no_diario/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id_paciente: String(pacientId),
        diario_alimentar
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao adicionar alimento no diário');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};
