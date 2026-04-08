import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { MONTH_THEMES } from './calendarThemes';
import NotesColumn from './NotesColumn';
import HeroHeader from './HeroHeader';
import CalendarGrid from './CalendarGrid';

const now = new Date();
export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selection, setSelection] = useState({ start: null, end: null });
  const [direction, setDirection] = useState(0);
  
  // Independent keys for separating scroll (flip) vs click (slide) animations
  const [flipCount, setFlipCount] = useState(0); 
  const [slideCount, setSlideCount] = useState(0); 
  
  const isAnimating = useRef(false);

  const [notesData, setNotesData] = useState(() => {
    try {
      const saved = localStorage.getItem('calendar-master-notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('calendar-master-notes', JSON.stringify(notesData));
    } catch {
      // ignore storage errors
    }
  }, [notesData]);

  // Handle global scroll for 3D Flipping
  useEffect(() => {
    const handleWheel = (e) => {
      if (isAnimating.current) return;

      if (Math.abs(e.deltaY) > 40) {
        isAnimating.current = true;
        
        const delta = e.deltaY > 0 ? 1 : -1;
        setDirection(delta);
        
        // Trigger ONLY the flip animation
        setFlipCount((prev) => prev + 1); 
        setCurrentMonth((prev) => (delta > 0 ? addMonths(prev, 1) : subMonths(prev, 1)));

        setTimeout(() => {
          isAnimating.current = false;
        }, 700);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const theme = MONTH_THEMES[currentMonth.getMonth()];

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });

    const days = [];
    let day = gridStart;

    while (day <= gridEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const handleDateClick = (day) => {
    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: day, end: null });
      return;
    }

    if (day < selection.start) {
      setSelection({ start: day, end: null });
      return;
    }

    setSelection({ ...selection, end: day });
  };

  // 3D Flip Variants (for Mouse Scroll)
  const pageFlipVariants = {
    enter: (direction) => ({
      rotateX: direction > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: 'top center',
    }),
    center: {
      rotateX: 0,
      opacity: 1,
      transformOrigin: 'top center',
    },
    exit: (direction) => ({
      rotateX: direction > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: 'top center',
    }),
  };

  // Button Click Handler (triggers horizontal slide only)
  const moveMonth = (delta) => {
    setDirection(delta);
    // Trigger ONLY the slide animation
    setSlideCount((prev) => prev + 1); 
    setCurrentMonth((prev) => (delta > 0 ? addMonths(prev, 1) : subMonths(prev, 1)));
  };

  const today = () => {
    setDirection(0);
    setSlideCount((prev) => prev + 1); // Slide when jumping to today
    setCurrentMonth(new Date());
  };

  const clearSelection = () => setSelection({ start: null, end: null });

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4 md:p-8" style={{ perspective: '160px' }}>
      <div className="relative w-full max-w-[1240px] bg-white rounded-[34px] shadow-[0_30px_90px_rgba(0,0,0,0.86)]">
        
        {/* Fixed Top Bindings */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-50 flex justify-between px-8 md:px-14 -translate-y-1/2">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="h-5 w-[4px] rounded-full bg-neutral-800 shadow-sm"
              style={{ opacity: 0.9 }}
            />
          ))}
        </div>

        {/* OUTER ANIMATION: Controls the 3D scroll flip */}
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={`flip-${flipCount}`} // Only changes on scroll
            custom={direction}
            variants={pageFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="w-full bg-white rounded-[34px] overflow-hidden"
          >
            <HeroHeader currentMonth={currentMonth} theme={theme} />

            <div className="px-6 md:px-10 pb-8 md:pb-10 pt-8">
              <div className="flex flex-col md:flex-row gap-10 md:gap-14">
                <NotesColumn
                  currentMonth={currentMonth}
                  selection={selection}
                  theme={theme}
                  notesData={notesData}
                  setNotesData={setNotesData}
                />

                <div className="w-full md:w-[69%] pt-2">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveMonth(-1)}
                        className="h-9 w-9 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition"
                        aria-label="Previous month"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => moveMonth(1)}
                        className="h-9 w-9 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition"
                        aria-label="Next month"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={today}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600 hover:bg-neutral-200 transition"
                      >
                        <CalendarIcon size={14} />
                        Today
                      </button>
                      {(selection.start || selection.end) && (
                        <button
                          onClick={clearSelection}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500 hover:bg-rose-50 transition"
                        >
                          <RotateCcw size={14} />
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-5">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                      <div
                        key={d}
                        className={`text-center text-[12px] font-semibold tracking-[0.18em] uppercase ${i >= 5 ? theme.accent : 'text-neutral-700'}`}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <CalendarGrid
                    monthDays={monthDays}
                    currentMonth={currentMonth}
                    selection={selection}
                    handleDateClick={handleDateClick}
                    theme={theme}
                    slideCount={slideCount}
                    direction={direction}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
