import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, editTask } from '../actions/taskActions';

const TaskForm = ({ selectedDate, taskIdToEdit, hideForm }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    // const [taskId, setTaskId] = useState(null);
    
    const dispatch = useDispatch();

    // Получение информации о задаче, если редактируется существующая задача
    const tasks = useSelector(state => state.tasks);
    
    useEffect(() => {
        if (taskIdToEdit) {
            const day = taskIdToEdit.split('-')[0];
            // debugger;
            const taskToEdit = tasks[day].find(task => task.id === taskIdToEdit);
            if (taskToEdit) {
                // setTaskId(taskToEdit.id);
                setTaskName(taskToEdit.name);
                setTaskDescription(taskToEdit.descr);
            }
        }
    }, [taskIdToEdit, tasks]);

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim() === '') return;
        
        if (taskIdToEdit) {
            dispatch(editTask(taskIdToEdit, taskName, taskDescription));
        } else {
            const idOfTask = selectedDate + '-' + Date.now();
            dispatch(addTask(selectedDate, taskName, taskDescription, idOfTask));
        }
        // Очистка формы после отправки
        setTaskName('');
        setTaskDescription('');
        // setTaskId(null);
        hideForm();
    };


    return (
        <form className="create-task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Название задачи"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
            />
            <textarea
                placeholder="Описание задачи"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
            />
            <div className='form-btns'>
                <button className="add-tsk-btn" type="submit">{taskIdToEdit ? 'Сохранить' : 'Добавить'}</button>
                <button className="cncl-tsk-btn" type="button">Отменить</button>
            </div>
            
        </form>
    );
};

export default TaskForm;
