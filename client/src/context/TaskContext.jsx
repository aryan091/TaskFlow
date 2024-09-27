import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../utils/mockApi'; 
import { useAuth } from '../context/AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchTasks(currentUser.id);
    }
  }, [currentUser]);

  const fetchTasks = async (userId) => {
    try {
      console.log('Fetching tasks for user:', userId);
      const userTask = await getTasks(userId);
      setTasks(userTask);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const createTask = async (task) => {
    try {
      console.log('Adding task:', task);
      const userTask = await addTask(task);
      console.log('Added task:', tasks);
      setTasks(userTask);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const editTask = async (id, updatedTask) => {
    try {
      const updTasks = await updateTask(id, updatedTask);
      setTasks(updTasks);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const removeTask = async (id) => {
    try {
      const deleted = await deleteTask(id);
      setTasks(deleted);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, createTask, editTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);


// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { getTasks, addTask as apiAddTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '../utils/mockApi'; 
// import { useAuth } from '../context/AuthContext';

// const TaskContext = createContext();

// export const TaskProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([]);
//   const { currentUser } = useAuth();

//   // Fetch tasks on initial render or when currentUser changes
//   useEffect(() => {
//     if (currentUser) {
//       fetchUserTasks(currentUser.id);
//     }
//   }, [currentUser]);

//   // Fetch user-specific tasks
//   const fetchUserTasks = useCallback(async (userId) => {
//     try {
//       const userTasks = await getTasks(userId);
//         setTasks(userTasks);
        
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   },[]);

//   // Create a new task
//   const addTask = async (task) => {
//     try {
//       const newTask = await apiAddTask(task);
//       setTasks(tasks);
//       // Also store in local storage
//       const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
//       localStorage.setItem('tasks', JSON.stringify([...storedTasks, newTask]));
//     } catch (error) {
//       console.error('Error adding task:', error);
//     }
//   };

//   // Edit an existing task
// const editTask = async (id, updatedTask) => {
//     try {
//         const updated = await apiUpdateTask(id, updatedTask);
//         console.log(" tasks in editTask :", tasks);

//         setTasks(updated);
//         fetchUserTasks(updatedTask.userId);

        
//     } catch (error) {
//         console.error('Error updating task:', error);
//     }
// };

//   // Remove a task
//   const removeTask = async (id) => {
//     try {
//       const deleted = await apiDeleteTask(id);
//       setTasks(deleted);
//       // Remove from local storage
//       const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
//       const updatedTasks = storedTasks?.filter(task => task.id !== id);
//       localStorage.setItem('tasks', JSON.stringify(updatedTasks));
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   return (
//     <TaskContext.Provider value={{ tasks, fetchUserTasks, addTask, editTask, removeTask }}>
//       {children}
//     </TaskContext.Provider>
//   );
// };

// // Custom hook to use the TaskContext
// export const useTasks = () => useContext(TaskContext);
