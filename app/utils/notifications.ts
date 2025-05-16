import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4CAF50',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao obter permissão para notificações push!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
  } else {
    alert('É necessário um dispositivo físico para receber notificações push');
  }

  return token;
}

export async function scheduleAppointmentReminder(appointmentDate: Date, patientName: string) {
  const trigger = new Date(appointmentDate);
  trigger.setHours(trigger.getHours() - 24); 

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de Consulta',
      body: `Você tem uma consulta amanhã com ${patientName}`,
      data: { appointmentDate },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });
}

export async function scheduleMealReminder() {
  const mealtimes = [
    { hour: 7, minute: 0, name: 'Café da manhã' },
    { hour: 12, minute: 0, name: 'Almoço' },
    { hour: 19, minute: 0, name: 'Jantar' },
  ];

  for (const meal of mealtimes) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hora da refeição!`,
        body: `Está na hora do seu ${meal.name}. Não se esqueça de registrar sua refeição!`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(new Date().setHours(meal.hour, meal.minute, 0, 0)),
      },
    });
  }
}

export async function sendProgressNotification(achievement: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Parabéns pelo seu progresso! 🎉',
      body: achievement,
    },
    trigger: null,
  });
}

export async function sendNewMessageNotification(senderName: string, message: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Nova mensagem de ${senderName}`,
      body: message,
    },
    trigger: null,
  });
}

export async function sendNewPatientNotification(patientName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Novo Paciente',
      body: `${patientName} acabou de se tornar seu paciente!`,
    },
    trigger: null,
  });
}

export async function sendWelcomeNotification(userName: string, userType: "patient" | "nutritionist") {
  const title = userType === "patient" 
    ? "Bem-vindo(a) ao NutriNow! 🌱" 
    : "Bem-vindo(a) ao NutriNow! 👩‍⚕️";

  const body = userType === "patient"
    ? `Olá ${userName}! Estamos felizes em ter você conosco. Comece sua jornada para uma vida mais saudável agora mesmo!`
    : `Olá Dr(a). ${userName}! Estamos felizes em ter você conosco. Seu espaço para atender pacientes está pronto!`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
}

export interface NotificationSettings {
  appointmentReminders: boolean;
  mealReminders: boolean;
  progressAlerts: boolean;
  newMessages: boolean;
  newPatients?: boolean; // Apenas para nutricionistas
}

export const defaultPatientSettings: NotificationSettings = {
  appointmentReminders: true,
  mealReminders: true,
  progressAlerts: true,
  newMessages: true,
};

export const defaultNutritionistSettings: NotificationSettings = {
  appointmentReminders: true,
  mealReminders: false,
  progressAlerts: false,
  newMessages: true,
  newPatients: true,
}; 