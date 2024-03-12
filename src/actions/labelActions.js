
// Экшен для добавления новой метки
export const addLabel = (task, label) => {
    return {
      type: 'ADD_LABEL',
      payload: {
        task, 
        label
      }
    };
  };
  
  // Экшен для редактирования существующей метки
  export const editLabel = (day, updatedLabel) => {
    return {
      type: 'EDIT_LABEL',
      payload: { day, updatedLabel }
    };
  };

  export const deleteLabel = (labelsDay, labelId) => {
    return {
      type: 'DELETE_LABEL',
      payload: { labelsDay, labelId }
    };
  };

  export const moveLabels = (taskId, sourceDay, destDay) => {
    return {
      type: 'MOVE_LABELS',
      payload: { taskId, sourceDay, destDay }
    };
  };
  