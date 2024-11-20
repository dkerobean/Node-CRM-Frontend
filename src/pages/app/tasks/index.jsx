import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import TaskGrid from "./TaskGrid";
import TaskList from "./TaskList";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { toggleAddModal } from "./store";
import AddTask from "./AddTask";
import { ToastContainer } from "react-toastify";
import EditTask from "./EditTask";

const TasksPage = () => {
  const [view, setView] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);

  // Safely access tasks from state
  const taskState = useSelector((state) => state.task || { tasks: [] });
  const { tasks } = taskState;
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setIsLoaded(false);
    }, 1500);
  }, [view]);

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Tasks
        </h4>
        <div
          className={`${
            width < breakpoints.md ? "space-x-rb" : ""
          } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
        >
          <Button
            icon="heroicons:list-bullet"
            text="List view"
            disabled={isLoaded}
            className={`${
              view === "list"
                ? "bg-slate-900 dark:bg-slate-700 text-white"
                : "bg-white dark:bg-slate-800 dark:text-slate-300"
            } h-min text-sm font-normal`}
            iconClass="text-lg"
            onClick={() => setView("list")}
          />
          <Button
            icon="heroicons-outline:view-grid"
            text="Grid view"
            disabled={isLoaded}
            className={`${
              view === "grid"
                ? "bg-slate-900 dark:bg-slate-700 text-white"
                : "bg-white dark:bg-slate-800 dark:text-slate-300"
            } h-min text-sm font-normal`}
            iconClass="text-lg"
            onClick={() => setView("grid")}
          />
          <Button
            icon="heroicons-outline:filter"
            text="In Progress"
            className="bg-white dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-900 hover:text-white btn-md h-min text-sm font-normal"
            iconClass="text-lg"
          />
          <Button
            icon="heroicons-outline:plus"
            text="Add Task"
            className="btn-dark dark:bg-slate-800 h-min text-sm font-normal"
            iconClass="text-lg"
            onClick={() => dispatch(toggleAddModal(true))}
          />
        </div>
      </div>
      {isLoaded && view === "grid" && <GridLoading count={tasks?.length} />}
      {isLoaded && view === "list" && <TableLoading count={tasks?.length} />}

      {view === "grid" && !isLoaded && (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {tasks.map((task, index) => (
            <TaskGrid task={task} key={index} />
          ))}
        </div>
      )}
      {view === "list" && !isLoaded && (
        <div>
          <TaskList tasks={tasks} />
        </div>
      )}
      <AddTask />
      <EditTask />
    </div>
  );
};

export default TasksPage;
