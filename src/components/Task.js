import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editTask, deleteTask } from '../actions/taskActions';
import { deleteLabel } from '../actions/labelActions';
import TaskForm from './TaskForm';
import LabelForm from './LabelForm';
import Label from './Label';

const Task = ({ task, indx, onEdit, onDrag, handleDrop, labels, taskFormData }) => {
  task.labels = labels;
  const {taskIdToEdit , selectedDay, day} = taskFormData;
  const [isEditing, setIsEditing] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const [labelToEdit, setLabelIdToEdit] = useState('');
  const [showLabelForm, setShowLabelForm] = useState(false);

  const dispatch = useDispatch();

  function findLabelById(taskLabels, labelId) {
    return taskLabels.find(item => item.id === labelId);
  }

  const handleEditClick = () => {
    setIsEditing(true);
    onEdit(task.id);
  };

  const handleDeleteClick = () => {
    dispatch(deleteTask(task.day, task.id));
    task.labels.forEach(label => {
      dispatch(deleteLabel(task.day, label.id));
    });
  };

  const handleLabelClick = (id) => {
    if(typeof id != 'object') {
      setLabelIdToEdit(findLabelById(task.labels, id));
      setShowLabelForm(true);
    } else {
      setLabelIdToEdit(null);
      setShowLabelForm(true);
    }
  };

  const handleCancelLabelFormClick = () => {
    setShowLabelForm(false);
  }

  const toggleHidden = (event) => {
    if(event.target.classList.contains('task-label')) {
      return handleLabelClick(event.target.id);
    }
    setIsHidden(!isHidden);
  };

  return (
    <>
      {showLabelForm && <LabelForm task={task} 
        labelToEdit={labelToEdit}
        undoForm={handleCancelLabelFormClick} 
        setLabelIdToEdit={setLabelIdToEdit}/>}

      {selectedDay == day && taskIdToEdit && (taskIdToEdit == task.id) && isEditing &&
      <TaskForm selectedDate={day} taskIdToEdit={taskIdToEdit} 
        setIsEditing={setIsEditing}/>}

      <div className="task" data-indx={indx} draggable
        onClick={toggleHidden} title='click to edit'
        onDragStart={(event) => onDrag(event, task.day, task.id)}
        onDrop={(event) => handleDrop(event, task.day)}
      >
        <div className="task-labels">
          {task.labels.map(label => (
            <Label key={label.id} id={label.id} color={label.color} text={label.text}/>
          ))}
        </div>
        <div className="task-header">
          <div className="task-title">{task.name}</div>

        </div>
        <div className="task-description">{task.descr}</div>
        <div className={isHidden ? 'task-cntrls hidden' : 'task-cntrls'}>
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={handleDeleteClick}>Delete</button>
            <button onClick={handleLabelClick}>Label</button>
        </div>
      </div>
    </>
  );
};

export default Task;
