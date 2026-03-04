import React, { useEffect, useState } from 'react';
import { getExercises, createRoutine, updateRoutine, getRoutines, Routine } from '../api';
import { Exercise } from '../types';
import { Plus, List, Play, ChevronRight, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoutinesPage = () => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  
  // Create/Edit Routine State
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [selectedExIds, setSelectedExIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rData, eData] = await Promise.all([getRoutines(), getExercises()]);
    setRoutines(rData);
    setExercises(eData);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName || selectedExIds.length === 0) return;
    
    if (editingRoutineId) {
      await updateRoutine(editingRoutineId, routineName, selectedExIds);
    } else {
      await createRoutine(routineName, selectedExIds);
    }
    
    closeModal();
    loadData();
  };

  const openCreateModal = () => {
    setEditingRoutineId(null);
    setRoutineName('');
    setSelectedExIds([]);
    setShowCreate(true);
  };

  const openEditModal = (routine: Routine) => {
    setEditingRoutineId(routine.id);
    setRoutineName(routine.name);
    // Map routine exercises to their base IDs (ignoring routine_exercise_id)
    setSelectedExIds(routine.exercises.map(e => e.id));
    setShowCreate(true);
  };

  const closeModal = () => {
    setShowCreate(false);
    setEditingRoutineId(null);
    setRoutineName('');
    setSelectedExIds([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedExIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <List className="text-emerald-500" /> Routines
        </h1>
        <button 
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Routine
        </button>
      </div>

      <div className="grid gap-4">
        {routines.length === 0 && (
          <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
            <p className="text-gray-500 mb-4">No routines found. Create one to get started!</p>
            <button 
              onClick={openCreateModal}
              className="text-emerald-400 hover:underline"
            >
              Create your first routine
            </button>
          </div>
        )}

        {routines.map(routine => (
          <div key={routine.id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{routine.name}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {routine.exercises.length} Exercises • {routine.exercises.map(e => e.name).join(', ').slice(0, 50)}...
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(routine)}
                  className="bg-gray-800 text-gray-400 px-3 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all flex items-center gap-2"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => navigate(`/workout/${routine.id}`)}
                  className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <Play size={16} fill="currentColor" /> Start Workout
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Exercises</h4>
              <div className="space-y-1">
                {routine.exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-gray-600 text-xs font-mono">{idx + 1}</span>
                    {ex.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <h2 className="text-xl font-bold mb-4">{editingRoutineId ? 'Edit Routine' : 'Create Routine'}</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1">Routine Name</label>
              <input 
                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-emerald-500 outline-none"
                placeholder="e.g. Push Day"
                value={routineName}
                onChange={e => setRoutineName(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Exercises</label>
              <div className="flex-1 overflow-y-auto border border-gray-800 rounded-lg bg-black/50">
                {exercises.map(ex => (
                  <div 
                    key={ex.id}
                    onClick={() => toggleSelection(ex.id)}
                    className={`p-3 border-b border-gray-800 cursor-pointer flex justify-between items-center hover:bg-gray-800 ${selectedExIds.includes(ex.id) ? 'bg-emerald-900/20' : ''}`}
                  >
                    <span className={selectedExIds.includes(ex.id) ? 'text-emerald-400 font-medium' : 'text-gray-300'}>
                      {ex.name}
                    </span>
                    {selectedExIds.includes(ex.id) && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </div>
                ))}
              </div>
              <p className="text-right text-xs text-gray-500 mt-2">
                {selectedExIds.length} exercises selected
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-4">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!routineName || selectedExIds.length === 0}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium"
              >
                {editingRoutineId ? 'Update Routine' : 'Save Routine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
