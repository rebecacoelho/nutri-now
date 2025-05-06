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
  message?: string;
  [key: string]: any;
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