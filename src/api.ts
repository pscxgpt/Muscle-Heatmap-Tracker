import { Exercise, Muscle } from './types';
import { getDB } from './db';

// API Client for interacting with local SQLite database

export async function getExercises(): Promise<Exercise[]> {
  const db = getDB();
  const res = await db.query('SELECT * FROM exercises');
  if (!res.values) return [];
  
  return res.values.map((ex: any) => ({
    ...ex,
    primaryMuscles: JSON.parse(ex.primary_muscles),
    secondaryMuscles: JSON.parse(ex.secondary_muscles)
  }));
}

export async function createExercise(exercise: Exercise): Promise<void> {
  const db = getDB();
  await db.run(
    'INSERT INTO exercises (id, name, primary_muscles, secondary_muscles) VALUES (?, ?, ?, ?)',
    [exercise.id, exercise.name, JSON.stringify(exercise.primaryMuscles), JSON.stringify(exercise.secondaryMuscles)]
  );
}

export interface Routine {
  id: number;
  name: string;
  exercises: Exercise[];
}

export async function getRoutines(): Promise<Routine[]> {
  const db = getDB();
  const res = await db.query('SELECT * FROM routines ORDER BY created_at DESC');
  if (!res.values) return [];

  const routines = await Promise.all(res.values.map(async (r: any) => {
    const exRes = await db.query(`
      SELECT e.*, re."order", re.id as routine_exercise_id
      FROM routine_exercises re
      JOIN exercises e ON re.exercise_id = e.id
      WHERE re.routine_id = ?
      ORDER BY re."order" ASC
    `, [r.id]);

    const exercises = (exRes.values || []).map((ex: any) => ({
      ...ex,
      primaryMuscles: JSON.parse(ex.primary_muscles),
      secondaryMuscles: JSON.parse(ex.secondary_muscles)
    }));

    return { ...r, exercises };
  }));

  return routines;
}

export async function createRoutine(name: string, exerciseIds: string[]): Promise<void> {
  const db = getDB();
  const res = await db.run('INSERT INTO routines (name) VALUES (?)', [name]);
  const routineId = res.changes?.lastId;

  if (routineId) {
    for (let i = 0; i < exerciseIds.length; i++) {
      await db.run('INSERT INTO routine_exercises (routine_id, exercise_id, "order") VALUES (?, ?, ?)', [routineId, exerciseIds[i], i]);
    }
  }
}

export async function updateRoutine(id: number, name: string, exerciseIds: string[]): Promise<void> {
  const db = getDB();
  await db.run('UPDATE routines SET name = ? WHERE id = ?', [name, id]);
  await db.run('DELETE FROM routine_exercises WHERE routine_id = ?', [id]);
  
  for (let i = 0; i < exerciseIds.length; i++) {
    await db.run('INSERT INTO routine_exercises (routine_id, exercise_id, "order") VALUES (?, ?, ?)', [id, exerciseIds[i], i]);
  }
}

export interface WorkoutSetLog {
  exerciseId: string;
  reps: number;
  weight: number;
}

export async function logWorkout(routineId: number | null, sets: WorkoutSetLog[]): Promise<void> {
  const db = getDB();
  const res = await db.run('INSERT INTO workouts (routine_id, end_time) VALUES (?, datetime("now"))', [routineId]);
  const workoutId = res.changes?.lastId;

  if (workoutId) {
    const setCounters: Record<string, number> = {};
    for (const set of sets) {
      const setNum = (setCounters[set.exerciseId] || 0) + 1;
      setCounters[set.exerciseId] = setNum;
      await db.run(
        'INSERT INTO workout_sets (workout_id, exercise_id, set_number, reps, weight) VALUES (?, ?, ?, ?, ?)',
        [workoutId, set.exerciseId, setNum, set.reps, set.weight]
      );
    }
  }
}

export async function clearWorkouts(period: 'today' | 'week' | 'month' | 'all'): Promise<void> {
  const db = getDB();
  let dateFilter = '';
  if (period === 'today') {
    dateFilter = "AND date(end_time) = date('now')";
  } else if (period === 'week') {
    dateFilter = "AND date(end_time) >= date('now', '-7 days')";
  } else if (period === 'month') {
    dateFilter = "AND date(end_time) >= date('now', '-30 days')";
  }

  await db.run(`DELETE FROM workouts WHERE 1=1 ${dateFilter}`);
}

export async function getMuscleStats(period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<Record<string, number>> {
  const db = getDB();
  let dateFilter = '';
  if (period === 'today') {
    dateFilter = "AND date(ws.completed_at) = date('now')";
  } else if (period === 'week') {
    dateFilter = "AND date(ws.completed_at) >= date('now', '-7 days')";
  } else if (period === 'month') {
    dateFilter = "AND date(ws.completed_at) >= date('now', '-30 days')";
  }

  const res = await db.query(`
    SELECT ws.weight, ws.reps, e.primary_muscles, e.secondary_muscles
    FROM workout_sets ws
    JOIN exercises e ON ws.exercise_id = e.id
    WHERE 1=1 ${dateFilter}
  `);

  const muscleVolume: Record<string, number> = {};
  const sets = res.values || [];

  sets.forEach((set: any) => {
    const volume = (Number(set.weight) || 0) * (Number(set.reps) || 0);
    if (volume <= 0) return;

    const primary = JSON.parse(set.primary_muscles);
    const secondary = JSON.parse(set.secondary_muscles);

    primary.forEach((m: string) => {
      muscleVolume[m] = (muscleVolume[m] || 0) + volume;
    });
    secondary.forEach((m: string) => {
      muscleVolume[m] = (muscleVolume[m] || 0) + (volume * 0.5);
    });
  });

  return muscleVolume;
}
