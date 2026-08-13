import React, { useState, useEffect, useMemo } from 'react';
import { THEMES } from '../constants';
import { GameTheme, ItemType } from '../types';
import { Printer, RefreshCw, X, CheckSquare, Square, BookOpen } from 'lucide-react';

export interface WorksheetItem {
  id: string;
  type: ItemType;
  icon: React.ComponentType<{ size?: number | string }>;
  color: string;
  fill: string;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export interface BookletPage {
  id: string;
  type: 'frontpage' | 'worksheet';
  themeIndex?: number;
  items?: WorksheetItem[];
  themeIndices?: number[]; // for frontpage rendering
}

interface WorksheetPreviewProps {
  onClose: () => void;
  initialThemeIndex: number;
  onStateChange: (pages: BookletPage[]) => void;
}

// Generate balanced counts (total 20, min 2, max 8 per category)
const generateBalancedCounts = (numCategories: number, total: number, min: number, max: number): number[] => {
  let counts = Array(numCategories).fill(min);
  let currentSum = min * numCategories;

  while (currentSum < total) {
    const idx = Math.floor(Math.random() * numCategories);
    if (counts[idx] < max) {
      counts[idx]++;
      currentSum++;
    }
  }

  // Shuffle to randomize which category gets which count
  return counts.sort(() => Math.random() - 0.5);
};

export const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({ onClose, initialThemeIndex, onStateChange }) => {
  const [numTasks, setNumTasks] = useState(4);
  const [showFrontpage, setShowFrontpage] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Generate pages memoized
  const pages = useMemo(() => {
    const list: BookletPage[] = [];
    const taskPages: BookletPage[] = [];
    const usedThemeIndices: number[] = [];

    // 1. Generate Worksheet pages
    for (let i = 0; i < numTasks; i++) {
      // Cycle through themes in order
      const themeIdx = (initialThemeIndex + i) % THEMES.length;
      if (!usedThemeIndices.includes(themeIdx)) {
        usedThemeIndices.push(themeIdx);
      }
      const theme = THEMES[themeIdx];

      const counts = generateBalancedCounts(theme.buckets.length, 20, 2, 8);
      const newItems: WorksheetItem[] = [];

      theme.buckets.forEach((bucket, idx) => {
        const count = counts[idx];
        for (let iCount = 0; iCount < count; iCount++) {
          // Random offsets for organic layout in the box
          const rotation = Math.floor(Math.random() * 30) - 15; // -15 to 15 deg
          const offsetX = Math.floor(Math.random() * 12) - 6;   // -6 to 6px
          const offsetY = Math.floor(Math.random() * 12) - 6;   // -6 to 6px

          newItems.push({
            id: `${bucket.type}-${iCount}-${Math.random()}`,
            type: bucket.type as ItemType,
            icon: bucket.icon as any,
            color: bucket.color,
            fill: bucket.fill,
            rotation,
            offsetX,
            offsetY
          });
        }
      });

      taskPages.push({
        id: `worksheet-${i}-${theme.id}-${refreshTrigger}`,
        type: 'worksheet',
        themeIndex: themeIdx,
        items: newItems.sort(() => Math.random() - 0.5)
      });
    }

    // 2. Add Frontpage in front if requested
    if (showFrontpage) {
      list.push({
        id: `frontpage-${refreshTrigger}`,
        type: 'frontpage',
        themeIndices: usedThemeIndices
      });
    }

    // Add worksheets
    list.push(...taskPages);

    return list;
  }, [numTasks, showFrontpage, refreshTrigger, initialThemeIndex]);

  // Sync state up to App.tsx
  useEffect(() => {
    onStateChange(pages);
  }, [pages]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[90] backdrop-blur-sm flex flex-col no-select no-print">
      
      {/* Control Panel (Screen only, hidden on print) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-700 p-2 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Forbered og Print Opgavehæfte</h2>
            <p className="text-xs text-slate-500 font-medium">Brug slideren til at bestemme hvor mange sider hæftet skal indeholde.</p>
          </div>
        </div>

        {/* Configurations (Slider & Cover Toggle) */}
        <div className="flex flex-col sm:flex-row items-center gap-6 flex-grow max-w-xl">
          {/* Slider for page count */}
          <div className="flex items-center gap-3 flex-grow w-full">
            <span className="text-xs font-bold text-slate-500 shrink-0">Antal opgaver:</span>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={numTasks} 
              onChange={(e) => setNumTasks(Number(e.target.value))}
              className="flex-grow h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="bg-indigo-100 text-indigo-700 font-black text-sm px-3 py-1.5 rounded-lg border border-indigo-200 w-10 text-center">
              {numTasks}
            </span>
          </div>

          {/* Cover Page Toggle */}
          <button
            onClick={() => setShowFrontpage(!showFrontpage)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all text-left shrink-0 w-full sm:w-auto justify-center ${
              showFrontpage 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {showFrontpage ? <CheckSquare size={16} /> : <Square size={16} />}
            <span>Inkluder Forside</span>
          </button>
        </div>

        {/* Utility Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
          {/* Pages count indicator */}
          <div className="bg-slate-100 text-slate-700 px-3 py-2.5 rounded-xl font-bold text-xs border border-slate-200">
            Sider i alt: <span className="text-indigo-600 text-sm font-black">{pages.length}</span>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors border-2 border-indigo-200 text-sm"
            title="Bland alle sider med nye tilfældige tal"
          >
            <RefreshCw size={18} />
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={pages.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-200 hover:shadow-green-300 text-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            <Printer size={18} />
            <span>Print Hæfte</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors border border-slate-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Preview Container (Screen only) */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-8 bg-slate-100 flex flex-col items-center gap-8">
        {pages.map((page, index) => (
          <div key={page.id} className="relative">
            {/* Page indicator tag */}
            <div className="absolute -left-20 top-4 bg-indigo-600 text-white font-bold rounded-lg px-2.5 py-1 text-xs shadow-md border border-indigo-500 z-10 hidden md:block">
              Side {index + 1}
            </div>

            {/* Printable A4 Sheet Mockup */}
            <div className="bg-white border border-slate-300 shadow-2xl rounded-xl flex flex-col justify-between w-[210mm] min-h-[297mm] p-[15mm] box-border relative">
              <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none pointer-events-none border border-slate-200 rounded px-1 md:hidden">
                Side {index + 1} (A4)
              </div>
              {page.type === 'frontpage' ? (
                <BookletFrontPage themeIndices={page.themeIndices || []} />
              ) : (
                <WorksheetPrintPage 
                  theme={THEMES[page.themeIndex!]} 
                  items={page.items!} 
                />
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

// --- BOOKLET COVER PAGE ---
export const BookletFrontPage: React.FC<{ themeIndices: number[] }> = ({ themeIndices }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center text-slate-800 bg-white">
      <div className="w-full flex flex-col items-center mt-12">
        {/* Playful Badge */}
        <span className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-8">
          Matematik i Indskolingen
        </span>
        
        {/* Title */}
        <h1 className="text-5xl font-black text-indigo-900 tracking-tight text-center leading-tight mb-4">
          Mit store<br />
          Sorteringshæfte
        </h1>
        
        <p className="text-sm font-bold text-slate-500 text-center max-w-sm mb-12">
          Et sjovt opgavehæfte med tælleopgaver, kategorier og søjlediagrammer.
        </p>

        {/* Large coloring area in center */}
        <div className="w-full max-w-sm aspect-[4/3] border-4 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col justify-center items-center bg-slate-50/50 relative">
          <div className="absolute -top-3 bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Farvelæg forsiden!
          </div>
          
          <div className="flex flex-wrap gap-5 justify-center items-center max-h-[140px] overflow-hidden p-2">
            {themeIndices.map((themeIdx) => {
              const theme = THEMES[themeIdx];
              return theme.buckets.slice(0, 2).map((bucket, bIdx) => {
                const Icon = bucket.icon;
                return (
                  <div key={`${theme.id}-${bIdx}`} className="p-3 border-2 border-slate-200 rounded-2xl bg-white shadow-sm">
                    <Icon size={36} />
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {/* Name and class fields */}
      <div className="w-full max-w-xs bg-indigo-50/20 border border-indigo-100 rounded-2xl p-5 flex flex-col gap-4 mb-16">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-500 text-xs w-12">Navn:</span>
          <div className="flex-grow border-b-2 border-dotted border-slate-300 h-5"></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-500 text-xs w-12">Klasse:</span>
          <div className="flex-grow border-b-2 border-dotted border-slate-300 h-5"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <span>Kongskole.dk/dataogsortering</span>
        <span>Elevmateriale</span>
      </div>
    </div>
  );
};

// --- SINGLE WORKSHEET PRINT PAGE ---
interface WorksheetPrintPageProps {
  theme: GameTheme;
  items: WorksheetItem[];
}

export const WorksheetPrintPage: React.FC<WorksheetPrintPageProps> = ({ theme, items }) => {
  const rows = Array.from({ length: 10 }, (_, i) => 10 - i);

  return (
    <div className="w-full h-full flex flex-col justify-between text-slate-800 bg-white">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-300 pb-3 mb-4">
          <div>
            <h1 className="text-2xl font-black text-indigo-900 tracking-tight">Sortering og Søjlediagram</h1>
            <p className="text-sm font-bold text-slate-500">Klasseaktivitet • Tema: {theme.name}</p>
          </div>
          <div className="flex flex-col gap-2 text-xs font-semibold text-slate-600 mt-1">
            <div>Navn: _____________________________________</div>
            <div>Dato: __________________</div>
          </div>
        </div>

        {/* Instruction */}
        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl mb-4 text-xs font-bold text-indigo-950 flex flex-col gap-1">
          <div>✏️ 1. Tæl de forskellige ting i kassen nedenfor.</div>
          <div>📝 2. Skriv antallet i de runde felter under kassen.</div>
          <div>🎨 3. Farvelæg søjlediagrammet til højre (start nedefra, 1 kasse per ting).</div>
        </div>

        {/* Content Section (Mix box + Count boxes and Grid side-by-side) */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Mix box + Count boxes */}
          <div className="col-span-7 flex flex-col justify-between gap-4">
            
            {/* Mix Box */}
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Blandingskassen (Tæl tingene)</h3>
              <div className="border-4 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 aspect-[5/4] flex flex-col justify-center items-center">
                
                {/* 5x4 Grid layout for clean printable item placement */}
                <div className="grid grid-cols-5 gap-4 w-full h-full content-center items-center justify-items-center">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={item.id} 
                        className="bg-white border-2 border-slate-200 rounded-full p-1.5 flex items-center justify-center w-12 h-12"
                        style={{
                          transform: `rotate(${item.rotation}deg) translate(${item.offsetX}px, ${item.offsetY}px)`
                        }}
                      >
                        <Icon size={32} />
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Count Boxes */}
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Skriv antal</h3>
              <div className="grid grid-cols-4 gap-2">
                {theme.buckets.map((bucket) => {
                  const Icon = bucket.icon;
                  return (
                    <div key={bucket.type} className="border border-slate-200 rounded-xl p-2 flex flex-col items-center bg-white">
                      <Icon size={24} />
                      <span className="text-[10px] font-bold text-slate-500 mt-1 truncate w-full text-center">{bucket.label}</span>
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-indigo-300 mt-2 flex items-center justify-center bg-indigo-50/30">
                        {/* Empty space for student to write count */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Stacked Bar Chart */}
          <div className="col-span-5 flex flex-col items-center justify-between border-l border-slate-200 pl-4">
            <div className="w-full flex flex-col items-center">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 w-full text-center">Tegn diagrammet</h3>
              
              {/* Grid */}
              <div className="flex flex-col items-center w-full">
                {rows.map((rowNum) => (
                  <div key={rowNum} className="flex items-center w-full justify-center">
                    <span className="w-6 text-right mr-2.5 font-bold text-slate-400 text-xs">{rowNum}</span>
                    {theme.buckets.map((bucket, idx) => (
                      <div
                        key={bucket.type}
                        className={`w-10 h-[26px] border-b border-r border-slate-300 bg-white
                          ${rowNum === 10 ? 'border-t' : ''}
                          ${idx === 0 ? 'border-l' : ''}
                        `}
                      />
                    ))}
                  </div>
                ))}
                
                {/* X Axis Icons */}
                <div className="flex items-center justify-center mt-2.5 pl-6 w-full">
                  {theme.buckets.map((bucket) => {
                    const Icon = bucket.icon;
                    return (
                      <div key={bucket.type} className="w-10 flex flex-col items-center">
                        <Icon size={20} />
                        <span className="text-[9px] font-black text-slate-600 mt-1 truncate w-full text-center">{bucket.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer decoration */}
        <div className="border-t border-slate-200 mt-8 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Kongskole.dk/dataogsortering</span>
          <span>Didaktisk materiale</span>
        </div>

      </div>
    </div>
  );
};
