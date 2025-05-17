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

interface ApiRequestConfig {
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

const makeApiRequest = async (
  url: string,
  config: ApiRequestConfig,
  retryCount = 0
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    const response = await fetch(`${API_URL}${url}`, config);

    if (response.status === 401 && retryCount === 0) {
      try {
        const refreshResponse = await refreshToken();
        if (refreshResponse.access) {
          return makeApiRequest(url, config, retryCount + 1);
        }
      } catch (error) {
        throw error;
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro na requisição');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Sessão expirada. Por favor, faça login novamente.') {
      throw error;
    }
    console.error('Erro na API:', error);
    throw error;
  }
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
    
    const data = await response.json();
    
    await AsyncStorage.setItem("accessToken", data.access);
    await AsyncStorage.setItem("refreshToken", data.refresh);
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<TokenResponse> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken
      })
    });
    
    if (!response.ok) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    const data = await response.json();
    await AsyncStorage.setItem("accessToken", data.access);
    
    return data;
  } catch (error) {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    console.error('Erro ao atualizar token:', error);
    throw error;
  }
};

export const getAllNutritionists = async () => {
  return makeApiRequest('/listar_nutricionistas/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const makeAppointment = async (appointmentData: AppointmentData): Promise<AppointmentResponse> => {
  return makeApiRequest('/criar_consulta/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nutricionista: String(appointmentData.nutricionista),
      data_consulta: appointmentData.data_consulta
    })
  });
};

export const confirmAppointment = async (appointmentId: string) => {
  return makeApiRequest('/realizar_consulta/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_consulta: appointmentId,
      realizada: true
    })
  });
};

export const updateNutritionistAvailability = async (availabilityData: AvailabilityData) => {
  return makeApiRequest('/atualiza_horarios_disponiveis/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(availabilityData)
  });
};

export const getAppointments = async () => {
  const nutritionistId = await AsyncStorage.getItem("@nutricionista/userId");
  const patientId = await AsyncStorage.getItem("@paciente/userId");
  
  return makeApiRequest(`/lista_consultas/${nutritionistId ?? patientId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getPatientData = async () => {
  const patientId = await AsyncStorage.getItem("@paciente/userId");
  
  return makeApiRequest(`/info_paciente/${patientId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getNutritionistData = async () => {
  const nutritionistId = await AsyncStorage.getItem("@nutricionista/userId");
  
  return makeApiRequest(`/info_nutricionista/${nutritionistId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createMealPlan = async (mealPlanData: MealPlanData) => {
  return makeApiRequest('/criar_plano_alimentar/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mealPlanData)
  });
};

export const getMealPlan = async (mealPlanId: string) => {
  if (!mealPlanId) {
    return null;
  }

  return makeApiRequest(`/retorna_plano_alimentar/${mealPlanId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateMealDiary = async (pacientId: string, diario_alimentar: MealDiaryEntry[]) => {
  if (!pacientId) {
    return null;
  }

  return makeApiRequest('/adicionar_alimento_no_diario/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_paciente: String(pacientId),
      diario_alimentar
    })
  });
};
