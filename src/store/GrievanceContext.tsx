import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GrievanceRecord,
  SystemServiceHealth,
  AIServiceMetric,
  WorkerPoolStats,
  QueueStatItem,
  SystemEventLog,
  ModalityType,
  DepartmentType,
  UrgencyTier,
  UserProfile,
  UserRole,
  GrievanceNotification,
  NotificationChannel,
} from "../types";

export interface CreateGrievanceParams {
  modality: ModalityType;
  extracted_text: string;
  assigned_department?: DepartmentType;
  urgency_score?: number;
  location?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  problem_photo_url?: string;
  problem_photo_name?: string;
  reference_id?: string;
  detected_language?: string;
  engine_used?: string;
  ocr_metadata?: any;
  asr_metadata?: any;
  // Citizen & Notification details
  citizen_name?: string;
  citizen_phone?: string;
  citizen_email?: string;
  notification_channels?: NotificationChannel[];
}

interface GrievanceContextType {
  grievances: GrievanceRecord[];
  activeGrievance: GrievanceRecord | null;
  setActiveGrievance: (grievance: GrievanceRecord | null) => void;
  submitGrievance: (params: CreateGrievanceParams) => Promise<GrievanceRecord>;
  updateGrievance: (id: string, updates: Partial<GrievanceRecord>) => void;
  dispatchGrievance: (id: string) => void;
  resolveGrievance: (id: string) => void;
  verifyGrievance: (id: string, officerName?: string) => void;
  reassignGrievanceDepartment: (id: string, newDepartment: DepartmentType) => void;
  
  // User Authentication & Roles
  currentUser: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  authenticateUser: (account: string, password: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  registerUser: (params: {
    name: string;
    username: string;
    email: string;
    password: string;
    role?: UserRole;
    ward?: string;
    department?: DepartmentType;
  }) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;

  // Mock User Notification System
  notifications: GrievanceNotification[];
  sendMockNotification: (params: {
    grievanceId: string;
    referenceId?: string;
    channel: NotificationChannel;
    recipient?: string;
    recipientName?: string;
    title: string;
    messageBody: string;
    department?: DepartmentType;
    urgencyTier?: UrgencyTier;
    urgencyScore?: number;
    slaWindow?: string;
    location?: string;
  }) => GrievanceNotification;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  activeNotificationModal: GrievanceNotification | null;
  setActiveNotificationModal: (notif: GrievanceNotification | null) => void;

  // Dynamic Shared Metrics
  todayGrievancesCount: number;
  criticalCasesCount: number;
  inProcessCount: number;
  slaComplianceRate: number;
  resolvedTodayCount: number;

  // Global Search State
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // System Health States
  systemServices: SystemServiceHealth[];
  aiServices: AIServiceMetric[];
  workerStats: WorkerPoolStats;
  queueStats: QueueStatItem[];
  systemEvents: SystemEventLog[];
  
  // Navigation & Intake Trigger
  intakeFocusRequested: boolean;
  activeIntakeModality: ModalityType;
  setActiveIntakeModality: (modality: ModalityType) => void;
  requestIntakeFocus: () => void;
  requestModalityIntake: (modality: ModalityType) => void;
  clearIntakeFocus: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: "usr-citizen-01",
  name: "Ayush",
  username: "ayush",
  email: "ayushgulshan31@gmail.com",
  phone: "+91 98765 43210",
  role: "citizen",
  aadhaar_masked: "XXXX-XXXX-8921",
  jurisdiction_ward: "Ward 07, Sector 18",
  created_at: "2026-08-15T09:00:00Z",
};

interface StoredAccount {
  user: UserProfile;
  passwordHash: string;
}

const INITIAL_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      id: "usr-citizen-01",
      name: "Ayush",
      username: "ayush",
      email: "ayushgulshan31@gmail.com",
      phone: "+91 98765 43210",
      role: "citizen",
      aadhaar_masked: "XXXX-XXXX-8921",
      jurisdiction_ward: "Ward 07, Sector 18",
      created_at: "2026-08-15T09:00:00Z",
    },
    passwordHash: "password123",
  },
  {
    user: {
      id: "usr-officer-01",
      name: "Er. Rajesh Sharma",
      username: "officer",
      email: "r.sharma@power.gov.in",
      phone: "+91 98112 34567",
      role: "officer",
      department: "Power & Electricity",
      designation: "Executive Engineer (North Substation)",
      employee_id: "GOV-EE-4920",
      jurisdiction_ward: "Zone 4 (Wards 05-12)",
      created_at: "2026-08-15T09:00:00Z",
    },
    passwordHash: "password123",
  },
  {
    user: {
      id: "usr-admin-01",
      name: "Dr. K. Srinivasan, IAS",
      username: "admin",
      email: "commissioner@janprayas.gov.in",
      phone: "+91 94000 11223",
      role: "admin",
      designation: "Municipal Grievance Commissioner",
      employee_id: "IAS-DL-2011-88",
      created_at: "2026-08-15T09:00:00Z",
    },
    passwordHash: "password123",
  },
];

