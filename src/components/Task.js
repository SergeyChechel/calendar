import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editTask, deleteTask } from '../actions/taskActions';
import LabelForm from './LabelForm';
import Label from './Label';

const Task = ({ task, indx, onEdit, onDrag, handleDrop, labels }) => {
  task.labels = labels;
  // debugger;
  const [isHidden, setIsHidden] = useState(true);
  const [labelToEdit, setLabelIdToEdit] = useState('');
  const [showLabelForm, setShowLabelForm] = useState(false);

  const dispatch = useDispatch();

  function findLabelById(taskLabels, labelId) {
    return taskLabels.find(item => item.id === labelId);
  }

  const handleEditClick = () => {
    onEdit(task.id);
  };

  const handleDeleteClick = () => {
    dispatch(deleteTask(task.day, task.id));
  };

  const handleLabelClick = (id) => {
    if(typeof id != 'object') {
      setLabelIdToEdit(findLabelById(task.labels, id));
      setShowLabelForm(true);
    } else {
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
        undoForm={handleCancelLabelFormClick} />}

      <div className="task" data-indx={indx} draggable
        onClick={toggleHidden}
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
