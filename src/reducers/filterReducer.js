
import { FILTER_TASKS_BY_TEXT, FILTER_TASKS_BY_LABEL } from '../actions/filterActions';
import initialState from '../store/initialState';

const filterReducer = (state = initialState, action) => {

  switch (action.type) {
    case FILTER_TASKS_BY_TEXT:

      return {
        ...state,
        searchText: action.payload
      };

    case FILTER_TASKS_BY_LABEL:
      return {
        ...state,
        labelsColor: action.payload
      };
    
    default:
      return state;
  }
};

export default filterReducer;
