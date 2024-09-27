import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { nanoid } from 'nanoid'; 
import { useLocation } from 'react-router-dom'; 
import { useTasks } from '../context/TaskContext';

const CreateTask = () => {


    const { currentUser } = useAuth();
    const { createTask, editTask } = useTasks();
    const [title, setTitle] = useState("");
    const [checklist, setChecklist] = useState([{ item: "", checked: false }]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const { state } = useLocation();

    useEffect(() => {
        if (state && state.task) {
            id:state?.task ? state?.task.id : nanoid()
            setTitle(state.task.title);
            setChecklist(state.task.checklist);
            userId:currentUser?.id
            createdAt:state?.task.createdAt

        }
    }, [state]);

    const validateFields = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (checklist.length === 0 || checklist.some(item => !item.item.trim())) {
            newErrors.checklist = "Checklist items are required";
        }
        return newErrors;
    };

    const handleAddChecklistItem = () => {
        setChecklist([...checklist, { item: "", checked: false }]);
    };

    const handleRemoveChecklistItem = (index) => {
        if (checklist.length > 1) {
            setChecklist(checklist.filter((_, i) => i !== index));
        }
    };

    const handleChecklistItemChange = (index, value) => {
        const updatedChecklist = checklist.map((item, i) =>
            i === index ? { ...item, item: value } : item
        );
        setChecklist(updatedChecklist);
    };

    const handleChecklistItemCheck = (index, checked) => {
        const updatedChecklist = checklist.map((item, i) =>
            i === index ? { ...item, checked } : item
        );
        setChecklist(updatedChecklist);
    };

    const handleCloseModal = () => {
        navigate("/tasks");
    };

    const checkedCount = checklist.filter((item) => item.checked).length;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        const task = {
            id: state?.edit ? state.task.id : nanoid(), 
            title,
            checklist,
            userId: currentUser?.id,
            createdAt: state?.edit ? state.task.createdAt : Date.now(),
        };
    
        try {
            if (state?.edit) {
                console.log("state.task.id :",state.task.id , task)
                await editTask(state.task.id, task);
            } else {
                await createTask(task);
            }
            navigate("/tasks");
        } catch (error) {
            console.error("Error adding/updating task:", error);
            setErrors({ api: "Failed to add/update task. Please try again." });
        }
    };

 

    return (
        <div className="task-modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30">
            <div className="task-modal-content bg-white rounded-lg shadow-lg w-[644px] h-[596px] p-6 flex flex-col justify-between relative">
                <form className="flex flex-col flex-grow" onSubmit={handleSubmit}>
                    <div className="flex-grow">
                        <div className="task-title mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter Task Title"
                                className="task-title-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                            />
                        </div>

                        <div className="task-checklist flex flex-col h-[14rem] mb-4 flex-grow">
                            <span className="block text-gray-700 text-sm font-bold mb-2">
                                Checklist ({checkedCount}/{checklist.length}){" "}
                                <span className="text-red-500">*</span>
                            </span>
                            <div className="task-checklist-items flex flex-col space-y-2 overflow-y-auto custom-scrollbar">
                                {checklist.map((item, index) => (
                                    <div key={index} className="task-checklist-item flex items-center border border-gray-300 p-2 rounded-xl mb-2">
                                        <input
                                            type="checkbox"
                                            className="task-checklist-checkbox form-checkbox border-none"
                                            checked={item.checked}
                                            onChange={(e) => handleChecklistItemCheck(index, e.target.checked)}
                                        />
                                        <input
                                            type="text"
                                            value={item.item}
                                            onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                                            className="ml-2 px-2 py-1 flex-grow w-[576px] h-5"
                                        />
                                        {checklist.length > 1 && (
                                            <button
                                                type="button"
                                                className="task-checklist-delete ml-auto text-red-500"
                                                onClick={() => handleRemoveChecklistItem(index)}
                                            >
                                                <RiDeleteBin6Fill color="red" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="task-checklist-add mt-2 flex gap-1">
                            <div>
                                <IoMdAdd
                                    size={16}
                                    color="#767575"
                                    className="cursor-pointer display-none mt-1"
                                    onClick={handleAddChecklistItem}
                                />
                            </div>
                            <button
                                type="button"
                                className="text-[#767575] text-base font-semibold"
                                onClick={handleAddChecklistItem}
                            >
                                Add New
                            </button>
                        </div>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <p className="text-red-500 text-center font-bold text-sm mt-1">
                            All * fields are mandatory
                        </p>
                    )}

                    <div className="task-modal-actions mt-4 flex justify-between relative">
                        <div className="task-modal-buttons space-x-4">
                            <button
                                type="button"
                                className="task-cancel border border-solid border-[#CF3636] w-40 h-11 text-[#CF3636] py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline font-bold shadow-lg"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="task-save w-40 h-11 bg-[#17A2B8] text-white py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline shadow-lg font-bold"
                            >
                                {state?.edit ? "Save" : "Create"}
                            </button>
                            
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
