
import { UPDATE_TASKS, ADD_TASK, EDIT_TASK, MOVE_TASK, REORDER_TASK, DELETE_TASK } from '../actions/taskActions';
import { IMPORT_CALENDAR, EXPORT_CALENDAR } from '../actions/calendarActions';
import initialState from '../store/initialState';


const calendarReducer = (state = initialState, action) => {

  function moveElement(array, fromIndex, toIndex) {
    const elementToMove = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, elementToMove);
    return array;
  }

  switch (action.type) {

    case UPDATE_TASKS:
      // debugger;
      return action.payload

    case ADD_TASK:
      const { day, name, descr, id } = action.payload;
      const task = {day, name, descr, id};
      // debugger;
      return {
        ...state,
        [day]: [...(state[day] || []), task]
      };

    case EDIT_TASK: {
      const { taskId: id, taskName: name, taskDescr: descr } = action.payload;
      const day = id.split('-')[0];
      const updatedTask = { day, name, descr, id };
      
      const tasks = state[day];
      const index = tasks.findIndex(item => item.id === id);
      let newArray;
      if (index !== -1) {
        newArray = [...tasks];
        newArray[index] = updatedTask;
      }
      return {
        ...state,
        [day]: newArray
      };
    }

    case DELETE_TASK: {
      const { day, taskId } = action.payload;
      return {
        ...state,
        [day]: [...((state[day] || []).filter(task => task.id !== taskId))]
      };
    }

    case MOVE_TASK:
        const { taskId, sourceDay, destDay } = action.payload;
        if(sourceDay == destDay || !state[sourceDay]) return state; 

        const movedTask = {...(state[sourceDay].find(task => task.id == taskId))};
        const newId = movedTask.id.replace(`${sourceDay}-`, `${destDay}-`);
        movedTask.id = newId;
        movedTask.day = destDay;

        const sourceDayTasks = [...(state[sourceDay] || [])];
        const destDayTasks = [...(state[destDay] || [])];

        const sourceDayTasksNew = sourceDayTasks.filter(task => task.id != taskId);
        const destDayTasksNew = [...destDayTasks, movedTask];

        return {
            ...state,
            [sourceDay]: sourceDayTasksNew,
            [destDay]: destDayTasksNew,
        };

    case REORDER_TASK: {
        const { dayIndex: day, sourceDay, dropTaskIndex: newIndex, draggedTaskIndex: oldIndex } = action.payload;
        if(sourceDay != day) return state; 
        return {
          ...state,
          [day]: moveElement((state[day] || []), oldIndex, newIndex)
        };
    }

    case IMPORT_CALENDAR:
        return {
            ...state,
            // Обновление состояния календаря после импорта данных
            data: action.payload,
        };
        
    case EXPORT_CALENDAR:
      // Экспорт календаря в файл
      const { data } = state;
      const jsonData = JSON.stringify(data);
      // Процесс экспорта данных календаря в файл
      // Например, с использованием библиотеки FileSaver.js
      // Файл можно сохранить как JSON или в других форматах
      // Пример:
      // saveAs(new Blob([jsonData], { type: 'application/json' }), 'calendar.json');
      return state;

    default:
      return state;
  }
};

export default calendarReducer;




