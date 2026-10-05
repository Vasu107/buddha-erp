export type Role = "director" | "hod" | "faculty" | "student";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  designation?: string;
}

export interface StatsCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: string;
  color: "blue" | "green" | "orange" | "purple" | "red" | "cyan";
}

export interface Faculty {
  id: string;
  rollNo?: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone?: string;
  status: "Active" | "Inactive" | "On Leave";
  subjects?: string[];
  experience?: number;
  joiningDate?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  course: string;
  year: number;
  branch: string;
  email: string;
  phone?: string;
  status: "Active" | "Inactive" | "Detained";
  attendance?: number;
  cgpa?: number;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: number;
  credits?: number;
  type?: "Theory" | "Practical" | "Skill" | "Non-Academic";
  status: "Active" | "Inactive";
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod?: string;
  facultyCount: number;
  studentCount: number;
  courses?: number;
}

export interface TimetableSlot {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  subject: string;
  faculty: string;
  room: string;
  type?: "Theory" | "Practical" | "Lab";
}

export interface Exam {
  id: string;
  examName: string;
  course: string;
  date: string;
  time: string;
  room: string;
  department: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  role: Role;
  date: string;
  priority: "High" | "Medium" | "Low";
  targetRoles: Role[];
}