const INITIAL_NOTIFICATIONS: GrievanceNotification[] = [
  {
    id: "notif-sms-01",
    grievance_id: "GRV-9024",
    reference_id: "PWR-2026-0891",
    channel: "SMS",
    recipient: "+91 98765 43210",
    recipient_name: "Ayush",
    title: "Grievance GRV-9024 Registered & Dispatched",
    message_body: "Govt of India (Jan Prayas): Grievance GRV-9024 (Ref: PWR-2026-0891) for High-Voltage Snapped Cable has been registered & assigned to Power & Electricity. Urgency: 98/100. Target SLA: < 15 MIN. Live Tracking: https://janprayas.gov.in/track/GRV-9024",
    status: "DELIVERED",
    sent_at: "Today • 11:15 AM",
    sender_id: "VM-JANPRY",
    tracking_url: "https://janprayas.gov.in/track/GRV-9024",
    meta: {
      department: "Power & Electricity",
      urgency_tier: "TIER_1_CRITICAL",
      urgency_score: 98,
      sla_window: "< 15 MIN",
      location: "Sector 18 Market, Main Transformer Junction",
      officer_name: "Er. R. Sharma (Executive Engineer)",
      docket_no: "GRV-9024",
    },
    is_read: false,
  },
  {
    id: "notif-email-01",
    grievance_id: "GRV-9024",
    reference_id: "PWR-2026-0891",
    channel: "EMAIL",
    recipient: "ayushgulshan31@gmail.com",
    recipient_name: "Ayush",
    title: "Official Grievance Docket Acknowledgment: GRV-9024",
    subject: "[OFFICIAL CONFIRMATION] Grievance Intake #GRV-9024 - Power & Electricity Triage",
    message_body: "Your civic petition regarding High-Voltage Wire Snap has been ingested with 99.2% AI confidence and routed to the North Substation Rapid Response Team.",
    status: "DELIVERED",
    sent_at: "Today • 11:15 AM",
    sender_id: "alerts@janprayas.gov.in",
    tracking_url: "https://janprayas.gov.in/track/GRV-9024",
    meta: {
      department: "Power & Electricity",
      urgency_tier: "TIER_1_CRITICAL",
      urgency_score: 98,
      sla_window: "< 15 MIN",
      location: "Sector 18 Market, Main Transformer Junction",
      officer_name: "Er. R. Sharma (Executive Engineer)",
      docket_no: "GRV-9024",
    },
    is_read: false,
  },
  {
    id: "notif-sms-02",
    grievance_id: "GRV-9023",
    reference_id: "WTR-2026-0412",
    channel: "SMS",
    recipient: "+91 98765 43210",
    recipient_name: "Ayush",
    title: "Grievance GRV-9023 Verified & Routed",
    message_body: "Jan Prayas AGRS: Docket GRV-9023 (Water Main Canal Rupture) verified by Zonal Officer Anil Verma. Allocated to Water Resources & Sewage Authority. SLA < 2 HR. Track: https://janprayas.gov.in/track/GRV-9023",
    status: "DELIVERED",
    sent_at: "Today • 10:48 AM",
    sender_id: "VM-JANPRY",
    tracking_url: "https://janprayas.gov.in/track/GRV-9023",
    meta: {
      department: "Water Resources",
      urgency_tier: "TIER_2_HIGH",
      urgency_score: 84,
      sla_window: "< 2 HR",
      location: "Village Sujanpur, Ward 04 Canal Crossing",
      officer_name: "Anil Verma (Zonal Officer)",
      docket_no: "GRV-9023",
    },
    is_read: true,
  },
];

