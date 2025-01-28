export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
  userPlan: 'basic' | 'premium';
}

