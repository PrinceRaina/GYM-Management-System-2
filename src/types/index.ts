export interface GymUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  goal: 'weight_loss' | 'muscle_gain' | 'fitness' | 'flexibility';
  membershipTier: 'free' | 'pro' | 'elite';
  stats: {
    weight: number;
    height: number;
    age: number;
    dailyCaloriesGoal: number;
  };
}

export interface GymClass {
  id: string;
  title: string;
  type: 'Yoga' | 'HIIT' | 'Dance' | 'Strength' | 'Boxing';
  instructor: string;
  startTime: Date | string;
  duration: number; // minutes
  capacity: number;
  bookedCount: number;
  intensity: 'Low' | 'Medium' | 'High';
  image: string;
}

export interface Workout {
  id: string;
  title: string;
  duration: number;
  calories: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Home' | 'Gym' | 'Cardio' | 'Yoga';
  exercises: Exercise[];
  image: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  rest: number;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  meals: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    time: string;
  }[];
  totalCalories: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: 'free' | 'pro' | 'elite';
  price: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}
