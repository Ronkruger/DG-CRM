export interface SidebarMenuItem {
  priority?: number;
  label: string;
  key: string; // unique identifier, e.g. "arap", "banks"
  icon?: React.ReactNode; // You can add icons later
  comingSoon?: boolean; // For marking "PRIORITY TO DEVELOP"

}

export const sidebarMenu: SidebarMenuItem[] = [
      { label: "Dashboard", key: "dashboard"},
  { label: "AR/AP", key: "arap" },
  { label: "AR/AP (BOOKING)", key: "arap_booking" },
  { label: "BANKS", key: "banks", comingSoon: true },
  { label: "BOOKING AND PURCHASING", key: "booking_purchasing", comingSoon: true },
  { label: "DG ASSETS", key: "dg_assets" },
  { label: "EMPLOYEE FEEDBACK", key: "employee_feedback",comingSoon: true },
  { label: "HR SUPPORT", key: "hr_support" },
  { label: "INCIDENT REPORT", key: "incident_report",comingSoon: true },
  { label: "IT SUPPORT", key: "it_support",comingSoon: true },
  { label: "ATTENDANCE TRACKER", key: "attendance_tracker" },
  { label: "REFUND CASES", key: "refund_cases",comingSoon: true },
    { label: "RND", key: "rnd", comingSoon: true },
    { label: "AR/AP VISA", key: "arap_visa", comingSoon: true },
  { label: "PROCEED CLIENTS", key: "proceed_clients",comingSoon: true },
  { label: "DG BOOK", key: "dg_book" },
  { label: "BOOKING CONFIRMATION", key: "booking_confirmation",comingSoon: true},
  { label: "SALES TRACKER", key: "sales_tracker",comingSoon: true },
  { label: "IT TICKET", key: "it_ticket",comingSoon: true },
  { label: "ATTENDANCE FORM", key: "attendance_form",comingSoon: true },
  { label: "ATTENDANCE SHEET", key: "attendance_sheet",comingSoon: true },
  { label: "APPOINTMENTS", key: "appointments" },
  { label: "METAKEEPER", key: "metakeeper" },
  { label: "OFFICE INVENTORY", key: "office_inventory" },
  { label: "PRODUCTIVITY TRACKER", key: "productivity_tracker" },
  { label: "SLOTS TRACKER", key: "slots_tracker" },
  { label: "STATUS", key: "status" },
  { label: "TOUR COSTING", key: "tour_costing" },
  { label: "KNOWLEDGE", key: "knowledge" },
  { label: "VISA TRACKER", key: "visa_tracker" },
  { label: "CONTACTS", key: "contacts" },
  { label: "APPROVALS", key: "approvals" },
  { label: "CALENDAR", key: "calendar" },
  { label: "SALES", key: "sales" },
  { label: "POINT OF SALE", key: "point_of_sale" },
  { label: "DOCUMENTS", key: "documents" },
  { label: "PROJECT", key: "project" },
  { label: "SOCIAL MARKETING", key: "social_marketing" },
  { label: "EVENTS", key: "events" },
  { label: "SURVEYS", key: "surveys" },
  { label: "INVENTORY", key: "inventory" },
  { label: "REPAIRS", key: "repairs" },
  { label: "EMPLOYEES (BOOKING)", key: "employees_booking", comingSoon: true },
  { label: "PAYROLL", key: "payroll" },
  { label: "ATTENDANCES", key: "attendances" },
  { label: "RECRUITMENT", key: "recruitment" },
  { label: "TIME OFF", key: "time_off" },
  { label: "SETTINGS", key: "settings" }
];