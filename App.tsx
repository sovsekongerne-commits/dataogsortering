import React, { useState, useEffect, useCallback, useRef } from 'react';
import { THEMES, TOTAL_ITEMS_TO_SPAWN } from './constants';
import { BucketData, DraggableObject, ItemType, QuizResponse } from './types';
import { Bucket } from './components/Bucket';
import { DraggableItem } from './components/DraggableItem';
import { LiveChart } from './components/LiveChart';
import { generateQuizQuestion } from './services/geminiService';
import { Trophy, RefreshCcw, Loader2, Sparkles, AlertCircle, Palette } from 'lucide-react';
import { gemMedalje, gemPoint, SPIL_NAVN } from './utils/cookieHelpers';

export default function App() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  // Initialize buckets based on the current theme (defaulting to 0/Classic initially)
  const [buckets, setBuckets] = useState<BucketData[]>(
    THEMES[0].buckets.map(b => ({ ...b, count: 0 }))
  );
  const [items, setItems] = useState<DraggableObject[]>([]);
  const [dragOverBucket, setDragOverBucket] = useState<ItemType | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'loading_quiz' | 'quiz' | 'finished'>('playing');
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  // We need a ref to track if it's the very first load to avoid double resets in strict mode
  const initialized = useRef(false);

  // Initialize Items on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      resetGame(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = (randomizeTheme = true) => {
    let newIndex = currentThemeIndex;
    
    if (randomizeTheme) {
        // Pick a theme different from the current one to ensure variety
        let nextIndex = Math.floor(Math.random() * THEMES.length);
        if (nextIndex === currentThemeIndex && THEMES.length > 1) {
            nextIndex = (nextIndex + 1) % THEMES.length;
        }
        newIndex = nextIndex;
        setCurrentThemeIndex(newIndex);
    }

    const theme = THEMES[newIndex];
    setBuckets(theme.buckets.map(b => ({ ...b, count: 0 })));
    setGameState('playing');
    setQuiz(null);
    setQuizFeedback(null);
    setSelectedOption(null);
    setMistakes(0);

    const newItems: DraggableObject[] = [];
    const availableTypes = theme.buckets.map(b => b.type);
    
    // Create random assortment
    for (let i = 0; i < TOTAL_ITEMS_TO_SPAWN; i++) {
      const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)] as ItemType;
      newItems.push({
        id: `item-${i}-${Date.now()}`,
        type: randomType
      });
    }
    setItems(newItems);
  };

  const handleDrop = useCallback((droppedType: ItemType, targetBucketType: ItemType) => {
    // We need to use the current state of buckets to validate the drop
    // Since we are inside a useCallback, we need to add buckets to the dependency array
    // or use the functional update pattern carefully. 
    // However, to fix the "moveSuccessful" bug and track mistakes, 
    // it is cleaner to access the current buckets state.
    // But since we can't easily access 'buckets' state inside useCallback without adding it to deps (causing re-renders),
    // we will use the functional update for setBuckets to derive success, 
    // BUT we need to know if it succeeded to update Items and Mistakes.
    
    // To solve this cleanly: We will perform the logic check using the functional update,
    // but we'll need to trigger the side effects (items/mistakes) based on the result.
    // Actually, the simplest fix for this app is to just include 'buckets' in the dependency array.
    // It causes re-renders of DraggableItems on every drop, but for a small app, it's negligible.
    
    setBuckets(currentBuckets => {
        const newBuckets = [...currentBuckets];
        const targetIndex = newBuckets.findIndex(b => b.type === targetBucketType);
        const correctBucketIndex = newBuckets.findIndex(b => b.type === droppedType);

        if (targetIndex === -1 || correctBucketIndex === -1) return currentBuckets;

        const targetBucket = newBuckets[targetIndex];
        const correctBucket = newBuckets[correctBucketIndex];
        
        let isSuccess = false;

        // 1. Correct drop
        if (droppedType === targetBucketType) {
            newBuckets[targetIndex] = { ...targetBucket, count: targetBucket.count + 1 };
            isSuccess = true;
        }
        // 2. Swap empty
        else if (targetBucket.count === 0 && correctBucket.count === 0) {
            newBuckets[targetIndex] = { ...correctBucket, count: 1 };
            newBuckets[correctBucketIndex] = { ...targetBucket };
            isSuccess = true;
        }

        if (isSuccess) {
            // Schedule item removal
            setItems(prev => {
                const index = prev.findIndex(item => item.type === droppedType);
                if (index === -1) return prev;
                const next = [...prev];
                next.splice(index, 1);
                return next;
            });
            return newBuckets;
        } else {
            // Mistake made
            setMistakes(m => m + 1);
            return currentBuckets;
        }
    });
    
    setDragOverBucket(null);
  }, []);

  const triggerQuiz = async () => {
    setGameState('loading_quiz');
  };

  // Watch for game completion
  useEffect(() => {
    if (items.length === 0 && gameState === 'playing' && buckets.some(b => b.count > 0)) {
        // Only trigger if we have actually started playing (buckets have counts)
        setGameState('loading_quiz');
        
        // Award Points and Medals
        gemPoint(1, SPIL_NAVN);
        
        gemMedalje(SPIL_NAVN, 'Sorterings-lærling', 'Gennemfør et spil for første gang');
        
        if (mistakes === 0) {
            gemMedalje(SPIL_NAVN, 'Fejlfri Sortering', 'Sorter alle elementer uden at lave fejl i et spil');
        }

        generateQuizQuestion(buckets).then(q => {
          setQuiz(q);
          setGameState('quiz');
        });
    }
  }, [items.length, gameState, buckets, mistakes]);

  const handleQuizAnswer = (option: string) => {
    if (quizFeedback) return; // Prevent multiple clicks

    setSelectedOption(option);
    if (option === quiz?.correctAnswer) {
      setQuizFeedback('correct');
      gemMedalje(SPIL_NAVN, 'Datamester', 'Svar rigtigt på en quiz');
    } else {
      setQuizFeedback('incorrect');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto gap-6 no-select">
      
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-4 border-indigo-50">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight flex flex-wrap items-center gap-2">
            Dataindsamling og sortering
            <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest hidden sm:inline-block">
              {THEMES[currentThemeIndex].name}
            </span>
          </h1>
          <p className="text-gray-500 font-medium hidden sm:block">Træk tingene ned i kasserne for at lave en sortering!</p>
        </div>
        <button 
          onClick={() => resetGame(true)}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors border-2 border-indigo-200"
        >
          <RefreshCcw size={20} />
          <span className="hidden sm:inline">Nyt Spil</span>
        </button>
      </header>

      {/* Main Content Grid */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Game Area (Sorting + Items) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Item Pool (The "Table") */}
          <div className="bg-white rounded-3xl p-6 shadow-lg min-h-[200px] lg:min-h-[300px] border-4 border-dashed border-gray-200 relative overflow-hidden">
            
            {gameState === 'playing' ? (
              <>
                 <div className="absolute top-4 left-4 text-gray-300 font-bold uppercase text-xs tracking-wider pointer-events-none flex items-center gap-2">
                  <Palette size={14} />
                  {THEMES[currentThemeIndex].name}
                </div>
                <div className="flex flex-wrap gap-4 justify-center items-center h-full content-center pt-8">
                  {items.map((item) => {
                     // Find config for this item type to render correct icon/color
                     const config = buckets.find(b => b.type === item.type);
                     if (!config) return null;
                     return <DraggableItem key={item.id} item={item} bucketConfig={config} />;
                  })}
                  {items.length === 0 && (
                     <div className="text-center animate-pulse">
                        <Trophy size={64} className="mx-auto text-yellow-400 mb-2" />
                        <h3 className="text-2xl font-bold text-gray-400">Godt gået!</h3>
                     </div>
                  )}
                </div>
              </>
            ) : gameState === 'loading_quiz' ? (
              <div className="h-full flex flex-col items-center justify-center text-indigo-500">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="text-xl font-bold">Laver opgave...</p>
              </div>
            ) : (
               /* Quiz View */
               <div className="h-full flex flex-col items-center justify-center w-full max-w-lg mx-auto">
                  <div className="bg-indigo-50 p-6 rounded-2xl w-full text-center">
                    <div className="inline-block bg-indigo-100 p-3 rounded-full mb-4">
                      <Sparkles className="text-indigo-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-indigo-900 mb-6">{quiz?.question}</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {quiz?.options.map((opt, idx) => {
                        let btnClass = "bg-white hover:bg-indigo-50 border-2 border-indigo-100 text-indigo-800";
                        if (selectedOption === opt) {
                          if (quizFeedback === 'correct') btnClass = "bg-green-100 border-green-500 text-green-800";
                          if (quizFeedback === 'incorrect') btnClass = "bg-red-100 border-red-500 text-red-800";
                        } else if (quizFeedback === 'correct' && opt === quiz.correctAnswer) {
                             // Highlight correct answer if user picked wrong one (optional, but good for learning)
                             btnClass = "bg-green-100 border-green-500 text-green-800 opacity-50"; 
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(opt)}
                            disabled={!!quizFeedback}
                            className={`p-4 rounded-xl font-bold text-lg transition-all shadow-sm ${btnClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizFeedback === 'correct' && (
                       <div className="mt-6 animate-bounce-in">
                         <p className="text-green-600 font-bold text-xl mb-4">Rigtigt svar! Flot klaret! 🎉</p>
                         <button 
                           onClick={() => resetGame(true)} 
                           className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
                         >
                           Nyt Spil
                         </button>
                       </div>
                    )}
                     {quizFeedback === 'incorrect' && (
                       <div className="mt-6 animate-shake">
                         <p className="text-red-500 font-bold text-lg flex items-center justify-center gap-2">
                            <AlertCircle size={20}/> Det var ikke helt rigtigt. Prøv igen!
                         </p>
                         <button 
                           onClick={() => { setSelectedOption(null); setQuizFeedback(null); }}
                           className="mt-2 text-indigo-500 underline font-bold"
                         >
                           Prøv igen
                         </button>
                       </div>
                    )}
                  </div>
               </div>
            )}
          </div>

          {/* Buckets Zone */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
            {buckets.map((bucket) => (
              <Bucket
                key={bucket.type}
                data={bucket}
                onDrop={handleDrop}
                isOver={dragOverBucket === bucket.type}
                onDragOver={(e) => {
                  e.preventDefault();
                  // For the "dragOver" visual state, we need to know if this bucket *can* accept the item
                  // Since we now allow swapping, any empty bucket is valid.
                  // However, for Simplicity in UI, we just highlight it.
                  setDragOverBucket(bucket.type);
                }}
                onDragLeave={() => setDragOverBucket(null)}
              />
            ))}
          </div>

        </div>

        {/* RIGHT: Live Chart */}
        <div className="lg:col-span-4 h-[300px] lg:h-auto sticky top-4">
           <LiveChart data={buckets} />
        </div>

      </div>
    </div>
  );
}