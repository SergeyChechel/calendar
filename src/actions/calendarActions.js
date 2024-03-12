
export const IMPORT_CALENDAR = 'IMPORT_CALENDAR';
export const EXPORT_CALENDAR = 'EXPORT_CALENDAR';

export const importCalendar = (data) => ({
  type: IMPORT_CALENDAR,
  payload: data,
});

export const exportCalendar = () => ({
  type: EXPORT_CALENDAR,
});
