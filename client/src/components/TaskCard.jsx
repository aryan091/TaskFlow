import React, { useEffect, useState, useRef } from 'react';
import arrow from '../assets/images/arrow.png';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext'; 

const TaskCard = ({ task }) => {
  const [isChecklistVisible, setIsChecklistVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const { editTask, removeTask } = useTasks(); 

  const formatDate = (date) => 
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  const currentDate = formatDate(new Date(task?.createdAt));

  const handleDeleteTask = async () => {
    try {
      await removeTask(task?.id);
      navigate("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleChecklist = () => setIsChecklistVisible((prev) => !prev);
  const togglePopup = () => setIsPopupVisible((prev) => !prev);

  const handleCheckboxChange = (index) => {
    const updatedChecklist = task?.checklist.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    );
    editTask(task.id, { ...task, checklist: updatedChecklist });
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    navigate('/create-task', { state: { task, edit: true } });
  }

  return (
    <div className="task-card p-4 bg-white rounded-lg shadow-xl relative flex flex-col justify-between h-full">
      <div className="task-card-box flex items-center justify-between mb-2">
        <span className='text-orange-500 text-xs font-semibold'>
          <span className="text-blue-500">Created On: </span>{currentDate}
        </span>
        <span className="text-black font-extrabold flex cursor-pointer" onClick={togglePopup}>
          ...
        </span>
      </div>
      {isPopupVisible && (
        <div ref={popupRef} className="popup-menu absolute top-6 right-0 bg-white shadow-md rounded-lg">
          <ul className="list-none m-0 p-2 w-44 h-28">
            <li className="py-1 px-4 hover:bg-gray-100 cursor-pointer text-sm font-bold" onClick={handleEdit}>Edit</li>
            <li className="py-1 px-4 hover:bg-gray-100 cursor-pointer text-red-500 text-sm font-bold" onClick={handleDeleteTask}>Delete</li>
          </ul>
        </div>
      )}
      <div className='title min-w-60 max-h-[4.4rem] overflow-hidden'>
        <h4
          className="text-lg font-semibold mb-2"
          style={{
            maxHeight: '4.4rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          data-tooltip-id={`tooltip-${task?.title}`}
          data-tooltip-content={task?.title}
        >
          {task?.title}
        </h4>
        <Tooltip id={`tooltip-${task?.title}`} place="top" type="dark" effect="solid" className='max-w-80 max-h-52'>
          {task?.title}
        </Tooltip>
      </div>
      <div className='flex items-center justify-between'>
        <p className="text-sm text-gray-500 mb-4">Checklist ({task?.checklist?.filter(item => item.checked).length}/{task?.checklist?.length})</p>
        <div className='w-6 h-6 mb-4 cursor-pointer' onClick={toggleChecklist}>
          <img src={arrow} alt="Toggle Checklist" className={`w-full h-full transform transition-transform ${isChecklistVisible ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isChecklistVisible && (
        <div className="checklist mb-4 overflow-y-auto" style={{ maxHeight: '150px' }}>
          {task.checklist.map((item, index) => (
            <div key={index} className="flex items-center mb-2 border border-gray-300 p-4 rounded-xl">
              <input
                type="checkbox"
                className="mr-2 bg-gray-300"
                checked={item.checked}
                onChange={() => handleCheckboxChange(index)}
              />
              <span className="text-sm">{item.item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
