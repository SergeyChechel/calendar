import initialState from '../store/initialState';

const labelsReducer = (state = initialState, action) => {
  switch (action.type) {

    case 'UPDATE_LABELS':
      return action.payload;
      
    case 'ADD_LABEL':
      const { task, label } = action.payload;
      return {
        ...state,
        [task.day]: [...(state[task.day] || []), label]
      };

    case 'EDIT_LABEL':
      const findIndexById = (array, id) => {
        return array.findIndex(item => item.id === id);
      };
      const { day, updatedLabel } = action.payload;
      const dayLabels = state[day];
      const index = findIndexById(dayLabels, updatedLabel.id);
      dayLabels[index] = updatedLabel;

      return {
        ...state,
        [day]: dayLabels
      };

    case 'DELETE_LABEL':
      const { labelsDay, labelId } = action.payload;
      
      return {
        ...state,
        [labelsDay]: state[labelsDay].filter(item => item.id !== labelId)
      };

    case 'MOVE_LABELS': {
      const { taskId, sourceDay, destDay } = action.payload;
      if(!state[sourceDay]) return state;
      const newLabelsOfSourceDay = state[sourceDay].filter(item => item.taskId != taskId) || [];
      const movedLabels = state[sourceDay].filter(item => item.taskId == taskId) || [];
      movedLabels.forEach(label => {
        const splitId = label.id.split('-', 2);
        label.id = label.id.replace(splitId[0], destDay);
        const splitTaskId = label.taskId.split('-', 2);
        label.taskId = label.taskId.replace(splitTaskId[0], destDay);
      });
      const newLabelsOfDestDay = [...(state[destDay] || []), ...movedLabels]
      
      return {
        ...state,
        [sourceDay]: newLabelsOfSourceDay ,
        [destDay]: newLabelsOfDestDay,
      };
    }

    default:
      return state;
  }
};

export default labelsReducer;
  