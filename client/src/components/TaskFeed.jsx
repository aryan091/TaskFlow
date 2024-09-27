import React, { useState, useEffect } from 'react';
import { getTasks } from '../utils/mockApi';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { useLocation } from 'react-router-dom';
const TaskCardList = ({ data }) => {
    console.log("data:", data);

    return (
        <div className='mt-16 prompt_layout'>
            {data?.userTasks && data.userTasks.length > 0 ? (
                data?.userTasks?.map((task) => (
                    <TaskCard
                        key={task?.id}
                        task={task}
                    />
                ))
            ) : data && data.length > 0 ? (
                data?.map((task) => (
                    <TaskCard
                        key={task?.id}
                        task={task}
                    />
                ))
            ) : (
                <div className='text-center text-gray-500'>
                    <p>No tasks available at the moment.</p>
                    <p>Please check back later or create a new task.</p>
                </div>
            )}
        </div>
    );
}


const TaskFeed = () => {
    const { currentUser } = useAuth(); 
    const { tasks, fetchTasks } = useTasks();
    const location = useLocation();

    // useEffect(() => {
    //     const fetchUserTasks = async () => {
    //         if (currentUser) {
    //             await fetchTasks(currentUser.id);
    //         }
    //     };

    //     fetchUserTasks(); // Fetch tasks when the component mounts
    // }, [currentUser]); // Re-run the effect if currentUser or location changes

    return (
        <section className='feed'>
            <TaskCardList data={tasks} />
        </section>
    );
}

export default TaskFeed;
