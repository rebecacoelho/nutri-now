# NutriNow 🥗

NutriNow é uma aplicação móvel desenvolvida com Expo e React Native que conecta nutricionistas e pacientes, facilitando o acompanhamento nutricional e a gestão de planos alimentares.

## Funcionalidades

### Para Nutricionistas
- **Dashboard**: Visualização de estatísticas e informações importantes
- **Gestão de Pacientes**: Adicionar e gerenciar pacientes
- **Criação de Planos Alimentares**: Elaborar planos personalizados
- **Agendamento**: Gerenciar consultas e compromissos
- **Relatórios**: Gerar e visualizar relatórios de progresso
- **Perfil Profissional**: Gerenciar informações pessoais

### Para Pacientes
- **Dashboard**: Visão geral do progresso e planos alimentares
- **Contador de Calorias**: Registro e monitoramento da ingestão calórica
- **Planos Alimentares**: Acesso aos planos criados pelo nutricionista
- **Agendamento de Consultas**: Marcar novas consultas
- **Progresso**: Acompanhamento da evolução
- **Perfil**: Gerenciamento de informações pessoais

## Tecnologias Utilizadas

- **Expo**: Framework para desenvolvimento React Native
- **React Native**: Desenvolvimento de aplicações móveis
- **TypeScript**: Tipagem estática para JavaScript
- **Expo Router**: Navegação baseada em arquivos
- **AsyncStorage**: Armazenamento local de dados
- **Axios**: Cliente HTTP para requisições API
- **React Native Maps**: Integração com mapas
- **React Native Calendars**: Componentes de calendário
- **React Native Chart Kit**: Visualização de dados em gráficos
- **Expo Vector Icons**: Biblioteca de ícones

## Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd nutri-now
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o aplicativo:
   ```bash
   npx expo start
   ```

## Estrutura do Projeto

- **/app**: Contém os arquivos principais da aplicação
  - **/components**: Componentes reutilizáveis
  - **/contexts**: Contextos React para gerenciamento de estado
  - **/nutritionist**: Telas específicas para nutricionistas
  - **/patient**: Telas específicas para pacientes
  - **/utils**: Funções utilitárias
  - **index.tsx**: Página inicial
  - **login.tsx**: Tela de login
  - **register.tsx**: Tela de registro

## Requisitos

- Node.js 14.0 ou superior
- npm ou yarn
- Expo CLI
