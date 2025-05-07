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
  username: string;
  email: string;
  password: string;
  is_paciente: boolean;
  is_nutricionista: boolean;
  paciente_data?: PacienteData;
  nutricionista_data?: NutricionistaData;
}

export interface LoginUserData {
  username: string;
  password: string;
}

export interface ApiResponse {
  id?: number;
  username?: string;
  mensagem?: string;
  [key: string]: any;
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