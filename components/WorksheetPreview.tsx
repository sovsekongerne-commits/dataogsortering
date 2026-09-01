import React, { useState, useEffect, useMemo } from 'react';
import { THEMES } from '../constants';
import { GameTheme, ItemType } from '../types';
import { 
  Printer, 
  RefreshCw, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  BookOpen
} from 'lucide-react';

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
  themeIndices?: number[];
}

interface WorksheetPreviewProps {
  onClose: () => void;
  initialThemeIndex: number;
  onStateChange?: (pages: BookletPage[]) => void;
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

  return counts.sort(() => Math.random() - 0.5);
};

// --- BRANDING LOGO COMPONENT ---
export const KongSkoleLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const isSm = size === 'sm';
  return (
    <div className="flex items-center gap-2.5 select-none text-left">
      <div className={`rounded-xl bg-gradient-to-br from-[#29619F] to-[#1a4472] text-white flex items-center justify-center shadow-sm shrink-0 ${isSm ? 'w-8 h-8' : 'w-9 h-9'}`}>
        <svg width={isSm ? "20" : "24"} height={isSm ? "20" : "24"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 17L2 7.5L7.5 11L12 4.5L16.5 11L22 7.5L20 17H4Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M4 18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V17H4V18Z" fill="#F59E0B"/>
          <circle cx="12" cy="4" r="1.5" fill="#FBBF24"/>
          <circle cx="2" cy="7" r="1.5" fill="#FBBF24"/>
          <circle cx="22" cy="7" r="1.5" fill="#FBBF24"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-['Fredoka',sans-serif] font-bold text-gray-900 leading-tight tracking-tight ${isSm ? 'text-base' : 'text-lg'}`}>
          KongSkole.dk
        </span>
        <span className="font-['Lato',sans-serif] font-bold text-[10px] text-[#29619F] tracking-wider uppercase leading-none">
          Matematik & Data
        </span>
      </div>
    </div>
  );
};

export const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({ onClose, initialThemeIndex, onStateChange }) => {
  const [numTasks, setNumTasks] = useState(4);
  const [showFrontpage, setShowFrontpage] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0.85);

  // Generate pages memoized
  const pages = useMemo(() => {
    const list: BookletPage[] = [];
    const taskPages: BookletPage[] = [];
    const usedThemeIndices: number[] = [];

    // 1. Generate Worksheet pages
    for (let i = 0; i < numTasks; i++) {
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
          const rotation = Math.floor(Math.random() * 30) - 15;
          const offsetX = Math.floor(Math.random() * 12) - 6;
          const offsetY = Math.floor(Math.random() * 12) - 6;

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

  // Sync state up to App.tsx if handler provided
  useEffect(() => {
    if (onStateChange) {
      onStateChange(pages);
    }
  }, [pages, onStateChange]);

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(Math.round((prev + 0.1) * 100) / 100, 1.3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(Math.round((prev - 0.1) * 100) / 100, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(0.85);
  };

  const totalPagesCount = pages.length;

  return (
    <div className="worksheet-main-container fixed inset-0 z-[90] flex flex-row overflow-hidden bg-[#f3f4f6] text-slate-800 font-['Lato',sans-serif]">
      
      {/* 🖨️ KONTROLPANEL (Sidebar - 320px fixed) */}
      <aside className="worksheet-sidebar w-[320px] min-w-[320px] max-w-[320px] bg-white border-r border-gray-200 shadow-xl h-full flex flex-col justify-between p-5 z-20 overflow-y-auto no-select">
        
        {/* Top & Settings Content */}
        <div className="flex flex-col">
          
          {/* A. Header & Tilbageknap */}
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shadow-sm cursor-pointer shrink-0"
              title="Tilbage til spillet"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-['Lato',sans-serif] leading-tight">
                Opgave-generator
              </h2>
              <p className="text-[12px] text-gray-500 font-medium leading-tight mt-0.5">
                Dataindsamling & Sortering
              </p>
            </div>
          </div>

          {/* B. Omfang / Antal sider */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[14px] font-bold text-[#374151]">
                Antal opgaveark
              </label>
              <span className="bg-blue-50 text-[#29619F] font-bold text-xs px-2.5 py-1 rounded-lg border border-blue-200">
                {numTasks} {numTasks === 1 ? 'ark' : 'ark'}
              </span>
            </div>

            <input 
              type="range" 
              min="1" 
              max="10" 
              value={numTasks} 
              onChange={(e) => setNumTasks(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#29619F]"
            />

            {/* Quick selectors */}
            <div className="flex justify-between gap-1 mt-2.5">
              {[1, 2, 4, 6, 8, 10].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setNumTasks(val)}
                  className={`text-xs font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                    numTasks === val 
                      ? 'bg-[#29619F] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* C. Indstillinger / Forside Toggle */}
          <div className="mb-5">
            <div className="text-[14px] font-bold text-[#374151] mb-2.5">
              Indstillinger
            </div>
            
            <div className="bg-gray-100 p-3.5 rounded-xl border border-gray-200 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowFrontpage(!showFrontpage)}
                className="flex items-start gap-3 text-left cursor-pointer w-full group"
              >
                <div className="mt-0.5 text-[#29619F]">
                  {showFrontpage ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-400" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#29619F] transition-colors">
                    Inkluder forside
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium leading-relaxed mt-0.5">
                    Tilføjer et flot forsideark med elevoplysninger og farvelægning.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* D. Sideoversigt Badge */}
          <div className="mb-5 bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#29619F]" />
              <span className="font-bold text-gray-700">Hæftestørrelse:</span>
            </div>
            <span className="font-bold text-[#29619F]">
              {totalPagesCount} {totalPagesCount === 1 ? 'side' : 'sider'}
              {showFrontpage && <span className="text-gray-500 font-normal ml-1">(1 forside + {numTasks} opg.)</span>}
            </span>
          </div>

        </div>

        {/* G. Handlingsknapper i bunden */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5 shrink-0">
          
          {/* Nyt indhold knap */}
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            title="Bland alle sider med nye tilfældige tal og placeringer"
          >
            <RefreshCw size={16} />
            <span>Generer nyt indhold</span>
          </button>

          {/* Primær CTA Print knap */}
          <button
            onClick={handlePrint}
            disabled={pages.length === 0}
            className="bg-[#29619F] hover:bg-[#204d80] text-white font-bold text-base py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
          >
            <Printer size={20} />
            <span>Udskriv opgaveark</span>
          </button>

        </div>

      </aside>

      {/* 📄 FORHÅNDSVISNING (Preview pane) */}
      <main className="worksheet-preview-pane flex-1 bg-[#f3f4f6] h-full overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 relative">
        
        {/* Floating Zoom & Info Controls (Screen only) */}
        <div className="floating-print-btn sticky top-2 z-30 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-3 text-xs font-bold text-gray-700 no-print select-none">
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Zoom ud"
            >
              <ZoomOut size={16} />
            </button>
            <span className="w-12 text-center text-xs font-bold text-gray-800">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Zoom ind"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="h-4 w-px bg-gray-200"></div>

          <button
            onClick={handleResetZoom}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            title="Nulstil visning (85%)"
          >
            <Maximize2 size={14} />
            <span>Tilpas</span>
          </button>

          <div className="h-4 w-px bg-gray-200"></div>

          <span className="text-gray-500 font-medium">
            {pages.length} {pages.length === 1 ? 'side' : 'sider'}
          </span>
        </div>

        {/* Scaled container for A4 pages */}
        <div 
          className="flex flex-col items-center gap-8 transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        >
          {pages.map((page, index) => (
            <div key={page.id} className="relative">
              
              {/* Page indicator on screen */}
              <div className="absolute -left-20 top-4 bg-[#29619F] text-white font-bold rounded-lg px-2.5 py-1 text-xs shadow-md border border-blue-600 z-10 hidden lg:block no-print">
                Side {index + 1}
              </div>

              {/* Printable A4 Container */}
              {page.type === 'frontpage' ? (
                <BookletFrontPage 
                  themeIndices={page.themeIndices || []} 
                  pageNumber={index + 1}
                  totalPages={pages.length}
                />
              ) : (
                <WorksheetPrintPage 
                  theme={THEMES[page.themeIndex!]} 
                  items={page.items!} 
                  pageNumber={index + 1}
                  totalPages={pages.length}
                />
              )}
            </div>
          ))}
        </div>

      </main>

    </div>
  );
};

// --- BOOKLET COVER PAGE (FORSIDE) ---
interface BookletFrontPageProps {
  themeIndices: number[];
  pageNumber?: number;
  totalPages?: number;
}

export const BookletFrontPage: React.FC<BookletFrontPageProps> = ({ themeIndices, pageNumber = 1, totalPages = 1 }) => {
  return (
    <div className="forside-page a4-page bg-white border border-slate-300 shadow-2xl rounded-sm w-[210mm] min-h-[297mm] h-[297mm] max-h-[297mm] p-[15mm] box-border relative flex flex-col justify-between text-slate-800 font-['Lato',sans-serif]">
      
      {/* Top Header */}
      <div className="w-full flex justify-between items-center pb-4 border-b-2 border-black">
        <KongSkoleLogo size="md" />
        <span className="bg-blue-50 text-[#29619F] border border-blue-200 px-3.5 py-1 rounded-full font-bold text-xs uppercase tracking-wider font-['Lato',sans-serif]">
          Matematik i Indskolingen
        </span>
      </div>

      {/* Main Center Content */}
      <div className="w-full flex flex-col items-center my-auto">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight text-center leading-tight mb-2 font-['Fredoka',sans-serif]">
          Mit store Sorteringshæfte
        </h1>
        
        <p className="text-sm font-medium text-gray-600 text-center max-w-md mb-8 font-['Lato',sans-serif]">
          Et sjovt opgavehæfte med tælleopgaver, kategorier og søjlediagrammer.
        </p>

        {/* Large coloring area in center */}
        <div className="w-full max-w-md aspect-[16/10] border-3 border-dashed border-gray-300 rounded-3xl p-6 flex flex-col justify-center items-center bg-gray-50/50 relative mb-8">
          <div className="absolute -top-3 bg-white px-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider font-['Lato',sans-serif]">
            🎨 Farvelæg forsiden!
          </div>
          
          <div className="flex flex-wrap gap-5 justify-center items-center max-h-[140px] overflow-hidden p-2">
            {themeIndices.map((themeIdx) => {
              const theme = THEMES[themeIdx];
              return theme.buckets.slice(0, 2).map((bucket, bIdx) => {
                const Icon = bucket.icon;
                return (
                  <div key={`${theme.id}-${bIdx}`} className="p-3 border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                    <Icon size={36} />
                  </div>
                );
              });
            })}
          </div>
        </div>

        {/* Name and class fields */}
        <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-700 text-xs w-14 font-['Lato',sans-serif]">Navn:</span>
            <div className="flex-grow border-b-2 border-dotted border-gray-400 h-5"></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-700 text-xs w-14 font-['Lato',sans-serif]">Klasse:</span>
            <div className="flex-grow border-b-2 border-dotted border-gray-400 h-5"></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-700 text-xs w-14 font-['Lato',sans-serif]">Dato:</span>
            <div className="flex-grow border-b-2 border-dotted border-gray-400 h-5"></div>
          </div>
        </div>

      </div>

      {/* Solid 2px Black Footer */}
      <div className="w-full border-t-2 border-black pt-3 flex justify-between items-center text-[13px] font-bold text-black font-['Lato',sans-serif]">
        <span>KongSkole.dk</span>
        <span>Elevmateriale ©</span>
      </div>

    </div>
  );
};

// --- SINGLE WORKSHEET PRINT PAGE ---
interface WorksheetPrintPageProps {
  theme: GameTheme;
  items: WorksheetItem[];
  pageNumber?: number;
  totalPages?: number;
}

export const WorksheetPrintPage: React.FC<WorksheetPrintPageProps> = ({ 
  theme, 
  items, 
  pageNumber = 1, 
  totalPages = 1 
}) => {
  const rows = Array.from({ length: 10 }, (_, i) => 10 - i);

  return (
    <div className="a4-page bg-white border border-slate-300 shadow-2xl rounded-sm w-[210mm] min-h-[297mm] h-[297mm] max-h-[297mm] p-[15mm] box-border relative flex flex-col justify-between text-slate-800 font-['Lato',sans-serif]">
      
      {/* 1. Arkets Header */}
      <div className="w-full flex justify-between items-center pb-3 border-b-2 border-black mb-3 shrink-0">
        {/* Venstre side: Appens logo og KongSkole.dk badge */}
        <KongSkoleLogo size="md" />

        {/* Højre side: Hvad skal jeg gøre? + Instruktion */}
        <div className="text-right">
          <div className="text-[15px] font-bold text-black font-['Lato',sans-serif] leading-tight">
            Hvad skal jeg gøre?
          </div>
          <div className="text-[15px] font-medium text-black font-['Lato',sans-serif] leading-tight mt-0.5">
            Tæl tingene i kassen, skriv antallet og farvelæg diagrammet.
          </div>
        </div>
      </div>

      {/* 2. Opgaveindhold (Mix box + Count boxes and Grid side-by-side) */}
      <div className="grid grid-cols-12 gap-6 items-stretch flex-grow my-auto">
        
        {/* LEFT COLUMN: Mix box + Count boxes moved up */}
        <div className="col-span-7 flex flex-col justify-start gap-4">
          
          {/* Mix Box with spacious distributed items */}
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-['Lato',sans-serif]">
              Blandingskassen (Tæl tingene)
            </h3>
            <div className="border-3 border-dashed border-gray-300 rounded-2xl p-5 bg-gray-50/80 min-h-[340px] flex flex-col justify-center items-center">
              
              {/* 5x4 Grid layout for clean spacious item placement */}
              <div className="grid grid-cols-5 gap-4 w-full h-full content-center items-center justify-items-center">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-white border-2 border-gray-200 rounded-full p-2 flex items-center justify-center w-12 h-12 shadow-xs"
                      style={{
                        transform: `rotate(${item.rotation}deg) translate(${item.offsetX}px, ${item.offsetY}px)`
                      }}
                    >
                      <Icon size={30} />
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Count Boxes - moved up directly under mix box */}
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-['Lato',sans-serif]">
              Skriv antal
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {theme.buckets.map((bucket) => {
                const Icon = bucket.icon;
                return (
                  <div key={bucket.type} className="border-2 border-gray-200 rounded-xl p-2 flex flex-col items-center bg-white shadow-xs">
                    <Icon size={26} />
                    <span className="text-[11px] font-bold text-gray-700 mt-1 truncate w-full text-center font-['Lato',sans-serif]">
                      {bucket.label}
                    </span>
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-400 mt-1.5 flex items-center justify-center bg-gray-50 text-sm font-bold text-gray-400">
                      {/* Empty circle for student count */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Stacked Bar Chart - Taller and centered in its column */}
        <div className="col-span-5 flex flex-col items-center justify-center border-l-2 border-gray-200 pl-4 h-full">
          <div className="w-full flex flex-col items-center justify-center py-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3.5 w-full text-center font-['Lato',sans-serif]">
              Tegn diagrammet
            </h3>
            
            {/* Grid */}
            <div className="flex flex-col items-center w-full">
              {rows.map((rowNum) => (
                <div key={rowNum} className="flex items-center w-full justify-center">
                  <span className="w-6 text-right mr-2 font-bold text-gray-600 text-xs font-['Lato',sans-serif]">
                    {rowNum}
                  </span>
                  {theme.buckets.map((bucket, idx) => (
                    <div
                      key={bucket.type}
                      className={`w-11 h-[27px] border-b border-r border-gray-400 bg-white
                        ${rowNum === 10 ? 'border-t' : ''}
                        ${idx === 0 ? 'border-l' : ''}
                      `}
                    />
                  ))}
                </div>
              ))}
              
              {/* X Axis Icons */}
              <div className="flex items-center justify-center mt-3 pl-6 w-full">
                {theme.buckets.map((bucket) => {
                  const Icon = bucket.icon;
                  return (
                    <div key={bucket.type} className="w-11 flex flex-col items-center">
                      <Icon size={24} />
                      <span className="text-[10px] font-bold text-gray-800 mt-1 truncate w-full text-center font-['Lato',sans-serif]">
                        {bucket.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Arkets Footer: Solid 2px sort skillelinje */}
      <div className="w-full border-t-2 border-black pt-3 flex justify-between items-center text-[13px] font-bold text-black font-['Lato',sans-serif] shrink-0">
        <span>Side {pageNumber} af {totalPages}</span>
        <span>Dataindsamling og sortering © KongSkole.dk</span>
      </div>

    </div>
  );
};
