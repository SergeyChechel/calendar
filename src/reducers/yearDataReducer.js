
import { PUT_MONTH_DATA, EXTRACT_MONTH_DATA } from '../actions/yearDataActions';
import initialState from '../store/initialState';

const yaearDataReducer = (state = initialState, action) => {

  switch (action.type) {
    
    case PUT_MONTH_DATA: 
      const { currentYear, month, monthData } = action.payload;
      let currentYearData;

      if(!state[currentYear]) {
        currentYearData = Array.from({ length: 12 }).map(() => ({}));
        currentYearData[month] = monthData;
      } else {
        currentYearData = [...state[currentYear].slice(0, month), monthData, ...state[currentYear].slice(month + 1)]
      }

      return {
        ...state,
        [currentYear]: currentYearData
      };

    case EXTRACT_MONTH_DATA:
      return state[action.payload];
    
    default:
      return state;
  }
  
};

export default yaearDataReducer;
