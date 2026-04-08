import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parse } from 'date-fns';
import { getMonthKey, getRangeKey } from './calendarUtils';

function NotesColumn({ currentMonth, selection, theme, notesData, setNotesData }) {
  const monthKey = getMonthKey(currentMonth);
  const rangeKey = getRangeKey(selection.start, selection.end);

  const monthValue = notesData[monthKey] ?? '';
  const rangeValue = rangeKey ? notesData[rangeKey] ?? '' : '';

  const overlappingNotes = useMemo(() => {
    if (!selection.start) return [];

    return Object.entries(notesData).filter(([key, text]) => {
      if (!text.trim()) return false;
      if (!key.includes('-')) return false;
      if (key === rangeKey) return false;

      const parts = key.split('_');
      const start = parse(parts[0], 'yyyy-MM-dd', new Date());
      const end = parts[1] ? parse(parts[1], 'yyyy-MM-dd', new Date()) : start;
      const selStart = selection.start;
      const selEnd = selection.end || selection.start;

      return selStart <= end && selEnd >= start;
    });
  }, [notesData, rangeKey, selection.end, selection.start]);

  return (
    <div className="w-full md:w-[31%] shrink-0 pt-2">
      <div className="flex items-center gap-2 mb-3">
        <Edit2 size={16} className="text-neutral-700" />
        <div className="text-[11px] font-semibold tracking-[0.22em] uppercase text-neutral-700">
          Notes
        </div>
      </div>

      <div className="relative min-h-[250px]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0, transparent 30px, #e5e7eb 30px, #e5e7eb 31px)',
          }}
        />
        <textarea
          value={monthValue}
          onChange={(e) => setNotesData((prev) => ({ ...prev, [monthKey]: e.target.value }))}
          placeholder={`Jot down things for ${format(currentMonth, 'MMM')}...`}
          className="relative z-10 w-full h-[250px] bg-transparent outline-none resize-none text-sm text-neutral-600 leading-[31px] pt-[2px] px-1 placeholder:text-neutral-400"
          spellCheck="false"
        />
      </div>

      {selection.start && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon size={16} className={theme.dateAccent} />
            <div className={`text-[11px] font-semibold tracking-[0.22em] uppercase ${theme.dateAccent}`}>
              Selection Notes
            </div>
          </div>
          <div className="text-xs text-neutral-400 mb-3 font-medium">
            {format(selection.start, 'MMM d')}
            {selection.end ? ` - ${format(selection.end, 'MMM d')}` : ''}
          </div>
          <div className="relative min-h-[170px]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, transparent 0, transparent 30px, #dbeafe 30px, #dbeafe 31px)',
              }}
            />
            <textarea
              value={rangeValue}
              onChange={(e) => {
                if (!rangeKey) return;
                setNotesData((prev) => ({ ...prev, [rangeKey]: e.target.value }));
              }}
              placeholder="Range specific notes..."
              className="relative z-10 w-full h-[170px] bg-transparent outline-none resize-none text-sm text-neutral-700 leading-[31px] pt-[2px] px-1 placeholder:text-neutral-400"
              spellCheck="false"
            />
          </div>

          {overlappingNotes.length > 0 && (
            <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-2">
                Overlapping Notes
              </div>
              <div className="space-y-2">
                {overlappingNotes.map(([key, text]) => (
                  <div key={key}>
                    <div className={`text-[10px] font-semibold ${theme.dateAccent}`}>
                      {key.replace('_', ' to ')}
                    </div>
                    <div className="text-sm text-neutral-600 truncate">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default NotesColumn;
