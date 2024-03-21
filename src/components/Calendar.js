import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarCell from './CalendarCell';
import TaskForm from './TaskForm';
import { filterTasksByText, filterTasksByLabel } from '../actions/filterActions';
import { updateTasks } from '../actions/taskActions';
import { updateLabels } from '../actions/labelActions';
import { updateFilters } from '../actions/filterActions';
import { putMonthData } from '../actions/yearDataActions';

const Calendar = () => {
  const dispatch = useDispatch();
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  let currentYear, currentMonth, currentDate;

  function init(month) {
    const currDate = new Date();
    if(month === null) {
      currentYear = currDate.getFullYear();
      currentMonth = currDate.getMonth();
    } else {
      currentMonth = month >= 0 ? month : 12 + month;
      currentYear = year;
    }
    currentDate = new Date(currentYear, currentMonth + 1, 0);
  }

  init(month);

  // Получаем количество дней в текущем месяце
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Создаем массив с числами от 1 до количества дней в текущем месяце
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
   
  let tasks, labels, filters, monthData, yearData;
  monthData = useSelector(state => state.yearData[currentMonth]);

  tasks = useSelector(state => state.tasks);
  labels = useSelector(state => state.labels);
  filters = useSelector(state => state.filters);
  yearData = useSelector(state => state.yearData);

  const handleChangeMonth = (event) => {

    dispatch(putMonthData(currentMonth, { tasks, labels, filters }))

    if(event.target.classList.contains('prev-month')) {
      setMonth(currentMonth - 1);
      if (currentMonth - 1 < 0) {
        // setYear(year - 1); // откл перехода на другие года
        setMonth(0);
      }
    }

    if(event.target.classList.contains('next-month')) {
      setMonth(currentMonth + 1);
      if (currentMonth + 1 > 11) {
        // setYear(year + 1); // откл перехода на другие года
        // setMonth(0);       // откл перехода на другие года
        setMonth(11);
      }
    }

    if(event.target.classList.contains('this-month')) {
      // debugger;
      setMonth(new Date().getMonth());
    }
  };

  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v3/PublicHolidays/2024/UA');
        if (!response.ok) {
          throw new Error('Ошибка при получении данных о праздниках');
        }
        const data = await response.json();
        setHolidays(data);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };
    fetchHolidays();
  }, []); 

  const holidaysInThisMonth = holidays.filter(item => {
    const holidayMonth = parseInt(item.date.split('-')[1], 10);
    return (holidayMonth === (currentMonth + 1)) && item.global;
  });
  
  const holidaysDaysInThisMonth = holidaysInThisMonth.map(item => parseInt(item.date.split('-')[2], 10));
  const holidaysNamesInThisMonth = holidaysInThisMonth.map(item => item.name);

  // Состояние для отслеживания выбранного дня
  const [selectedDay, setSelectedDay] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [taskIdToEdit, setTaskIdToEdit] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [labelsColor, setLabelsColor] = useState('');
  const myRef = useRef();

  function filterTasks(tasks, searchText, flag, labels) {

    function selectTasksByIds(tasks, taskIds) {
      const selectedTasks = {};
      Object.keys(tasks).forEach(key => {
        const filteredTasks = tasks[key].filter(task => taskIds.includes(task.id));
        if (filteredTasks.length > 0) {
          selectedTasks[key] = filteredTasks;
        }
      });
      return selectedTasks;
    }
    
    function getTaskIdsByColor(labels, color) {
      const taskIds = [];
      Object.keys(labels).forEach(key => {
        const filteredTasks = labels[key].filter(task => task.color === color);
        filteredTasks.forEach(task => {
          taskIds.push(task.taskId);
        });
      });
      return taskIds;
    }

    let filteredTasks = {};
    
    if(flag == 'text') {
      Object.keys(tasks).forEach(key => {
        const filtered = tasks[key].filter(task =>
          task.name.toLowerCase().includes(searchText.toLowerCase()) ||
          task.descr.toLowerCase().includes(searchText.toLowerCase())
        );
        if (filtered.length > 0) {
          filteredTasks[key] = filtered;
        }
      });
    }

    if(flag == 'labels') {
      const coloredTaskIds = getTaskIdsByColor(labels, searchText)
      filteredTasks = selectTasksByIds(tasks, coloredTaskIds);
    }

    return filteredTasks;
  }

  useEffect(() => {
    dispatch(updateTasks(monthData?.tasks || {}));
    dispatch(updateLabels(monthData?.labels || {}));
    dispatch(updateFilters(monthData?.filters || {}));
  }, [monthData]); 
  

  useEffect(() => {
    try {
      localStorage.setItem(
        'stateFromStorage', 
        JSON.stringify({ tasks, filters, labels, yearData })
      );
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [tasks, filters, labels]);

  if(filters.searchText) {
    tasks = filterTasks(tasks, filters.searchText, 'text');
  } 
  if(filters.labelsColor) {
    tasks = filterTasks(tasks, filters.labelsColor, 'labels', labels);
  }
  
  // Обработчик клика на день
  const addDayTask = (day) => {
    setTaskIdToEdit(null);
    setFormSubmitted(false);
    setSelectedDay(day);
  };

  // Обработчик клика на edit task
  const editTaskHandle = (taskId) => {
    setFormSubmitted(false)
    setSelectedDay(taskId.split('-')[0]);
    setTaskIdToEdit(taskId);
  };

  const hideForm = () => {
    setFormSubmitted(true);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    dispatch(filterTasksByText(event.target.value));
  };

  const handleLabelsFilterChange = (event) => {
    setLabelsColor(event.target.value);
    dispatch(filterTasksByLabel(event.target.value));
  };

  const getDayOfWeek = (year, month, day) => {
    const date = new Date(year, month, day);
    const dayOfWeekNumber = date.getDay();
    const daysOfWeek = ['Воскр', 'Понед', 'Вторн', 'Среда', 'Четверг', 'Пятн', 'Суббота', ];

    return daysOfWeek[dayOfWeekNumber];
};

  return (
    <div className="calendar">
      <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
      <div className='filter'>
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Фильтр по тексту"
        />
        <select value={labelsColor} onChange={handleLabelsFilterChange}>
            <option value="">Фильтр по цвету</option>
            <option value="red">Красный</option>
            <option value="blue">Синий</option>
            <option value="green">Зеленый</option>
            <option value="yellow">Желтый</option>
            {/* Добавьте другие цвета, если нужно */}
        </select>
        <div className='month-taker' onClick={handleChangeMonth}>
          <button className='prev-month'>prevMonth</button>
          <button className='this-month'>thisMonth</button>
          <button className='next-month'>nextMonth</button>
        </div>
      </div>
      <div className="grid">
        {daysArray.map(day => (
          <div className={day == new Date().getDate() && currentMonth == new Date().getMonth() ? "day today" : "day"} 
            key={day + '_'} onClick={(e) => {
              if(e.target.classList.contains('cncl-tsk-btn')) {
                addDayTask(null)
              }
            }} 
            title={holidaysNamesInThisMonth[holidaysDaysInThisMonth.indexOf(day)]}
          >
            <h4 className={holidaysDaysInThisMonth.includes(day) ? 'holiday' : ''} >{day}</h4>
            <span className='day-name'>{getDayOfWeek(year, currentMonth, day)}</span>
            <button className="add-task" ref={myRef} onClick={() => addDayTask(day)}>
              Add task</button>

            {selectedDay == day && !formSubmitted && !taskIdToEdit && <TaskForm selectedDate={day} hideForm={ hideForm }/>}

            <CalendarCell key={day} date={day} 
              tasks={tasks[day] || []}
              taskFormData={{taskIdToEdit, selectedDay, day, hideForm}}
              onEditTask={editTaskHandle} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
