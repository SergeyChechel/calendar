import { combineReducers } from 'redux';
import calendarReducer from './calendarReducer';
import filterReducer from './filterReducer';
import labelsReducer from './labelsReducer';
import yearDataReducer from './yearDataReducer';

// Комбинируем редюсеры с помощью функции combineReducers
const rootReducer = combineReducers({
    tasks: calendarReducer,
    filters: filterReducer,
    labels: labelsReducer,
    yearData: yearDataReducer,
});

export default rootReducer;
