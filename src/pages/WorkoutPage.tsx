import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoutines, Routine, logWorkout, WorkoutSetLog } from '../api';
import { Check, ChevronLeft, Save, Trash2, Pencil } from 'lucide-react';

export const WorkoutPage = () => {
  const { id } = useParams(); // routineId
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [completedSets, setCompletedSets] = useState<(WorkoutSetLog & { routineExerciseId?: number })[]>([]);
  
  // Current input state
  const [currentInputs, setCurrentInputs] = useState<Record<string, { weight: string, reps: string }>>({});

  useEffect(() => {
    if (id) {
      loadRoutine(parseInt(id));
    }
  }, [id]);

  const loadRoutine = async (routineId: number) => {
    const routines = await getRoutines();
    const found = routines.find(r => r.id === routineId);
    if (found) setRoutine(found);
  };

  const handleInputChange = (key: string, field: 'weight' | 'reps', value: string) => {
    setCurrentInputs(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { weight: '', reps: '' }),
        [field]: value
      }
    }));
  };

  const finishSet = (exId: string, routineExId?: number) => {
    const key = routineExId ? routineExId.toString() : exId;
    const input = currentInputs[key];
    if (!input || !input.weight || !input.reps) return;

    const weight = parseFloat(input.weight);
    const reps = parseInt(input.reps);

    if (isNaN(weight) || isNaN(reps)) return;

    setCompletedSets(prev => [...prev, {
      exerciseId: exId,
      routineExerciseId: routineExId,
      weight,
      reps
    }]);

    // Clear inputs as requested
    setCurrentInputs(prev => ({
      ...prev,
      [key]: { weight: input.weight, reps: '' } // Keep weight, clear reps (common UX)
    }));
  };

  const deleteSet = (setIndex: number) => {
    setCompletedSets(prev => prev.filter((_, idx) => idx !== setIndex));
  };

  const editSet = (setIndex: number, set: WorkoutSetLog & { routineExerciseId?: number }) => {
    const key = set.routineExerciseId ? set.routineExerciseId.toString() : set.exerciseId;
    
    // Populate input
    setCurrentInputs(prev => ({
      ...prev,
      [key]: { weight: set.weight.toString(), reps: set.reps.toString() }
    }));

    // Remove from completed list
    deleteSet(setIndex);
  };

  const finishWorkout = async () => {
    if (!routine) return;
    // Strip routineExerciseId before sending to API
    const setsToLog = completedSets.map(({ routineExerciseId, ...rest }) => rest);
    await logWorkout(routine.id, setsToLog);
    navigate('/');
  };

  if (!routine) return <div className="p-8 text-center">Loading workout...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full">
          <ChevronLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{routine.name}</h1>
          <p className="text-gray-400 text-sm">Active Workout</p>
        </div>
      </div>

      <div className="space-y-6">
        {routine.exercises.map((ex, idx) => {
          const uniqueKey = ex.routine_exercise_id ? ex.routine_exercise_id.toString() : `${ex.id}-${idx}`;
          
          // Filter sets for this SPECIFIC instance of the exercise in the routine
          // We need to map the global index to the local index for display, 
          // but keep the global index for deletion/editing
          const setsForExWithIndex = completedSets
            .map((set, globalIdx) => ({ ...set, globalIdx }))
            .filter(s => {
              if (ex.routine_exercise_id) {
                return s.routineExerciseId === ex.routine_exercise_id;
              }
              return s.exerciseId === ex.id;
            });

          const currentInput = currentInputs[uniqueKey] || { weight: '', reps: '' };

          return (
            <div key={uniqueKey} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 bg-gray-950 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">{ex.name}</h3>
                <span className="text-xs text-gray-500 uppercase font-mono">Set {setsForExWithIndex.length + 1}</span>
              </div>
              
              <div className="p-4">
                {/* History of sets in this session */}
                {setsForExWithIndex.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {setsForExWithIndex.map((set, localIdx) => (
                      <div key={set.globalIdx} className="flex items-center text-sm text-gray-400 bg-black/30 p-2 rounded px-3 group">
                        <span className="w-8 font-mono text-gray-600">#{localIdx + 1}</span>
                        <span className="flex-1">{set.weight} kg x {set.reps} reps</span>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => editSet(set.globalIdx, set)}
                            className="p-1 hover:text-white text-gray-500"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => deleteSet(set.globalIdx)}
                            className="p-1 hover:text-red-400 text-gray-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="ml-2">
                          <Check size={14} className="text-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input for new set */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Weight (kg)</label>
                    <input 
                      type="number" 
                      className="w-full bg-black border border-gray-700 rounded-lg p-3 text-lg font-mono focus:border-emerald-500 outline-none"
                      placeholder="0"
                      value={currentInput.weight}
                      onChange={e => handleInputChange(uniqueKey, 'weight', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Reps</label>
                    <input 
                      type="number" 
                      className="w-full bg-black border border-gray-700 rounded-lg p-3 text-lg font-mono focus:border-emerald-500 outline-none"
                      placeholder="0"
                      value={currentInput.reps}
                      onChange={e => handleInputChange(uniqueKey, 'reps', e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => finishSet(ex.id, ex.routine_exercise_id)}
                    disabled={!currentInput.weight || !currentInput.reps}
                    className="h-[54px] px-6 bg-gray-800 hover:bg-emerald-600 hover:text-white text-emerald-400 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Log Set
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-gray-800 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="text-white font-bold text-lg">{completedSets.length}</span> sets completed
          </div>
          <button 
            onClick={finishWorkout}
            disabled={completedSets.length === 0}
            className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
};
