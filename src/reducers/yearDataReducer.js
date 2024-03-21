
import { PUT_MONTH_DATA, EXTRACT_MONTH_DATA } from '../actions/yearDataActions';
import initialState from '../store/initialState';

const yaearDataReducer = (state = initialState, action) => {

  switch (action.type) {
    
    case PUT_MONTH_DATA: 
      const { month, monthData } = action.payload;
      // const c = [...state.slice(0, month), monthData, ...state.slice(month + 1)];
      // debugger;
      return [...state.slice(0, month), monthData, ...state.slice(month + 1)];

    case EXTRACT_MONTH_DATA:
      return state[action.payload];
    
    default:
      return state;
  }
  
};

export default yaearDataReducer;
