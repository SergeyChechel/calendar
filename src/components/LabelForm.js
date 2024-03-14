import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLabel, editLabel, deleteLabel } from '../actions/labelActions';

const LabelForm = ({ task, labelToEdit, undoForm, setLabelIdToEdit }) => {
    const dispatch = useDispatch();

    const [labelColor, setLabelColor] = useState('');
    const [labelText, setLabelText] = useState('');
    const [label, setLabel] = useState(labelToEdit);

    useEffect(() => {
        if (label) {
            setLabelColor(label.color);
            setLabelText(label.text);
        }
    }, [labelToEdit]);
   
    function cancelHandle () {
        undoForm();
        setLabelColor('');
        setLabelText('');
        setLabel(null);
    }

    function deleteHandle () {
        dispatch(deleteLabel(task.day, label.id));
        undoForm();
    }

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        if(labelColor == "") return;
        labelText.trim();
        
        if (label) {
            label.color = labelColor;
            label.text = labelText;
            dispatch(editLabel(task.day, label));
        } else {
            const newLabel = {
                id: task.id + "-" + (task.labels.length + 1), 
                taskId: task.id, 
                color: labelColor, 
                text: labelText
            };
            dispatch(addLabel(task, newLabel));
        }
        // Очистка формы после отправки
        setLabelColor('');
        setLabelText('');
        setLabel(null);
        setLabelIdToEdit(null);
        undoForm();
    };


    return (
        <form className="create-label-form" onSubmit={handleSubmit}>
            <select
                value={labelColor}
                onChange={(e) => setLabelColor(e.target.value)}
            >
                <option value="">Цвет</option>
                <option value="red">Красный</option>
                <option value="blue">Синий</option>
                <option value="green">Зеленый</option>
                <option value="yellow">Желтый</option>
                {/* Добавьте другие цвета, если нужно */}
            </select>
            <textarea
                placeholder="Текст метки"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
            />
            <div className='form-btns'>
                <button className="add-tsk-btn" type="submit">{label ? 'Save' : 'Add'}</button>
                {label && <button className="cncl-tsk-btn" 
                type="button" onClick={deleteHandle}>Delete</button>}
                <button className="cncl-tsk-btn" 
                type="button" onClick={cancelHandle}>Cancel</button>
            </div>
        </form>

    );
};

export default LabelForm;