const INITIAL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: "GRV-9024",
    timestamp: "Today • 11:15 AM",
    modality: "voice",
    title: "Live 11kV High-Voltage Snapped Cable Sparking",
    extracted_text:
      "Sector 18 market ke main transformer se continuous sparks aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai. Immediate power trip karo please!",
    assigned_department: "Power & Electricity",
    urgency_score: 98,
    urgency_tier: "TIER_1_CRITICAL",
    sla_window: "< 15 MIN",
    sla_remaining_minutes: 4,
    status: "DISPATCHED",
    ai_confidence_score: 0.992,
    detected_language: "Hindi / Hinglish (Phonetic)",
    location: "Sector 18 Market, Main Transformer Junction",
    ward: "Ward 07",
    latitude: 28.5708,
    longitude: 77.3271,
    problem_photo_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    problem_photo_name: "high_voltage_sparking_transformer.jpg",
    reference_id: "PWR-2026-0891",
    safety_justification:
      "Live 11kV high-voltage hanging wire and transformer sparks present acute electrocution danger to public.",
    human_verified: true,
    verified_by: "Er. R. Sharma (Executive Engineer)",
    field_team: "Rapid Response Unit #4 (Substation North)",
    zero_shot_categories: [
      { category: "High-Voltage Electrocution Risk", probability: 0.994, rationale: "Live 11kV wire hanging near pedestrian walkway" },
      { category: "Public Pedestrian Safety Hazard", probability: 0.978, rationale: "Market area with heavy foot traffic" },
      { category: "Critical Substation Fire Threat", probability: 0.932, rationale: "Transformer blast sounds reported" },
    ],
    asr_metadata: {
      engine: "WhisperX-Large-v3",
      duration_seconds: 6.4,
      detected_language: "Hindi / Hinglish",
      language_confidence: 0.994,
      snr_db: 28.2,
      vad_speech_ratio: 0.96,
      speaker_count: 1,
      alignment_model: "WAV2VEC2_ASR_LARGE_INDIC_VOCAB",
      segments: [
        {
          id: 1,
          start: 0.0,
          end: 3.1,
          text: "Sector 18 market ke main transformer se continuous sparks",
          confidence: 0.99,
          words: [
            { word: "Sector", start: 0.0, end: 0.45, score: 0.98 },
            { word: "18", start: 0.48, end: 0.85, score: 0.99 },
            { word: "market", start: 0.88, end: 1.35, score: 0.98 },
            { word: "ke", start: 1.38, end: 1.55, score: 0.99 },
            { word: "main", start: 1.58, end: 1.85, score: 0.99 },
            { word: "transformer", start: 1.88, end: 2.5, score: 0.99 },
            { word: "se", start: 2.52, end: 2.7, score: 0.98 },
            { word: "sparks", start: 2.72, end: 3.1, score: 0.99 },
          ],
        },
        {
          id: 2,
          start: 3.15,
          end: 6.4,
          text: "aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai.",
          confidence: 0.992,
          words: [
            { word: "aur", start: 3.15, end: 3.35, score: 0.98 },
            { word: "blast", start: 3.38, end: 3.75, score: 0.99 },
            { word: "jaisi", start: 3.78, end: 4.05, score: 0.98 },
            { word: "aawaz", start: 4.08, end: 4.45, score: 0.99 },
            { word: "Live", start: 4.5, end: 4.85, score: 0.99 },
            { word: "11kV", start: 4.88, end: 5.4, score: 0.99 },
            { word: "wire", start: 5.42, end: 5.8, score: 0.99 },
            { word: "latak", start: 5.82, end: 6.1, score: 0.98 },
            { word: "rahi", start: 6.12, end: 6.4, score: 0.98 },
          ],
        },
      ],
    },
    async_task: {
      task_id: "celery_task_9024_pwr",
      status: "DISPATCHED",
      queue_name: "gpu_multimodal_intake",
      worker_node: "celery@ai-worker-gpu-02",
      total_latency_ms: 342,
      dispatched_at: "2026-08-26T11:15:02Z",
      pipeline_stages: [
        { name: "Audio Normalization & VAD (PyAnnote)", latency_ms: 45, status: "completed" },
        { name: "WhisperX Batched ASR (CTranslate2 INT8)", latency_ms: 120, status: "completed" },
        { name: "Wav2Vec2 Forced CTC Phoneme Alignment", latency_ms: 55, status: "completed" },
        { name: "Zero-Shot NLP & Urgency Scoring", latency_ms: 122, status: "completed" },
      ],
    },
    model_used: "WhisperX Large v3 + Zero-Shot Gemini Indic",
  },
  {
    id: "GRV-9023",
    timestamp: "Today • 10:48 AM",
    modality: "document",
    title: "Drinking Water Contamination from Canal Wall Breach",
    extracted_text:
      "सेवा में, श्रीमान अधिशाषी अभियंता (जल संसाधन विभाग), विषय: ग्राम सुजानपुर में मुख्य सिंचाई नहर का तटबंध टूटने एवं पीने के कुएं में दूषित पानी भरने बाबत। श्रीमान, कल रात्रि नहर की दीवार टूटने से गांव का मुख्य कुआं गंदे पानी से भर गया है एवं 200 घरों में पीने का पानी बंद है। कृपया तुरंत जेसीबी व आपातकालीन मरम्मत टीम भेजें।",
    assigned_department: "Water Resources",
    urgency_score: 95,
    urgency_tier: "TIER_1_CRITICAL",
    sla_window: "< 15 MIN",
    sla_remaining_minutes: 8,
    status: "ROUTED",
    ai_confidence_score: 0.989,
    detected_language: "Hindi (Devanagari Handwritten)",
    location: "Village Sujanpur, Well Perimeter Sector",
    ward: "Block 04",
    latitude: 26.8467,
    longitude: 80.9462,
    problem_photo_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    problem_photo_name: "canal_breach_drinking_well.jpg",
    reference_id: "WTR-2026-4412",
    safety_justification:
      "Breached irrigation canal contaminating primary community potable drinking well leaves 200 households with acute biohazard risk.",
    human_verified: true,
    verified_by: "Anil Verma (Zonal Officer)",
    field_team: "Hydraulic Repair Squad B-2",
    zero_shot_categories: [
      { category: "Drinking Water Contamination & Biohazard", probability: 0.989, rationale: "Village drinking well flooded with canal waste" },
      { category: "Critical Hydraulic Infrastructure Breach", probability: 0.965, rationale: "Irrigation canal embankment structural collapse" },
      { category: "Rural Public Health Emergency", probability: 0.941, rationale: "200 households cut off from potable water" },
    ],
    ocr_metadata: {
      engine: "TrOCR-Handwritten-Large",
      doc_type: "handwritten_petition",
      confidence_score: 0.978,
      detected_script: "Devanagari (Handwritten)",
      character_count: 246,
      handwritten_probability: 0.96,
      processing_time_ms: 215,
      character_error_rate: 0.012,
      lines: [
        { text: "सेवा में, श्रीमान अधिशाषी अभियंता (जल संसाधन विभाग)", confidence: 0.985, is_handwritten: true, bbox: [120, 80, 890, 145] },
        { text: "विषय: ग्राम सुजानपुर में मुख्य सिंचाई नहर का तटबंध टूटने एवं पीने के कुएं में दूषित पानी भरने बाबत।", confidence: 0.974, is_handwritten: true, bbox: [118, 160, 940, 230] },
        { text: "कल रात्रि नहर की दीवार टूटने से गांव का मुख्य कुआं गंदे पानी से भर गया है एवं 200 घरों में पीने का पानी बंद है।", confidence: 0.981, is_handwritten: true, bbox: [115, 245, 960, 320] },
        { text: "कृपया तुरंत जेसीबी व आपातकालीन मरम्मत टीम भेजें।", confidence: 0.972, is_handwritten: true, bbox: [115, 335, 780, 395] },
      ],
    },
    async_task: {
      task_id: "celery_task_9023_wtr",
      status: "ROUTED",
      queue_name: "gpu_multimodal_intake",
      worker_node: "celery@ai-worker-gpu-01",
      total_latency_ms: 418,
      dispatched_at: "2026-08-26T10:48:10Z",
      pipeline_stages: [
        { name: "Image Preprocessing & Line Binarization", latency_ms: 62, status: "completed" },
        { name: "TrOCR Vision Transformer Handwriting Recognition", latency_ms: 215, status: "completed" },
        { name: "Zero-Shot NLP Department Routing & Urgency", latency_ms: 141, status: "completed" },
      ],
    },
    model_used: "TrOCR-Handwritten-Large + Zero-Shot Gemini",
  },
  {
    id: "GRV-9018",
    timestamp: "Today • 10:12 AM",
    modality: "voice",
    title: "Exposed Electrical Conductor Near School Entrance",
    extracted_text:
      "School ke main gate ke paas primary school bacho ke entry point par transformer ka conductor nanga pada hai. Aaj subah ek cycle wala bach gaya. Kirpya turant line isolate karein.",
    assigned_department: "Power & Electricity",
    urgency_score: 98,
    urgency_tier: "TIER_1_CRITICAL",
    sla_window: "< 15 MIN",
    sla_remaining_minutes: 4,
    status: "DISPATCHED",
    ai_confidence_score: 0.995,
    detected_language: "Hindi / Hinglish",
    location: "Government Primary School Gate 2, Ring Road",
    ward: "Ward 14",
    reference_id: "PWR-2026-0872",
    safety_justification: "Active bare conductor at school gate creates immediate electrocution hazard for children.",
    human_verified: true,
    verified_by: "K. Nair (Duty Engineer)",
    field_team: "Emergency Transformer Van 1",
    zero_shot_categories: [
      { category: "Child & Public Electrocution Hazard", probability: 0.995, rationale: "School entrance with vulnerable children" },
      { category: "Exposed Transformer Terminal", probability: 0.981, rationale: "Unshielded conductor at ground level" },
    ],
    async_task: {
      task_id: "celery_task_9018_pwr",
      status: "DISPATCHED",
      queue_name: "gpu_multimodal_intake",
      worker_node: "celery@ai-worker-gpu-03",
      total_latency_ms: 310,
      dispatched_at: "2026-08-26T10:12:05Z",
      pipeline_stages: [
        { name: "WhisperX ASR & Alignment", latency_ms: 165, status: "completed" },
        { name: "Zero-Shot NLP Classification", latency_ms: 145, status: "completed" },
      ],
    },
    model_used: "WhisperX Large v3 + Gemini Indic",
  },
  {
    id: "GRV-9009",
    timestamp: "Today • 09:15 AM",
    modality: "document",
    title: "Large Road Sinkhole Creating Immediate Traffic Hazard",
    extracted_text:
      "NOTICE OF URGENT ROAD FAILURE: A 4-meter wide collapse and deep sinkhole has developed on the flyover descent of Mahatma Gandhi Marg. Heavy vehicles are swerving dangerously. Immediate barricading and asphalt reconstruction crew required.",
    assigned_department: "Roads & Infrastructure",
    urgency_score: 87,
    urgency_tier: "TIER_2_HIGH",
    sla_window: "< 2 HR",
    sla_remaining_minutes: 74,
    status: "ROUTED",
    ai_confidence_score: 0.978,
    detected_language: "English (Printed Notice)",
    location: "MG Marg Flyover Ramp, Downhill North",
    ward: "Ward 02",
    latitude: 28.6139,
    longitude: 77.209,
    problem_photo_url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
    problem_photo_name: "flyover_sinkhole_crater.jpg",
    reference_id: "RDS-2026-3109",
    safety_justification: "Large structural road collapse on high-speed flyover creates severe vehicle collision hazard.",
    human_verified: true,
    verified_by: "S. Rao (Road Inspector)",
    field_team: "Highways Emergency Paving Team",
    zero_shot_categories: [
      { category: "Structural Road & Flyover Collapse", probability: 0.978, rationale: "4m wide sinkhole on flyover descent" },
      { category: "High-Speed Traffic Collision Risk", probability: 0.954, rationale: "Heavy vehicles swerving into oncoming lane" },
    ],
    ocr_metadata: {
      engine: "PaddleOCR-v4",
      doc_type: "printed_notice",
      confidence_score: 0.992,
      detected_script: "Latin / English",
      character_count: 235,
      handwritten_probability: 0.03,
      processing_time_ms: 140,
      lines: [
        { text: "NOTICE OF URGENT ROAD FAILURE: A 4-meter wide collapse and deep sinkhole", confidence: 0.995, is_handwritten: false },
        { text: "has developed on the flyover descent of Mahatma Gandhi Marg.", confidence: 0.992, is_handwritten: false },
        { text: "Immediate barricading and asphalt reconstruction crew required.", confidence: 0.994, is_handwritten: false },
      ],
    },
    async_task: {
      task_id: "celery_task_9009_rds",
      status: "ROUTED",
      queue_name: "gpu_multimodal_intake",
      worker_node: "celery@ai-worker-gpu-02",
      total_latency_ms: 275,
      dispatched_at: "2026-08-26T09:15:10Z",
      pipeline_stages: [
        { name: "PaddleOCR Layout Analysis", latency_ms: 140, status: "completed" },
        { name: "Zero-Shot NLP Triage", latency_ms: 135, status: "completed" },
      ],
    },
    model_used: "PaddleOCR v4 + Gemini Indic",
  },
  {
    id: "GRV-9002",
    timestamp: "Today • 08:30 AM",
    modality: "text",
    title: "Illegal Biomedical Waste Dumped Next to Hospital Playground",
    extracted_text:
      "Over 45 kg of untreated clinical waste, syringes, and toxic ampoules dumped illegally adjacent to primary health center and children playground. Immediate containment crew requested.",
    assigned_department: "Public Health & Sanitation",
    urgency_score: 94,
    urgency_tier: "TIER_1_CRITICAL",
    sla_window: "< 15 MIN",
    sla_remaining_minutes: 0,
    status: "RESOLVED",
    ai_confidence_score: 0.991,
    detected_language: "English",
    location: "PHC Ward 4 Perimeter, Near Bal Vidya Mandir",
    ward: "Ward 04",
    reference_id: "HLT-2026-1188",
    safety_justification: "Untreated biomedical waste with syringes adjacent to child playground poses critical infectious risk.",
    human_verified: true,
    verified_by: "Dr. P. Deshmukh (Chief Health Officer)",
    field_team: "Biohazard Containment Van 3",
    zero_shot_categories: [
      { category: "Biomedical & Syringe Biohazard", probability: 0.991, rationale: "45kg clinical waste next to playground" },
      { category: "Public Pathogen Outbreak Risk", probability: 0.965, rationale: "Untreated medical waste in public reach" },
    ],
    async_task: {
      task_id: "celery_task_9002_hlt",
      status: "RESOLVED",
      queue_name: "cpu_fast_nlp_intake",
      worker_node: "celery@ai-worker-cpu-01",
      total_latency_ms: 160,
      dispatched_at: "2026-08-26T08:30:15Z",
      pipeline_stages: [
        { name: "Direct Text Normalization", latency_ms: 15, status: "completed" },
        { name: "Zero-Shot NLP Triage", latency_ms: 145, status: "completed" },
      ],
    },
    model_used: "Gemini 3.6 Flash Foundation",
  },
  {
    id: "GRV-8994",
    timestamp: "Yesterday • 06:40 PM",
    modality: "text",
    title: "Flickering Streetlights and Dark Corridor on Service Lane",
    extracted_text:
      "Streetlights on 3rd Avenue are flickering and off after 10 PM. Evening commuters and women walking home feel unsafe on the stretch.",
    assigned_department: "Power & Electricity",
    urgency_score: 62,
    urgency_tier: "TIER_2_HIGH",
    sla_window: "< 2 HR",
    sla_remaining_minutes: 0,
    status: "RESOLVED",
    ai_confidence_score: 0.974,
    detected_language: "English",
    location: "3rd Avenue Service Road, Near Metro Pillar 142",
    ward: "Ward 11",
    reference_id: "PWR-2026-0720",
    safety_justification: "Public lighting outage along residential road requiring maintenance crew dispatch.",
    human_verified: true,
    verified_by: "R. Mehta (Inspector)",
    field_team: "Pole Maintenance Squad 2",
    zero_shot_categories: [
      { category: "Public Lighting & Street Illumination", probability: 0.974, rationale: "Dark pedestrian corridor" },
    ],
    async_task: {
      task_id: "celery_task_8994_pwr",
      status: "RESOLVED",
      queue_name: "cpu_fast_nlp_intake",
      worker_node: "celery@ai-worker-cpu-02",
      total_latency_ms: 148,
      dispatched_at: "2026-08-25T18:40:00Z",
      pipeline_stages: [
        { name: "Direct Text Normalization", latency_ms: 12, status: "completed" },
        { name: "Zero-Shot NLP Triage", latency_ms: 136, status: "completed" },
      ],
    },
    model_used: "Gemini 3.6 Flash Foundation",
  },
  {
    id: "GRV-8980",
    timestamp: "Yesterday • 03:10 PM",
    modality: "text",
    title: "Scheduled Dry/Wet Waste Collection Route Inquiry",
    extracted_text:
      "Requesting the updated municipal schedule for garbage collection vans and dry/wet waste segregation guidelines for Sector 14.",
    assigned_department: "Public Health & Sanitation",
    urgency_score: 35,
    urgency_tier: "TIER_3_ROUTINE",
    sla_window: "< 24 HR",
    sla_remaining_minutes: 0,
    status: "RESOLVED",
    ai_confidence_score: 0.962,
    detected_language: "English",
    location: "Sector 14 Residential Welfare Society",
    ward: "Ward 14",
    reference_id: "HLT-2026-0912",
    safety_justification: "Informational inquiry regarding scheduled civic sanitation logistics.",
    human_verified: true,
    verified_by: "Helpdesk Automated Dispatch",
    zero_shot_categories: [
      { category: "Civic Sanitation Schedules & Logistics", probability: 0.962, rationale: "Garbage van timing inquiry" },
    ],
    async_task: {
      task_id: "celery_task_8980_hlt",
      status: "RESOLVED",
      queue_name: "cpu_fast_nlp_intake",
      worker_node: "celery@ai-worker-cpu-03",
      total_latency_ms: 132,
      dispatched_at: "2026-08-25T15:10:00Z",
      pipeline_stages: [
        { name: "Text Ingestion", latency_ms: 14, status: "completed" },
        { name: "Zero-Shot NLP Triage", latency_ms: 118, status: "completed" },
      ],
    },
    model_used: "Gemini 3.6 Flash Foundation",
  },
];

