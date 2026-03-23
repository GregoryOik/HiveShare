import React from 'react';
import { Search, Plus, Zap } from 'lucide-react';
import { HiveData } from '../../lib/useHiveData';

interface AdminHiveGridProps {
  hives: HiveData[];
  filteredHives: HiveData[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedHiveId: string | null;
  setSelectedHiveId: (id: string | null) => void;
  selectedHiveIds: string[];
  setSelectedHiveIds: React.Dispatch<React.SetStateAction<string[]>>;
  isAddingHive: boolean;
  handleAddHive: () => void;
}

export function AdminHiveGrid({
  hives,
  filteredHives,
  searchTerm,
  setSearchTerm,
  selectedHiveId,
  setSelectedHiveId,
  selectedHiveIds,
  setSelectedHiveIds,
  isAddingHive,
  handleAddHive
}: AdminHiveGridProps) {
  return (
    <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6 flex flex-col h-[calc(100vh-200px)] sticky top-28">
      <div className="mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-honey/40" />
          <input 
            type="text" 
            placeholder="Filter Hives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-honey/20 rounded-full pl-10 pr-4 py-2.5 text-[11px] focus:outline-none focus:border-honey transition-all text-white placeholder:text-honey/20 font-sans"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        <div className="mb-2 px-4 flex items-center justify-between">
          <button 
            onClick={() => setSelectedHiveIds(selectedHiveIds.length === hives.length ? [] : hives.map(h => h.id))}
            className="text-[8px] uppercase font-black text-honey/40 hover:text-honey transition-colors"
          >
            {selectedHiveIds.length === hives.length ? 'DESELECT_ALL' : 'SELECT_ALL_UNITS'}
          </button>
          <span className="text-[8px] font-mono text-honey/20">{selectedHiveIds.length} SELECTED</span>
        </div>

        {filteredHives.map(hive => (
          <div key={hive.id} className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
              <input 
                type="checkbox" 
                checked={selectedHiveIds.includes(hive.id)}
                onChange={() => setSelectedHiveIds(prev => prev.includes(hive.id) ? prev.filter(id => id !== hive.id) : [...prev, hive.id])}
                className="w-3 h-3 rounded-sm border-honey/20 bg-black/40 checked:bg-honey transition-all cursor-pointer"
              />
            </div>
            <button
              onClick={() => setSelectedHiveId(hive.id)}
              className={`w-full text-left pl-8 pr-4 py-4 rounded-lg border transition-all ${
                selectedHiveId === hive.id 
                  ? 'bg-honey/10 border-honey/40 shadow-inner' 
                  : 'border-white/5 hover:border-honey/20 bg-white/5'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black uppercase text-white">Hive #{hive.id}</span>
                <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded-sm ${
                  hive.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-honey/20 text-honey'
                }`}>
                  {hive.status}
                </span>
              </div>
              <div className="text-[10px] text-honey/40 font-mono tracking-tighter">{hive.location}</div>
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={handleAddHive}
        disabled={isAddingHive}
        className="mt-6 w-full py-4 bg-honey text-[#0A0704] text-[10px] uppercase font-black tracking-[0.2em] rounded-lg hover:bg-white disabled:bg-honey/50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
      >
        <Plus size={14} className={`transition-transform ${isAddingHive ? 'animate-spin' : 'group-hover:rotate-90'}`} /> 
        {isAddingHive ? 'Commissioning Unit...' : 'Initialize New Hive'}
      </button>
    </div>
  );
}
