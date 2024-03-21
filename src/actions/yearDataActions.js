
export const PUT_MONTH_DATA = 'PUT_MONTH_DATA';
export const EXTRACT_MONTH_DATA = 'EXTRACT_MONTH_DATA';

export const putMonthData = (currentYear, month, monthData) => ({
  type: PUT_MONTH_DATA,
  payload: { currentYear, month, monthData }
});

export const extractMonthData = (month) => ({
  type: EXTRACT_MONTH_DATA,
  payload: month
});
