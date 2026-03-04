export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'legs'
  | 'glutes'
  | 'calves';

export interface Muscle {
  id: string;
  name: string;
  group: MuscleGroup;
  // Intensity is calculated at runtime, 0-10 scale
  intensity?: number; 
}

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[]; // Muscle IDs
  secondaryMuscles: string[]; // Muscle IDs
  routine_exercise_id?: number;
}

export interface WorkoutSet {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
}
