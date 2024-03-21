// action types
export const ADD_TASK = 'ADD_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const MOVE_TASK = 'MOVE_TASK';
export const REORDER_TASK = 'REORDER_TASK';
export const DELETE_TASK = 'DELETE_TASK'; 
export const UPDATE_TASKS = 'UPDATE_TASKS'; 


export const updateTasks = (tasks) => {
  return {
    type: UPDATE_TASKS,
    payload: tasks
  };
};

export const addTask = (day, taskName, taskDescr, idOftask) => {
  return {
    type: ADD_TASK,
    payload: {
      day,
      name: taskName,
      descr: taskDescr,
      id: idOftask
    }
  };
};

export const editTask = (taskId, taskName, taskDescr) => {
  return {
    type: EDIT_TASK,
    payload: {
      taskId,
      taskName,
      taskDescr
    }
  };
};

// Создание действия для перемещения задачи
export const moveTask = (taskId, sourceDay, destDay) => ({
  type: MOVE_TASK,
  payload: {
    taskId,
    sourceDay,
    destDay
  }
});

export const reorderTask = (dayIndex, sourceDay, dropTaskIndex, draggedTaskIndex) => {
  return {
    type: REORDER_TASK,
    payload: {
      dayIndex,
      sourceDay,
      dropTaskIndex,
      draggedTaskIndex
    }
  };
};

export const deleteTask = (day, taskId) => ({
  type: DELETE_TASK,
  payload: {
    day,
    taskId
  }
});
