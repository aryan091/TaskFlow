import TaskFeed from "./TaskFeed";
import CreateTask from "./Createtask";
const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center"
      >Organize & Manage Tasks Efficiently
      <br className="max-md:hidden" />
      {/* <span className="orange_gradient text-center">AI-Powered Prompts</span> */}
      </h1>
      <p className="desc text-center">
      Collaborate, stay focused, and achieve your goals with ease using TaskManager—your ultimate tool for efficient task management.
        <br />
      </p>

      <TaskFeed />

      {location.pathname === '/create-task' && (
        <CreateTask   />
      )}

    </section>
  );
};

export default Home;
