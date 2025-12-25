export interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  location: string
  status: "Active" | "Inactive"
  attendance: "Present" | "Late" | "Remote" | "Absent"
  checkIn: string
  avatar: string
}

export const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    department: "Engineering",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "Active",
    attendance: "Present",
    checkIn: "9:15 AM",
    avatar: "/professional-woman-developer.png",
  },
  {
    id: "2",
    name: "Mike Johnson",
    role: "Backend Developer",
    department: "Engineering",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 234-5678",
    location: "Remote",
    status: "Active",
    attendance: "Present",
    checkIn: "8:45 AM",
    avatar: "/professional-man-developer.png",
  },
  {
    id: "3",
    name: "Alex Rodriguez",
    role: "UX Designer",
    department: "Design",
    email: "alex.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    status: "Active",
    attendance: "Late",
    checkIn: "10:45 AM",
    avatar: "/professional-designer.png",
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "Product Manager",
    department: "Product",
    email: "emma.wilson@company.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    status: "Active",
    attendance: "Remote",
    checkIn: "9:00 AM",
    avatar: "/professional-woman-manager.png",
  },
  {
    id: "5",
    name: "David Kim",
    role: "DevOps Engineer",
    department: "Engineering",
    email: "david.kim@company.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    status: "Active",
    attendance: "Present",
    checkIn: "8:30 AM",
    avatar: "/professional-engineer.png",
  },
  {
    id: "6",
    name: "Lisa Park",
    role: "QA Engineer",
    department: "Engineering",
    email: "lisa.park@company.com",
    phone: "+1 (555) 678-9012",
    location: "Los Angeles, CA",
    status: "Inactive",
    attendance: "Absent",
    checkIn: "-",
    avatar: "/professional-woman-qa-engineer.jpg",
  },
]

