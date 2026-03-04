import React from 'react';
import { Exercise } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface ExerciseListProps {
  availableExercises: Exercise[];
  selectedExercises: Exercise[];
  onAddExercise: (exercise: Exercise) => void;
  onRemoveExercise: (index: number) => void;
  onClear: () => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  availableExercises,
  selectedExercises,
  onAddExercise,
  onRemoveExercise,
  onClear,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredExercises = availableExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-xl overflow-hidden border border-gray-800 shadow-xl">
      <div className="p-4 border-b border-gray-800 bg-gray-950">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-emerald-400">Workout Plan</h2>
          {selectedExercises.length > 0 && (
            <button 
              onClick={onClear}
              className="px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors text-xs font-medium"
            >
              Reset
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Search exercises..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {selectedExercises.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-sm">
            No exercises added yet. <br/> Search and add exercises to see the heatmap.
          </div>
        )}
        
        {selectedExercises.map((ex, idx) => (
          <div key={`${ex.id}-${idx}`} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg group hover:bg-gray-750 transition-colors border border-gray-700/50">
            <div>
              <div className="font-medium text-sm">{ex.name}</div>
              <div className="text-xs text-gray-400">
                {ex.primaryMuscles.join(', ')}
              </div>
            </div>
            <button
              onClick={() => onRemoveExercise(idx)}
              className="text-gray-500 hover:text-red-400 p-1 rounded-md transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Exercises</h3>
        <div className="h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {filteredExercises.map(ex => (
            <button
              key={ex.id}
              onClick={() => onAddExercise(ex)}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 text-sm text-gray-300 hover:text-white flex items-center justify-between group transition-all"
            >
              <span>{ex.name}</span>
              <Plus size={14} className="opacity-0 group-hover:opacity-100 text-emerald-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
