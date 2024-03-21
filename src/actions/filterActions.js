
export const FILTER_TASKS_BY_TEXT = 'FILTER_TASKS_BY_TEXT';
export const FILTER_TASKS_BY_LABEL = 'FILTER_TASKS_BY_LABEL';
export const UPDATE_FILTERS = 'UPDATE_FILTERS';

export const updateFilters = (filters) => ({
  type: UPDATE_FILTERS,
  payload: filters
});

export const filterTasksByText = (text) => ({
  type: FILTER_TASKS_BY_TEXT,
  payload: text
});

export const filterTasksByLabel = (labelsColor) => ({
  type: FILTER_TASKS_BY_LABEL,
  payload: labelsColor
});
