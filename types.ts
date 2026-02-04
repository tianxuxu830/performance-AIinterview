
export enum Status {
  NotStarted = '未开始',
  InProgress = '进行中',
  PendingConfirmation = '待确认',
  Completed = '已完成',
  Archived = '已归档'
}

export enum InterviewType {
  Regular = '正式绩效',
  Probation = '试用期评估',
  PIP = '改进计划',
  Counseling = '日常辅导'
}

export type SchedulingStatus = 'scheduled' | 'pending';

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  avatar: string;
}

export type FieldType = 'text' | 'textarea' | 'rating' | 'date' | 'number' | 'attachment';

export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  width?: 'full' | 'half' | 'one-third'; // Layout support for Form view
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  viewType: 'form' | 'table'; // Support different views
  columns?: 1 | 2 | 3; // Grid columns for Form view
  fields: TemplateField[];
}

export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[]; 
  status?: 'active' | 'disabled';
}

export interface PerformanceRecord {
  id: string;
  employeeId: string;
  period: string;
  overallScore: number;
  grade: string;
  status: Status;
  kpiScore: number;
  okrScore: number;
}

export interface PerformanceTrend {
  period: string;
  score: number;
  grade: string;
}

export interface HistoricalRecord {
  id: string;
  date: string;
  type: string;
  manager: string;
  summary: string;
}

export interface InterviewSession {
  id: string;
  employeeId: string;
  employeeName: string;
  managerName: string;
  date: string;
  period: string;
  status: Status;
  type: InterviewType;
  method: 'direct' | 'appointment'; // New field: Direct Feedback or Scheduled Appointment
  templateId: string;
  linkedAssessmentId?: string;
  assessmentCycle?: string; // New field: Associated Assessment Cycle (e.g., '2025 Q4')
  content?: Record<string, any>; 
  schedulingStatus?: SchedulingStatus;
  deadline?: string;
  gradeTag?: string; 
  department?: string; 
  riskTag?: 'high_risk' | 'controversial' | 'normal'; 
}

export interface AssessmentItem {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  employeeStatus: string; 
  currentStage: string; 
  processStatus: string; 
  handler: string;
  group: string;
  templateName: string;
  indicatorTemplate: string;
  score: number;
  grade: string;
}

// New Types for Workbench Dimensions
export interface DimensionItem {
  id: string;
  name: string;
  selfScore: number;
  managerScore: number;
  weight: number;
  description?: string;
}

export interface AssessmentAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'img' | 'doc';
  url: string;
  size: string;
}

// New Types for Detail Table
export interface KeyResult {
  content: string;
}

export interface OKRItem {
  id: string;
  sequence: number;
  name: string;
  weight: number;
  krs: KeyResult[];
}

export interface KPIItem {
  id: string;
  sequence: number;
  name: string;
  description: string;
  evaluationMethod: string;
  weight: number;
  targetValue: string;
}

export interface AssessmentDetail {
  id: string; 
  description: string;
  // Categorized items for dashboard
  highlights: DimensionItem[];
  improvements: DimensionItem[];
  controversies: DimensionItem[]; // Diff > 20%
  attachments: AssessmentAttachment[];
  // Detail Table Data
  okrWeight?: number;
  kpiWeight?: number;
  okrs?: OKRItem[];
  kpis?: KPIItem[];
}
