
export type AssessmentType = 'AV1' | 'AV2' | 'PAT' | 'TRABALHO' | 'AVISO';
export type UserRole = 'student' | 'teacher';

export interface AssessmentRecord {
  id: string;
  subjectId: string;
  subjectName?: string;
  type: AssessmentType;
  grade: number;
  date: string;
  content: string;
  targetGrade: string; // Turma destino (ex: 1º Ano Médio)
  teacherId?: string;
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
  privacy: 'public' | 'private';
  category: 'Fundamental' | 'Médio' | 'Extra';
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  grade: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  assignedSubjects?: string[]; // IDs das matérias que o professor leciona
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
  subjects: Subject[]; // No caso do aluno, suas matérias. No caso do professor, todas as disponíveis para vincular.
  calendar: AssessmentRecord[];
  currentTrimester: 1 | 2 | 3;
  studySession: StudySession;
  studyGroups: StudyGroup[];
  studentsRegistry: StudentRegistry[];
}

export enum PerformanceStatus {
  APPROVED = 'Aprovado',
  AT_RISK = 'Em Risco',
  DANGER = 'Precisa Atenção',
  NONE = 'Nenhuma Nota'
}
