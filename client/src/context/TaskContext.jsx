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


