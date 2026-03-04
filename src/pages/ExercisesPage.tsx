import React, { useEffect, useState } from 'react';
import { getExercises, createExercise } from '../api';
import { Exercise } from '../types';
import { muscles } from '../data/gymData';
import { Plus, Search, Dumbbell } from 'lucide-react';

export const ExercisesPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New Exercise Form State
  const [newExName, setNewExName] = useState('');
  const [newExPrimary, setNewExPrimary] = useState<string[]>([]);
  const [newExSecondary, setNewExSecondary] = useState<string[]>([]);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    const data = await getExercises();
    setExercises(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = newExName.toLowerCase().replace(/\s+/g, '_');
    await createExercise({
      id,
      name: newExName,
      primaryMuscles: newExPrimary,
      secondaryMuscles: newExSecondary
    });
    setShowAddModal(false);
    setNewExName('');
    setNewExPrimary([]);
    setNewExSecondary([]);
    loadExercises();
  };

  const toggleMuscle = (id: string, type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setNewExPrimary(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
    } else {
      setNewExSecondary(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
    }
  };

  const filtered = exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Dumbbell className="text-emerald-500" /> Exercise Library
        </h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="Search exercises..." 
          className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(ex => (
          <div key={ex.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl hover:border-gray-700 transition-colors">
            <h3 className="font-semibold text-lg">{ex.name}</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-500 w-20">Primary:</span>
                <span className="text-emerald-400">
                  {ex.primaryMuscles.map(id => muscles.find(m => m.id === id)?.name || id).join(', ')}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-20">Secondary:</span>
                <span className="text-gray-400">
                  {ex.secondaryMuscles.map(id => muscles.find(m => m.id === id)?.name || id).join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Exercise</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Exercise Name</label>
                <input 
                  required
                  className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-emerald-500 outline-none"
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-400 mb-2">Primary Muscles</label>
                  <div className="h-48 overflow-y-auto border border-gray-800 rounded-lg p-2 space-y-1">
                    {muscles.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => toggleMuscle(m.id, 'primary')}
                        className={`p-2 rounded cursor-pointer text-sm ${newExPrimary.includes(m.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'hover:bg-gray-800 text-gray-400'}`}
                      >
                        {m.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Muscles</label>
                  <div className="h-48 overflow-y-auto border border-gray-800 rounded-lg p-2 space-y-1">
                    {muscles.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => toggleMuscle(m.id, 'secondary')}
                        className={`p-2 rounded cursor-pointer text-sm ${newExSecondary.includes(m.id) ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'hover:bg-gray-800 text-gray-400'}`}
                      >
                        {m.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
