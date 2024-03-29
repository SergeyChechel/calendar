import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveTask, reorderTask } from '../actions/taskActions';
import { moveLabels } from '../actions/labelActions';
import Task from './Task';
import { connect } from 'react-redux';

const CalendarCell = ({ date, tasks, onEditTask, taskFormData, dataFromRedux }) => {


  const dispatch = useDispatch();
  const dayLabels = useSelector(state => state.labels[date]) || [];
  const dayTasks = dataFromRedux[date];

  function filterLabelsByTaskId(dayLabels, taskId) {
    return dayLabels.filter(item => item.taskId === taskId);
  }

  function handleDragStart(event, day, id) {
    event.dataTransfer.setData('sourceDay', day);
    event.dataTransfer.setData('taskId', id);
    event.dataTransfer.setData('index', event.target.dataset.indx);
  }
  
  function handleDragOver(event) {
    event.preventDefault();
  }
  
  function handleDrop(event, day) {
    event.preventDefault();
    const sourceDay = +event.dataTransfer.getData('sourceDay');
    if(day == sourceDay) return;
    const taskId = event.dataTransfer.getData('taskId');
    dispatch(moveTask(taskId, sourceDay, day));
    dispatch(moveLabels(taskId, sourceDay, day));
  }

  const reoderDropHandle = (event, day) => {
    event.preventDefault(); 
    const sourceDay = event.dataTransfer.getData('sourceDay');
    if(day != sourceDay) return;
    const draggedTaskIndex = event.dataTransfer.getData('index');
    const dropTaskIndex = event.target.closest('.task').dataset.indx;
    dispatch(reorderTask(day, sourceDay, dropTaskIndex, draggedTaskIndex));
  };

  return (
    <div className='calendar-cell' draggable
      data-day={date} 
      onDragOver={handleDragOver} 
      onDrop={(event) => handleDrop(event, date)}
    >
      <div className="tasks">
        {tasks.map((task, indx) => (
          <Task key={task.id} task={task} indx={indx}
            onEdit={onEditTask} 
            onDrag={handleDragStart} 
            handleDrop={reoderDropHandle} 
            labels={filterLabelsByTaskId(dayLabels, task.id)}
            taskFormData={taskFormData}
          />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = state => {

  return {
    dataFromRedux: state.tasks // Получение доступа к данным из Redux-состояния и отображение их в свойство 'dataFromRedux'
  };
};

export default connect(mapStateToProps)(CalendarCell);
