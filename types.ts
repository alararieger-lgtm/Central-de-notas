
export type AssessmentType = 'AV1' | 'AV2' | 'PAT';
export type UserRole = 'student' | 'teacher';

export interface AssessmentRecord {
  id: string;
  subjectId: string;
  type: AssessmentType;
  grade: number;
  date: string;
  content: string;
}

export interface TrimesterGrades {
  av1: number[];
  av2: number[];
  pat: number | null;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  trimesters: {
    1: TrimesterGrades;
    2: TrimesterGrades;
    3: TrimesterGrades;
  };
}

export interface StudySession {
  totalSeconds: number;
  todaySeconds: number;
  lastStudyDate: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  membersCount: number;
  description: string;
  isOfficial?: boolean;
  category: 'Fundamental' | 'Médio' | 'Extra';
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  grade: string;
  role: UserRole;
  email?: string;
  avatar?: string;
}

// Representação de um aluno para o professor
export interface StudentRegistry {
  id: string;
  name: string;
  grade: string;
  subjects: Subject[];
}

export interface AppData {
  user: UserProfile | null;
  subjects: Subject[];
  calendar: AssessmentRecord[];
  currentTrimester: 1 | 2 | 3;
  studySession: StudySession;
  studyGroups: StudyGroup[];
  studentsRegistry?: StudentRegistry[]; // Apenas para professores
}

export enum PerformanceStatus {
  APPROVED = 'Aprovado',
  AT_RISK = 'Em Risco',
  DANGER = 'Precisa Atenção',
  NONE = 'Nenhuma Nota'
}
