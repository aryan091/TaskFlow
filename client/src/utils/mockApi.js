
const getUsersFromStorage = () => {
  return JSON.parse(localStorage.getItem('users')) || [];
};

const saveUsersToStorage = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const getTasksFromStorage = () => {
  return JSON.parse(localStorage.getItem('tasks')) || [];
};

const saveTasksToStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const API_URL = 'http://localhost:5000'; // The base URL for the mock API

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// User Registration
export const registerUser = async (name, email, password) => {
  // Simulated delay for testing purposes
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(500);

  try {
    // API call to register user
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    // If the response is not OK, handle it as an error
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register user');
    }

    const { users, newUser } = await response.json();

    saveUsersToStorage(users);

    return newUser;
  } catch (error) {
    console.error(error.message || 'Failed to register user');

    const storedUsers = getUsersFromStorage() || [];
    const newLocalUser = { id: storedUsers.length + 1, name, email, password };
    storedUsers.push(newLocalUser);

    saveUsersToStorage(storedUsers);

    return { newUser: newLocalUser };
  }
};

export const loginUser = async (email, password) => {
  await delay(500); 

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Invalid email or password');
    }
  
    const {users , user} = await response.json();
  
    saveUsersToStorage(users);
  
    return user;
  } catch (error) {
    console.error(error.error || 'Invalid email or password');
    const storedUsers = getUsersFromStorage() || [];
    const user = storedUsers.find(user => user.email === email && user.password === password);
    return user;
  }
  
};

export const getTasks = async (userId) => {
    await delay(500); 
    console.log(" User Id in get task :", userId);

    try {
        const response = await fetch(`${API_URL}/tasks?userId=${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch tasks from API');
        }

        const tasks = await response.json();
        console.log("tasks in frontend:", tasks.userTasks);
        saveTasksToStorage(tasks.userTasks); 
        return tasks;

    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        
        const storedTasks = getTasksFromStorage() || [];
        const userSpecificTasks = storedTasks?.filter(task => task.userId === userId);
        
        console.log("userSpecificTasks from local storage:", userSpecificTasks);
        return userSpecificTasks; 
    }
};


// Add a New Task
export const addTask = async (task) => {
    await delay(500); 

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Failed to add task from API');
        }

        const { tasks, newTask } = await response.json();
        console.log("tasks in frontend:", tasks);
        saveTasksToStorage(tasks); 
        return tasks; 

    } catch (error) {
        console.error("Error adding task:", error.message);

        const storedTasks = getTasksFromStorage() || [];
        console.log("storedTasks from local storage:", storedTasks);
  
        storedTasks.push(task); 
        
        saveTasksToStorage(storedTasks);

        return storedTasks; 
    }
};


export const updateTask = async (id, updatedTask) => {
  console.log("Update Task and id:", updatedTask, id);
  await delay(500); 

  try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
          throw new Error('Failed to update task from API');
      }

      console.log("Response from backend:", await response.json());
      const { tasks , updateTask } = await response.json();
     
      console.log("tasks in frontend:", tasks);
      saveTasksToStorage(tasks); 

      return tasks; 

  } catch (error) {
      console.error("Error updating task:", error.message);

      const storedTasks = getTasksFromStorage() || [];
      const taskIndex = storedTasks?.findIndex(task => task.id === id);

      if (taskIndex === -1) {
          throw new Error('Task not found in local storage'); 
      }

          storedTasks[taskIndex] = { ...storedTasks[taskIndex], ...updatedTask }; 
          saveTasksToStorage(storedTasks); 
      
console.log("storedTasks from local storage:", storedTasks);
      return storedTasks;
  }
};


// Delete a Task
export const deleteTask = async (id) => {
  await delay(500); 

  try{
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }


const { tasks } = await response.json();
  saveTasksToStorage(tasks);
  return tasks;
}
catch (error) {
  console.error("Error deleting task:", error.message);
  const storedTasks = getTasksFromStorage() || [];

  const taskIndex = storedTasks?.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found in local storage');
  }

  storedTasks.splice(taskIndex, 1);
  saveTasksToStorage(storedTasks);
  return storedTasks;
}
};
