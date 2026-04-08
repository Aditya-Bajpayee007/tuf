import { format } from 'date-fns';

export const getMonthKey = (date) => format(date, 'yyyy-MM');

export const getRangeKey = (start, end) => {
  if (!start) return null;
  return end ? `${format(start, 'yyyy-MM-dd')}_${format(end, 'yyyy-MM-dd')}` : format(start, 'yyyy-MM-dd');
};

export default { getMonthKey, getRangeKey };