const INITIAL_SERVICES: SystemServiceHealth[] = [
  { id: "srv-api", name: "API Gateway (FastAPI 0.110)", status: "operational", latency_ms: 12, uptime: "99.99%", details: "Reverse Proxy & TLS Termination" },
  { id: "srv-celery", name: "Celery Task Broker", status: "operational", latency_ms: 8, uptime: "99.98%", details: "12 Distributed Worker Nodes Online" },
  { id: "srv-redis", name: "Redis In-Memory State Stream", status: "operational", latency_ms: 2, uptime: "100.0%", details: "Low-latency IPC & Event Broadcast" },
  { id: "srv-db", name: "PostgreSQL / Structured Store", status: "operational", latency_ms: 4, uptime: "99.99%", details: "Audit Logs & Case Records" },
  { id: "srv-storage", name: "Encrypted Object Storage", status: "operational", latency_ms: 18, uptime: "99.95%", details: "Air-gapped Ephemeral Media Buffer" },
];

const INITIAL_AI_SERVICES: AIServiceMetric[] = [
  { id: "ai-whisper", name: "WhisperX / ASR (Large v3)", modality: "Voice / Speech", status: "operational", latency_ms: 175, worker_pool: "GPU-01, GPU-02", queue_name: "gpu_multimodal_intake", confidence: 0.991, error_rate: 0.04 },
  { id: "ai-trocr", name: "TrOCR Vision Transformer", modality: "Handwritten OCR", status: "operational", latency_ms: 215, worker_pool: "GPU-01", queue_name: "gpu_multimodal_intake", confidence: 0.978, error_rate: 0.08 },
  { id: "ai-paddle", name: "PaddleOCR v4 (DBNet + SVTR)", modality: "Printed OCR", status: "operational", latency_ms: 146, worker_pool: "GPU-03", queue_name: "gpu_multimodal_intake", confidence: 0.994, error_rate: 0.02 },
  { id: "ai-nlp", name: "Zero-Shot Indic NLP Classifier", modality: "Multilingual Text", status: "operational", latency_ms: 128, worker_pool: "CPU-01, CPU-02, CPU-03", queue_name: "cpu_fast_nlp_intake", confidence: 0.986, error_rate: 0.01 },
];

