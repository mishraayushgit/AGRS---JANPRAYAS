export type ModalityType = "voice" | "document" | "text";

export type DepartmentType =
  | "Power & Electricity"
  | "Water Resources"
  | "Public Health & Sanitation"
  | "Roads & Infrastructure";

export type UrgencyTier = "TIER_1_CRITICAL" | "TIER_2_HIGH" | "TIER_3_ROUTINE";

export type GrievanceStatus = "IN_PROCESS" | "ROUTED" | "DISPATCHED" | "RESOLVED";

export type SubmissionMode = "text" | "audio" | "document";
export type ASREngineType = "whisperx-large-v3" | "conformer-indic-asr";
export type OCREngineType = "trocr-handwritten" | "paddleocr-v4" | "hybrid-ocr-pipeline";
export type ModelEngineProfile = "gemini-3.6-flash-indic" | "indic-t5-zero-shot";
export type SentimentCategory =
  | "Critical Distress"
  | "Frustrated / Agitated"
  | "Concerned / Vigilant"
  | "Neutral / Inquiring"
  | "Satisfied / Constructive"
  | string;

export interface OCRTextLine {
  text: string;
  confidence: number;
  is_handwritten?: boolean;
  bbox?: [number, number, number, number];
  script?: string;
}

export interface OCRMetadata {
  engine: string;
  doc_type: string;
  confidence_score: number;
  detected_script: string;
  character_count: number;
  handwritten_probability: number;
  processing_time_ms: number;
  inference_time_ms?: number;
  character_error_rate?: number;
  image_url?: string;
  lines: OCRTextLine[];
  extracted_lines?: { text: string; confidence: number; is_handwritten?: boolean }[];
}

export interface ASRWord {
  word: string;
  start: number;
  end: number;
  score: number;
  speaker?: string;
}

export interface ASRSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence: number;
  words?: ASRWord[];
}

export interface ASRMetadata {
  engine: string;
  duration_seconds: number;
  detected_language?: string;
  language_confidence: number;
  snr_db: number;
  vad_speech_ratio: number;
  speaker_count: number;
  alignment_model: string;
  segments: ASRSegment[];
  word_segments?: ASRWord[];
  audio_url?: string;
}

export interface ZeroShotCategory {
  category: string;
  probability: number;
  rationale?: string;
  score?: number;
  keywords?: string[];
}

export interface AsyncTaskStage {
  name: string;
  latency_ms: number;
  status: "completed" | "processing" | "pending";
}

export interface AsyncTaskMetadata {
  task_id: string;
  status: "ROUTED" | "PROCESSING" | "DISPATCHED" | "RESOLVED";
  queue_name: string;
  worker_node: string;
  total_latency_ms: number;
  dispatched_at: string;
  pipeline_stages: AsyncTaskStage[];
}

export type UserRole = "citizen" | "officer" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  role: UserRole;
  aadhaar_masked?: string;
  department?: DepartmentType;
  designation?: string;
  employee_id?: string;
  jurisdiction_ward?: string;
  avatar_url?: string;
  created_at: string;
}

export type NotificationChannel = "SMS" | "EMAIL" | "WHATSAPP";
export type NotificationStatus = "DELIVERED" | "SENT" | "READ";

export interface GrievanceNotification {
  id: string;
  grievance_id: string;
  reference_id: string;
  channel: NotificationChannel;
  recipient: string; // Phone number or email
  recipient_name: string;
  title: string;
  subject?: string;
  message_body: string;
  status: NotificationStatus;
  sent_at: string;
  sender_id: string; // e.g. "VM-JANPRY" or "alerts@janprayas.gov.in"
  tracking_url: string;
  meta: {
    department: DepartmentType;
    urgency_tier: UrgencyTier;
    urgency_score: number;
    sla_window: string;
    location: string;
    officer_name?: string;
    docket_no: string;
  };
  is_read?: boolean;
}

export interface GrievanceRecord {
  id: string;
  timestamp: string;
  modality: ModalityType;
  title: string;
  extracted_text: string;
  assigned_department: DepartmentType;
  urgency_score: number; // 0 - 100
  urgency_tier: UrgencyTier;
  sla_window: string;
  sla_remaining_minutes: number;
  status: GrievanceStatus;
  ai_confidence_score: number;
  detected_language: string;
  location: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  problem_photo_url?: string;
  problem_photo_name?: string;
  reference_id?: string;
  citizen_name?: string;
  citizen_phone?: string;
  citizen_email?: string;
  notification_channels?: NotificationChannel[];
  notifications_sent?: GrievanceNotification[];
  safety_justification: string;
  human_verified: boolean;
  verified_by?: string;
  assigned_officer_name?: string;
  assigned_officer_role?: string;
  field_team?: string;
  zero_shot_categories: (ZeroShotCategory | any)[];
  asr_metadata?: ASRMetadata;
  ocr_metadata?: OCRMetadata;
  async_task: AsyncTaskMetadata;
  model_used: string;
}

export interface GrievanceResult {
  extracted_text?: string;
  assigned_department?: DepartmentType;
  priority_level?: "HIGH" | "MEDIUM" | "LOW";
  ai_confidence_score?: number;
  detected_language?: string;
  sentiment?: any;
  sentiment_score?: number;
  urgency_score?: number;
  urgency_tier?: UrgencyTier;
  sla_window?: string;
  safety_justification?: string;
  model_used?: string;
  zero_shot_categories?: (ZeroShotCategory | any)[];
  async_task?: AsyncTaskMetadata;
  asr_metadata?: ASRMetadata;
  ocr_metadata?: OCRMetadata;
  // Legacy compatibility fields
  category?: string;
  department?: string;
  priority?: string;
  confidence?: number;
  detectedLanguage?: string;
  urgencyScore?: number;
  targetSLA?: string;
  actionRationale?: string;
  extractedDetails?: any;
}

export interface PresetSample {
  id: string;
  title: string;
  type: "audio" | "document" | "text";
  department: DepartmentType;
  priority: "HIGH" | "MEDIUM" | "LOW";
  text: string;
  description: string;
  audioSampleLabel?: string;
  docEngineLabel?: string;
  isHandwritten?: boolean;
}

export interface GrievanceHistoryItem {
  id: string;
  timestamp: string;
  submission_type?: "audio" | "document" | "text";
  submissionMode?: any;
  input_preview?: string;
  inputSummary?: string;
  result: GrievanceResult | any;
  asr_engine?: string;
  ocr_engine?: string;
}

export interface SystemServiceHealth {
  id: string;
  name: string;
  status: "operational" | "degraded" | "offline";
  latency_ms: number;
  uptime: string;
  details: string;
}

export interface AIServiceMetric {
  id: string;
  name: string;
  modality: string;
  status: "operational" | "degraded";
  latency_ms: number;
  worker_pool: string;
  queue_name: string;
  confidence: number;
  error_rate: number;
}

export interface WorkerPoolStats {
  gpu_active: number;
  gpu_idle: number;
  gpu_failed: number;
  cpu_active: number;
  cpu_idle: number;
  cpu_failed: number;
}

export interface QueueStatItem {
  id: string;
  name: string;
  waiting: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface SystemEventLog {
  id: string;
  timestamp: string;
  type: "intake" | "asr" | "ocr" | "nlp" | "route" | "dispatch" | "verification" | "resolve";
  message: string;
  details?: string;
  status: "success" | "warning" | "info";
}
