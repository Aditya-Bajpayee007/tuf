import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { startOfMonth, isSameMonth, isSameDay, isWithinInterval, format } from 'date-fns';

const gridVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

export default function CalendarGrid({ monthDays, currentMonth, selection, handleDateClick, theme, slideCount, direction }) {
  return (
    <div className="relative h-[300px] md:min-h-screen">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={`slide-${slideCount}`}
          custom={direction}
          variants={gridVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute inset-0 grid grid-cols-7 gap-y-4 h-max"
        >
          {monthDays.map((day) => {
            const monthStart = startOfMonth(currentMonth);
            const isCurrentMonthDay = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const isSelectedStart = selection.start && isSameDay(day, selection.start);
            const isSelectedEnd = selection.end && isSameDay(day, selection.end);
            const isWithin =
              selection.start &&
              selection.end &&
              isWithinInterval(day, { start: selection.start, end: selection.end });
            const dayOfWeek = day.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const selectedStyle = isSelectedStart || isSelectedEnd;

            return (
              <div key={day.toISOString()} className="flex justify-center">
                <button
                  onClick={() => handleDateClick(day)}
                  className={[
                    'relative h-10 w-10 md:h-11 md:w-11 rounded-full text-[15px] font-semibold transition-all duration-150',
                    isCurrentMonthDay ? 'cursor-pointer' : 'cursor-default',
                    selectedStyle
                      ? `${theme.overlay} text-white shadow-lg scale-110`
                      : isWithin
                      ? 'bg-sky-50 text-sky-600'
                      : isToday
                      ? 'border-2 border-neutral-200 bg-neutral-100 text-neutral-900'
                      : isCurrentMonthDay
                      ? isWeekend
                        ? theme.dateAccent
                        : 'text-neutral-800 hover:bg-neutral-100'
                      : 'text-neutral-300',
                  ].join(' ')}
                >
                  <span className="relative z-10">{format(day, 'd')}</span>

                  {isWithin && !selectedStyle && (
                    <span className="absolute inset-0 rounded-full bg-sky-50" />
                  )}
                </button>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