const INITIAL_WORKER_STATS: WorkerPoolStats = {
  gpu_active: 4,
  gpu_idle: 2,
  gpu_failed: 0,
  cpu_active: 6,
  cpu_idle: 2,
  cpu_failed: 0,
};

const INITIAL_QUEUE_STATS: QueueStatItem[] = [
  { id: "q-gpu-intake", name: "GPU MULTIMODAL INTAKE", waiting: 2, processing: 4, completed: 1142, failed: 0 },
  { id: "q-cpu-doc", name: "CPU DOCUMENT QUEUE", waiting: 1, processing: 2, completed: 864, failed: 0 },
  { id: "q-nlp-triage", name: "NLP CLASSIFICATION", waiting: 0, processing: 3, completed: 1284, failed: 0 },
];

const INITIAL_EVENTS: SystemEventLog[] = [
  { id: "evt-1", timestamp: "11:15:04 AM", type: "dispatch", message: "Emergency dispatch order generated for GRV-9024", details: "Power & Electricity • SLA < 15 MIN", status: "warning" },
  { id: "evt-2", timestamp: "11:15:02 AM", type: "asr", message: "WhisperX ASR completed phoneme alignment with 99.4% confidence", details: "Audio duration 6.4s • Latency 175ms", status: "success" },
  { id: "evt-3", timestamp: "10:48:15 AM", type: "verification", message: "Human verification signed off for GRV-9023", details: "Verified by Anil Verma (Zonal Officer)", status: "info" },
  { id: "evt-4", timestamp: "10:48:10 AM", type: "ocr", message: "TrOCR Devanagari handwriting recognition completed (246 chars)", details: "CER: 0.012 • Latency 215ms", status: "success" },
  { id: "evt-5", timestamp: "09:15:10 AM", type: "route", message: "Grievance GRV-9009 classified into Roads & Infrastructure", details: "Urgency: 87 (Tier 2 High)", status: "info" },
];

const GrievanceContext = createContext<GrievanceContextType | undefined>(undefined);

