export const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:7777" : "/api";

// Development mode flag
export const IS_DEV = import.meta.env.DEV;

// Mock user data for development
export const MOCK_USER = {
  _id: "dev-user-123",
  firstName: "John",
  lastName: "Doe",
  emailId: "john.doe@example.com",
  age: 28,
  gender: "male",
  about: "Full-stack developer passionate about React and Node.js. Love building amazing user experiences!",
  photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
  skills: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB", "Express"]
};

// Mock feed data for development
export const MOCK_FEED = [
  {
    _id: "user-1",
    firstName: "Sarah",
    lastName: "Wilson",
    age: 26,
    gender: "female",
    about: "Frontend developer with a passion for UI/UX design. Love creating beautiful and intuitive interfaces.",
    photoURL: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
    skills: ["React", "Vue.js", "CSS", "Figma", "JavaScript"]
  },
  {
    _id: "user-2", 
    firstName: "Alex",
    lastName: "Johnson",
    age: 29,
    gender: "male",
    about: "Backend engineer focused on scalable systems. Experienced with microservices and cloud architecture.",
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
    skills: ["Python", "Docker", "AWS", "PostgreSQL", "Django"]
  },
  {
    _id: "user-3",
    firstName: "Emma",
    lastName: "Davis",
    age: 24,
    gender: "female", 
    about: "Mobile app developer creating innovative solutions. Love working with React Native and Flutter.",
    photoURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"]
  }
];