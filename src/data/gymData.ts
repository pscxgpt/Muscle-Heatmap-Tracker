import { Exercise, Muscle } from '../types';

export const muscles: Muscle[] = [
  // Chest
  { id: 'pec_major', name: 'Pectoralis Major', group: 'chest' },
  { id: 'pec_minor', name: 'Upper Chest', group: 'chest' },
  
  // Back
  { id: 'traps', name: 'Trapezius', group: 'back' },
  { id: 'lats', name: 'Latissimus Dorsi', group: 'back' },
  { id: 'lower_back', name: 'Erector Spinae', group: 'back' },
  { id: 'rhomboids', name: 'Rhomboids', group: 'back' },

  // Shoulders
  { id: 'delts_front', name: 'Anterior Deltoid', group: 'shoulders' },
  { id: 'delts_side', name: 'Lateral Deltoid', group: 'shoulders' },
  { id: 'delts_rear', name: 'Posterior Deltoid', group: 'shoulders' },

  // Arms
  { id: 'biceps', name: 'Biceps Brachii', group: 'biceps' },
  { id: 'triceps', name: 'Triceps Brachii', group: 'triceps' },
  { id: 'forearms', name: 'Forearms', group: 'forearms' },

  // Core
  { id: 'abs', name: 'Rectus Abdominis', group: 'abs' },
  { id: 'obliques', name: 'Obliques', group: 'abs' },

  // Legs
  { id: 'quads', name: 'Quadriceps', group: 'legs' },
  { id: 'hamstrings', name: 'Hamstrings', group: 'legs' },
  { id: 'glutes', name: 'Gluteus Maximus', group: 'glutes' },
  { id: 'calves', name: 'Calves', group: 'calves' },
  { id: 'adductors', name: 'Adductors', group: 'legs' },
];

export const exercises: Exercise[] = [
  // Chest
  {
    id: 'bench_press',
    name: 'Barbell Bench Press',
    primaryMuscles: ['pec_major', 'delts_front', 'triceps'],
    secondaryMuscles: ['pec_minor']
  },
  {
    id: 'incline_bench',
    name: 'Incline Bench Press',
    primaryMuscles: ['pec_minor', 'delts_front', 'triceps'],
    secondaryMuscles: ['pec_major']
  },
  {
    id: 'pushups',
    name: 'Push Ups',
    primaryMuscles: ['pec_major', 'delts_front', 'triceps'],
    secondaryMuscles: ['abs']
  },
  {
    id: 'dips',
    name: 'Chest Dips',
    primaryMuscles: ['pec_major', 'triceps'],
    secondaryMuscles: ['delts_front']
  },

  // Back
  {
    id: 'pullups',
    name: 'Pull Ups',
    primaryMuscles: ['lats', 'biceps'],
    secondaryMuscles: ['rhomboids', 'traps']
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    primaryMuscles: ['lower_back', 'glutes', 'hamstrings'],
    secondaryMuscles: ['traps', 'forearms', 'quads', 'lats']
  },
  {
    id: 'bent_over_row',
    name: 'Bent Over Row',
    primaryMuscles: ['lats', 'rhomboids'],
    secondaryMuscles: ['biceps', 'lower_back', 'traps']
  },

  // Shoulders
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    primaryMuscles: ['delts_front', 'triceps'],
    secondaryMuscles: ['delts_side', 'traps']
  },
  {
    id: 'lateral_raise',
    name: 'Lateral Raise',
    primaryMuscles: ['delts_side'],
    secondaryMuscles: ['traps']
  },
  {
    id: 'face_pull',
    name: 'Face Pull',
    primaryMuscles: ['delts_rear', 'rhomboids'],
    secondaryMuscles: ['traps']
  },

  // Legs
  {
    id: 'squat',
    name: 'Barbell Squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'lower_back', 'adductors']
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes', 'hamstrings']
  },
  {
    id: 'lunge',
    name: 'Walking Lunge',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves']
  },
  {
    id: 'calf_raise',
    name: 'Standing Calf Raise',
    primaryMuscles: ['calves'],
    secondaryMuscles: []
  },

  // Arms
  {
    id: 'bicep_curl',
    name: 'Barbell Curl',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms']
  },
  {
    id: 'tricep_pushdown',
    name: 'Tricep Pushdown',
    primaryMuscles: ['triceps'],
    secondaryMuscles: []
  },
  {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    primaryMuscles: ['biceps', 'forearms'],
    secondaryMuscles: []
  },

  // Core
  {
    id: 'plank',
    name: 'Plank',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['delts_front', 'quads']
  },
  {
    id: 'crunches',
    name: 'Crunches',
    primaryMuscles: ['abs'],
    secondaryMuscles: []
  },
  {
    id: 'skullcrushers',
    name: 'Skullcrushers',
    primaryMuscles: ['triceps'],
    secondaryMuscles: []
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    primaryMuscles: ['hamstrings', 'glutes', 'lower_back'],
    secondaryMuscles: ['forearms']
  },
  {
    id: 'front_squat',
    name: 'Front Squat',
    primaryMuscles: ['quads', 'abs'],
    secondaryMuscles: ['glutes', 'lower_back']
  },
  {
    id: 'arnold_press',
    name: 'Arnold Press',
    primaryMuscles: ['delts_front', 'delts_side', 'triceps'],
    secondaryMuscles: []
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'rhomboids']
  },
  {
    id: 'seated_row',
    name: 'Seated Cable Row',
    primaryMuscles: ['lats', 'rhomboids', 'traps'],
    secondaryMuscles: ['biceps', 'lower_back']
  },
  {
    id: 'leg_extension',
    name: 'Leg Extension',
    primaryMuscles: ['quads'],
    secondaryMuscles: []
  },
  {
    id: 'leg_curl',
    name: 'Leg Curl',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: []
  },
  {
    id: 'russian_twist',
    name: 'Russian Twist',
    primaryMuscles: ['obliques', 'abs'],
    secondaryMuscles: []
  },
  {
    id: 'pec_deck',
    name: 'Pec Deck / Machine Fly',
    primaryMuscles: ['pec_major', 'pec_minor'],
    secondaryMuscles: ['delts_front']
  }
];