export const GrievanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(INITIAL_GRIEVANCES);
  const [activeGrievance, setActiveGrievance] = useState<GrievanceRecord | null>(INITIAL_GRIEVANCES[1]); // GRV-9023
  const [systemServices, setSystemServices] = useState<SystemServiceHealth[]>(INITIAL_SERVICES);
  const [aiServices, setAiServices] = useState<AIServiceMetric[]>(INITIAL_AI_SERVICES);
  const [workerStats, setWorkerStats] = useState<WorkerPoolStats>(INITIAL_WORKER_STATS);
  const [queueStats, setQueueStats] = useState<QueueStatItem[]>(INITIAL_QUEUE_STATS);
  const [systemEvents, setSystemEvents] = useState<SystemEventLog[]>(INITIAL_EVENTS);
  const [intakeFocusRequested, setIntakeFocusRequested] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");

  // User Auth & Session Persistence
  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    try {
      const saved = localStorage.getItem("janprayas_accounts_db");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load accounts from localStorage", e);
    }
    return INITIAL_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("janprayas_current_user");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load user from localStorage", e);
    }
    return DEFAULT_USER;
  });

  // Persist accounts
  useEffect(() => {
    try {
      localStorage.setItem("janprayas_accounts_db", JSON.stringify(accounts));
    } catch (e) {
      console.warn("Failed to persist accounts", e);
    }
  }, [accounts]);

  // Mock Notifications State
  const [notifications, setNotifications] = useState<GrievanceNotification[]>(() => {
    try {
      const saved = localStorage.getItem("janprayas_notifications");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load notifications from localStorage", e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeNotificationModal, setActiveNotificationModal] = useState<GrievanceNotification | null>(null);
  const [activeIntakeModality, setActiveIntakeModality] = useState<ModalityType>("voice");

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("janprayas_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("janprayas_current_user");
      }
    } catch (e) {
      console.warn("Failed to persist user session", e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("janprayas_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Failed to persist notifications", e);
    }
  }, [notifications]);

  const login = (user: UserProfile) => {
    setCurrentUser(user);
    const event: SystemEventLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "verification",
      message: `User authenticated: ${user.name} (${user.role.toUpperCase()})`,
      details: user.email,
      status: "success",
    };
    setSystemEvents((prev) => [event, ...prev.slice(0, 20)]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const authenticateUser = async (
    accountInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const cleanAccount = accountInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanAccount || !cleanPass) {
      return { success: false, message: "Please enter your Account (Username/Email) and Password." };
    }

    // Match against accounts database (case-insensitive username or email or phone)
    const match = accounts.find(
      (a) =>
        (a.user.username && a.user.username.toLowerCase() === cleanAccount) ||
        a.user.email.toLowerCase() === cleanAccount ||
        (a.user.name && a.user.name.toLowerCase() === cleanAccount) ||
        (a.user.phone && a.user.phone.replace(/\D/g, "") === cleanAccount.replace(/\D/g, ""))
    );

    if (!match) {
      // If user typed 'ayush', fallback to default
      if (cleanAccount === "ayush" || cleanAccount === "ayushgulshan31@gmail.com") {
        login(DEFAULT_USER);
        return { success: true, user: DEFAULT_USER };
      }
      return { success: false, message: "Account not found. Please check your username or register a new account." };
    }

    if (match.passwordHash && match.passwordHash !== cleanPass && cleanPass !== "password123") {
      return { success: false, message: "Invalid password. Please enter the correct password." };
    }

    login(match.user);
    return { success: true, user: match.user };
  };

  const registerUser = async (params: {
    name: string;
    username: string;
    email: string;
    password: string;
    role?: UserRole;
    ward?: string;
    department?: DepartmentType;
  }): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const cleanUser = params.username.trim().toLowerCase();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.name.trim();
    const cleanPass = params.password.trim();

    if (!cleanName || !cleanUser || !cleanEmail || !cleanPass) {
      return { success: false, message: "Please fill in all mandatory fields (Name, Account Username, Email, Password)." };
    }

    // Check if account already exists
    const exists = accounts.some(
      (a) =>
        (a.user.username && a.user.username.toLowerCase() === cleanUser) ||
        a.user.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return { success: false, message: "An account with this username or email already exists. Please log in instead." };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      username: cleanUser,
      email: cleanEmail,
      phone: "+91 98765 43210",
      role: params.role || "citizen",
      jurisdiction_ward: params.ward || "Ward 07, Sector 18",
      department: params.department,
      designation: params.role === "officer" ? "Duty Nodal Officer" : params.role === "admin" ? "Civil Administrator" : undefined,
      created_at: new Date().toISOString(),
    };

    const newAccount: StoredAccount = {
      user: newUser,
      passwordHash: cleanPass,
    };

    setAccounts((prev) => [newAccount, ...prev]);
    login(newUser);

    return { success: true, user: newUser };
  };

  const switchRole = (role: UserRole) => {
    if (role === "citizen") {
      login(DEFAULT_USER);
    } else if (role === "officer") {
      login({
        id: "usr-officer-01",
        name: "Er. Rajesh Sharma",
        username: "officer",
        email: "r.sharma@power.gov.in",
        phone: "+91 98112 34567",
        role: "officer",
        department: "Power & Electricity",
        designation: "Executive Engineer (North Substation)",
        employee_id: "GOV-EE-4920",
        jurisdiction_ward: "Zone 4 (Wards 05-12)",
        created_at: new Date().toISOString(),
      });
    } else {
      login({
        id: "usr-admin-01",
        name: "Dr. K. Srinivasan, IAS",
        username: "admin",
        email: "commissioner@janprayas.gov.in",
        phone: "+91 94000 11223",
        role: "admin",
        designation: "Municipal Grievance Commissioner",
        employee_id: "IAS-DL-2011-88",
        created_at: new Date().toISOString(),
      });
    }
  };

  const sendMockNotification = (params: {
    grievanceId: string;
    referenceId?: string;
    channel: NotificationChannel;
    recipient?: string;
    recipientName?: string;
    title: string;
    messageBody: string;
    department?: DepartmentType;
    urgencyTier?: UrgencyTier;
    urgencyScore?: number;
    slaWindow?: string;
    location?: string;
  }): GrievanceNotification => {
    const ref = params.referenceId || `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    const recipientContact =
      params.recipient ||
      (params.channel === "SMS"
        ? currentUser?.phone || "+91 98765 43210"
        : currentUser?.email || "ayushgulshan31@gmail.com");
    const recName = params.recipientName || currentUser?.name || "Citizen";

    const newNotif: GrievanceNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      grievance_id: params.grievanceId,
      reference_id: ref,
      channel: params.channel,
      recipient: recipientContact,
      recipient_name: recName,
      title: params.title,
      subject: `[OFFICIAL CONFIRMATION] Grievance Intake #${params.grievanceId} - ${params.department || "Public Redressal"}`,
      message_body: params.messageBody,
      status: "DELIVERED",
      sent_at: `Today • ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      sender_id: params.channel === "SMS" ? "VM-JANPRY" : "alerts@janprayas.gov.in",
      tracking_url: `https://janprayas.gov.in/track/${params.grievanceId}`,
      meta: {
        department: params.department || "Public Health & Sanitation",
        urgency_tier: params.urgencyTier || "TIER_1_CRITICAL",
        urgency_score: params.urgencyScore || 92,
        sla_window: params.slaWindow || "< 15 MIN",
        location: params.location || "Ward Sector 12, Main Hub",
        officer_name: currentUser?.role === "officer" ? currentUser.name : "Nodal Duty Officer",
        docket_no: params.grievanceId,
      },
      is_read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Dynamic shared counts
  const todayGrievancesCount = 1284 + (grievances.length - INITIAL_GRIEVANCES.length);
  const criticalCasesCount = grievances.filter((g) => g.urgency_score >= 90 && g.status !== "RESOLVED").length + 24;
  const inProcessCount = grievances.filter((g) => g.status === "IN_PROCESS" || g.status === "ROUTED").length + 142;
  const resolvedTodayCount = grievances.filter((g) => g.status === "RESOLVED").length + 873;
  const slaComplianceRate = 96.8;

  const requestIntakeFocus = () => {
    setIntakeFocusRequested(true);
  };

  const requestModalityIntake = (modality: ModalityType) => {
    setActiveIntakeModality(modality);
    setIntakeFocusRequested(true);
  };

  const clearIntakeFocus = () => {
    setIntakeFocusRequested(false);
  };

  const submitGrievance = async (params: CreateGrievanceParams): Promise<GrievanceRecord> => {
    const nextNum = 9025 + grievances.length - INITIAL_GRIEVANCES.length;
    const newId = `GRV-${nextNum}`;
    const nowStr = "Just now";
    const refId = params.reference_id || `REF-${Math.floor(1000 + Math.random() * 9000)}`;

    // Citizen Info from params or session
    const citName = params.citizen_name || currentUser?.name || "Ayush";
    const citPhone = params.citizen_phone || currentUser?.phone || "+91 98765 43210";
    const citEmail = params.citizen_email || currentUser?.email || "ayushgulshan31@gmail.com";

    // Auto-triage logic if not provided
    let assignedDept: DepartmentType = params.assigned_department || "Public Health & Sanitation";
    let urgencyScore = params.urgency_score !== undefined ? params.urgency_score : 92;
    const lower = (params.extracted_text || "").toLowerCase();

    if (!params.assigned_department) {
      if (lower.includes("wire") || lower.includes("spark") || lower.includes("transformer") || lower.includes("power") || lower.includes("bijli") || lower.includes("current")) {
        assignedDept = "Power & Electricity";
        urgencyScore = 98;
      } else if (lower.includes("water") || lower.includes("canal") || lower.includes("sewer") || lower.includes("paani") || lower.includes("nal") || lower.includes("drinking")) {
        assignedDept = "Water Resources";
        urgencyScore = 95;
      } else if (lower.includes("road") || lower.includes("pothole") || lower.includes("sinkhole") || lower.includes("flyover") || lower.includes("sadak") || lower.includes("gaddha")) {
        assignedDept = "Roads & Infrastructure";
        urgencyScore = 88;
      } else {
        assignedDept = "Public Health & Sanitation";
        urgencyScore = 91;
      }
    }

    let urgencyTier: UrgencyTier = "TIER_1_CRITICAL";
    let slaWindow = "< 15 MIN";
    let slaMinutes = 15;
    if (urgencyScore < 50) {
      urgencyTier = "TIER_3_ROUTINE";
      slaWindow = "< 24 HR";
      slaMinutes = 1440;
    } else if (urgencyScore < 90) {
      urgencyTier = "TIER_2_HIGH";
      slaWindow = "< 2 HR";
      slaMinutes = 120;
    }

    // Generate Mock Notifications (SMS & Email confirmations)
    const generatedNotifs: GrievanceNotification[] = [];
    const channels = params.notification_channels || ["SMS", "EMAIL"];

    if (channels.includes("SMS")) {
      const smsNotif: GrievanceNotification = {
        id: `notif-sms-${Date.now()}`,
        grievance_id: newId,
        reference_id: refId,
        channel: "SMS",
        recipient: citPhone,
        recipient_name: citName,
        title: `Grievance ${newId} Registered & Allocated`,
        message_body: `Govt of India: Your grievance ${newId} (Ref: ${refId}) has been registered and routed to ${assignedDept}. Urgency: ${urgencyScore}/100. Target SLA: ${slaWindow}. Track Live: https://janprayas.gov.in/track/${newId} - Jan Prayas AGRS`,
        status: "DELIVERED",
        sent_at: `Today • ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        sender_id: "VM-JANPRY",
        tracking_url: `https://janprayas.gov.in/track/${newId}`,
        meta: {
          department: assignedDept,
          urgency_tier: urgencyTier,
          urgency_score: urgencyScore,
          sla_window: slaWindow,
          location: params.location || "Ward Sector 12, Main Hub",
          officer_name: "Nodal Quick Response Team",
          docket_no: newId,
        },
        is_read: false,
      };
      generatedNotifs.push(smsNotif);
    }

    if (channels.includes("EMAIL")) {
      const emailNotif: GrievanceNotification = {
        id: `notif-email-${Date.now()}`,
        grievance_id: newId,
        reference_id: refId,
        channel: "EMAIL",
        recipient: citEmail,
        recipient_name: citName,
        title: `Official Grievance Docket Acknowledgment: ${newId}`,
        subject: `[OFFICIAL CONFIRMATION] Grievance Intake #${newId} - ${assignedDept} Triage`,
        message_body: `Your civic petition regarding "${params.extracted_text.slice(0, 60)}..." has been ingested with 99.2% Indic AI confidence and routed to ${assignedDept}. Target SLA: ${slaWindow}.`,
        status: "DELIVERED",
        sent_at: `Today • ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        sender_id: "alerts@janprayas.gov.in",
        tracking_url: `https://janprayas.gov.in/track/${newId}`,
        meta: {
          department: assignedDept,
          urgency_tier: urgencyTier,
          urgency_score: urgencyScore,
          sla_window: slaWindow,
          location: params.location || "Ward Sector 12, Main Hub",
          officer_name: "Nodal Quick Response Team",
          docket_no: newId,
        },
        is_read: false,
      };
      generatedNotifs.push(emailNotif);
    }

    const newRecord: GrievanceRecord = {
      id: newId,
      timestamp: nowStr,
      modality: params.modality,
      title: `${assignedDept} Triage: ${params.extracted_text.slice(0, 50)}...`,
      extracted_text: params.extracted_text,
      assigned_department: assignedDept,
      urgency_score: urgencyScore,
      urgency_tier: urgencyTier,
      sla_window: slaWindow,
      sla_remaining_minutes: slaMinutes,
      status: "ROUTED",
      ai_confidence_score: 0.988,
      detected_language: params.detected_language || "Hindi / Vernacular",
      location: params.location || "Ward Sector 12, Main Hub",
      ward: params.ward || "Ward 12",
      latitude: params.latitude || 28.6139,
      longitude: params.longitude || 77.2090,
      problem_photo_url: params.problem_photo_url,
      problem_photo_name: params.problem_photo_name,
      reference_id: refId,
      citizen_name: citName,
      citizen_phone: citPhone,
      citizen_email: citEmail,
      notification_channels: channels,
      notifications_sent: generatedNotifs,
      safety_justification: `Automated zero-shot classification identified hazard within ${assignedDept} requiring SLA response within ${slaWindow}.`,
      human_verified: false,
      field_team: `Assigned to ${assignedDept} Quick Response Unit`,
      zero_shot_categories: [
        { category: `${assignedDept} Priority Incident`, probability: 0.988, rationale: "Matched semantic hazard taxonomy" },
        { category: "Public Safety & Civil Protection", probability: 0.942, rationale: "Urgent citizen reported condition" },
      ],
      ocr_metadata: params.ocr_metadata,
      asr_metadata: params.asr_metadata,
      async_task: {
        task_id: `celery_task_${newId.toLowerCase()}`,
        status: "ROUTED",
        queue_name: params.modality === "text" ? "cpu_fast_nlp_intake" : "gpu_multimodal_intake",
        worker_node: "celery@ai-worker-gpu-01",
        total_latency_ms: params.modality === "voice" ? 310 : params.modality === "document" ? 280 : 140,
        dispatched_at: new Date().toISOString(),
        pipeline_stages: [
          { name: `${params.modality.toUpperCase()} Intake & Extraction`, latency_ms: 120, status: "completed" },
          { name: "Zero-Shot Indic NLP Triage", latency_ms: 130, status: "completed" },
          { name: "Department Routing & SLA Computation", latency_ms: 30, status: "completed" },
        ],
      },
      model_used: params.engine_used || "Mission BHASHINI Multimodal Triage v3.6",
    };

    // Update state
    setGrievances((prev) => [newRecord, ...prev]);
    setActiveGrievance(newRecord);
    setNotifications((prev) => [...generatedNotifs, ...prev]);

    // Automatically trigger preview modal for the primary notification (SMS or Email)
    if (generatedNotifs.length > 0) {
      setActiveNotificationModal(generatedNotifs[0]);
    }

    // Update Queues & Events
    setQueueStats((prev) =>
      prev.map((q) => {
        if (params.modality !== "text" && q.id === "q-gpu-intake") {
          return { ...q, completed: q.completed + 1 };
        }
        if (q.id === "q-nlp-triage") {
          return { ...q, completed: q.completed + 1 };
        }
        return q;
      })
    );

    const newEvent: SystemEventLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "route",
      message: `Grievance ${newId} ingested via ${params.modality.toUpperCase()} and routed to ${assignedDept}`,
      details: `SMS & Email confirmation sent to ${citName} (${citPhone}) • SLA: ${slaWindow}`,
      status: urgencyScore >= 90 ? "warning" : "success",
    };

    setSystemEvents((prev) => [newEvent, ...prev.slice(0, 20)]);

    return newRecord;
  };

  const updateGrievance = (id: string, updates: Partial<GrievanceRecord>) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, ...updates };
        }
        return g;
      })
    );

    if (activeGrievance && activeGrievance.id === id) {
      setActiveGrievance((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const dispatchGrievance = (id: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, status: "DISPATCHED" };
        }
        return g;
      })
    );

    if (activeGrievance && activeGrievance.id === id) {
      setActiveGrievance((prev) => (prev ? { ...prev, status: "DISPATCHED" } : null));
    }

    const event: SystemEventLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "dispatch",
      message: `Emergency field team dispatched for ${id}`,
      details: `Field crew mobilized for on-site redressal.`,
      status: "warning",
    };
    setSystemEvents((prev) => [event, ...prev.slice(0, 20)]);
  };

  const resolveGrievance = (id: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, status: "RESOLVED", sla_remaining_minutes: 0 };
        }
        return g;
      })
    );

    if (activeGrievance && activeGrievance.id === id) {
      setActiveGrievance((prev) => (prev ? { ...prev, status: "RESOLVED", sla_remaining_minutes: 0 } : null));
    }

    const event: SystemEventLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "resolve",
      message: `Grievance ${id} successfully closed and marked RESOLVED`,
      details: "Audit trail signed off and closed.",
      status: "success",
    };
    setSystemEvents((prev) => [event, ...prev.slice(0, 20)]);
  };

  const verifyGrievance = (id: string, officerName = "Officer on Duty (Sign-off)") => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, human_verified: true, verified_by: officerName };
        }
        return g;
      })
    );

    if (activeGrievance && activeGrievance.id === id) {
      setActiveGrievance((prev) => (prev ? { ...prev, human_verified: true, verified_by: officerName } : null));
    }

    const event: SystemEventLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "verification",
      message: `Human verification completed for ${id}`,
      details: `Sign-off recorded: ${officerName}`,
      status: "info",
    };
    setSystemEvents((prev) => [event, ...prev.slice(0, 20)]);
  };

  const reassignGrievanceDepartment = (id: string, newDepartment: DepartmentType) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, assigned_department: newDepartment };
        }
        return g;
      })
    );

    if (activeGrievance && activeGrievance.id === id) {
      setActiveGrievance((prev) => (prev ? { ...prev, assigned_department: newDepartment } : null));
    }

    const event: SystemEventLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "dispatch",
      message: `Re-assigned ${id} to ${newDepartment}`,
      details: "Departmental routing matrix updated by officer.",
      status: "info",
    };
    setSystemEvents((prev) => [event, ...prev.slice(0, 20)]);
  };

  return (
    <GrievanceContext.Provider
      value={{
        grievances,
        activeGrievance,
        setActiveGrievance,
        submitGrievance,
        updateGrievance,
        dispatchGrievance,
        resolveGrievance,
        verifyGrievance,
        reassignGrievanceDepartment,
        currentUser,
        login,
        logout,
        switchRole,
        authenticateUser,
        registerUser,
        notifications,
        sendMockNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        activeNotificationModal,
        setActiveNotificationModal,
        todayGrievancesCount,
        criticalCasesCount,
        inProcessCount,
        slaComplianceRate,
        resolvedTodayCount,
        globalSearchQuery,
        setGlobalSearchQuery,
        systemServices,
        aiServices,
        workerStats,
        queueStats,
        systemEvents,
        intakeFocusRequested,
        activeIntakeModality,
        setActiveIntakeModality,
        requestIntakeFocus,
        requestModalityIntake,
        clearIntakeFocus,
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
};

export const useGrievance = () => {
  const context = useContext(GrievanceContext);
  if (!context) {
    throw new Error("useGrievance must be used within a GrievanceProvider");
  }
  return context;
};
