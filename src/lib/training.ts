import { cacheLife } from "next/cache";

export type TrainingStats = {
  /** ISO date (YYYY-MM-DD) the numbers were taken, Thai time */
  asOf: string;
  courses: number;
  openCourses: number;
  trainees: number;
  employeeTrainees: number;
  publicTrainees: number;
  certificates: number;
  trainingHours: number;
};

export type CourseCategory = {
  name: string;
  courseCount: number;
  trainees: number;
};

export type Registration =
  | { status: "OPEN"; closeAt: string }
  | { status: "UPCOMING"; openAt: string }
  | { status: "CLOSED" };

export type Course = {
  code: string;
  title: string;
  category: string;
  durationMinutes: number;
  trainees: number;
  audience: "ALL" | "EMPLOYEE_ONLY";
  registration: Registration;
};

export type TrainingOverview = {
  stats: TrainingStats;
  categories: CourseCategory[];
  popularCourses: Course[];
};

export async function getTrainingOverview(): Promise<TrainingOverview> {
  "use cache";
  cacheLife("days");

  // TODO: fake data — replace with Supabase queries
  return {
    stats: {
      asOf: "2026-09-30",
      courses: 48,
      openCourses: 12,
      trainees: 12500,
      employeeTrainees: 9840,
      publicTrainees: 2660,
      certificates: 9215,
      trainingHours: 41280,
    },
    categories: [
      { name: "ความปลอดภัยในการทำงาน", courseCount: 10, trainees: 3820 },
      { name: "ระบบไฟฟ้าและวิศวกรรม", courseCount: 12, trainees: 3150 },
      { name: "ดิจิทัลและเทคโนโลยี", courseCount: 9, trainees: 2240 },
      { name: "บริการลูกค้า", courseCount: 6, trainees: 1460 },
      { name: "การบริหารและภาวะผู้นำ", courseCount: 7, trainees: 1080 },
      { name: "พลังงานทดแทน", courseCount: 4, trainees: 750 },
    ],
    popularCourses: [
      {
        code: "SAF-101",
        title: "ความปลอดภัยในการปฏิบัติงานไฟฟ้าแรงสูง",
        category: "ความปลอดภัยในการทำงาน",
        durationMinutes: 205,
        trainees: 1240,
        audience: "EMPLOYEE_ONLY",
        registration: { status: "OPEN", closeAt: "2026-11-15" },
      },
      {
        code: "DIG-101",
        title: "การใช้งาน Smart Meter และระบบ AMI",
        category: "ดิจิทัลและเทคโนโลยี",
        durationMinutes: 120,
        trainees: 1105,
        audience: "ALL",
        registration: { status: "OPEN", closeAt: "2026-12-15" },
      },
      {
        code: "SAF-102",
        title: "การปฐมพยาบาลและช่วยชีวิตผู้ประสบอันตรายจากไฟฟ้า",
        category: "ความปลอดภัยในการทำงาน",
        durationMinutes: 150,
        trainees: 980,
        audience: "ALL",
        registration: { status: "OPEN", closeAt: "2026-11-30" },
      },
      {
        code: "ENG-201",
        title: "การบำรุงรักษาหม้อแปลงไฟฟ้าระบบจำหน่าย",
        category: "ระบบไฟฟ้าและวิศวกรรม",
        durationMinutes: 270,
        trainees: 860,
        audience: "EMPLOYEE_ONLY",
        registration: { status: "UPCOMING", openAt: "2026-11-01" },
      },
      {
        code: "SRV-101",
        title: "การบริการลูกค้าอย่างมืออาชีพ",
        category: "บริการลูกค้า",
        durationMinutes: 90,
        trainees: 720,
        audience: "ALL",
        registration: { status: "CLOSED" },
      },
      {
        code: "REN-101",
        title: "พื้นฐานระบบโซลาร์รูฟท็อปสำหรับบ้านพักอาศัย",
        category: "พลังงานทดแทน",
        durationMinutes: 180,
        trainees: 640,
        audience: "ALL",
        registration: { status: "OPEN", closeAt: "2026-12-31" },
      },
    ],
  };
}
