import React, { useEffect, useState } from "react";
import "../styles/dash.css";
import { useSideBar } from "../../store/zusStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsProgress,
  faEllipsisVertical,
  faHome,
  faLayerGroup,
  faPlus,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { showSidebar } = useSideBar();

  const [activeCategory, setActiveCategory] = useState("Task");
  const [taskInfoAdded, setTaskInfoAdded] = useState(false);
  const [addtaskboxOpen, setaddtaskboxOpen] = useState(false);
  const [taskList, settaskList] = useState([]);

  const updateTaskList = (task) => {
    const obj = {
      title: task.TaskName,
      desc: task.TaskDesc,
    };

    settaskList((taskList) => [...taskList, obj]);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    formik.setValues({
      ...formik.initialValues, // Reset to the initial values
      [`${category}Name`]: "",
      [`${category}Desc`]: "",
      // ... reset other fields for the new category
    });
  };

  const handleTaskValueChange = () => {
    const { TaskName, TaskDesc, GroupName, GroupDesc } = formik.values;
    if ((TaskName && TaskDesc) || (GroupName && GroupDesc)) {
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: {
      TaskName: "",
      TaskDesc: "",
      GroupName: "",
      GroupDesc: "",
    },

    onSubmit: (values) => {
      if (taskInfoAdded) {
        updateTaskList(values);
        formik.setValues(formik.initialValues);
        setaddtaskboxOpen(false);
      } else {
        toast.error("please enter required info");
      }
    },
  });

  useEffect(() => {
    setTaskInfoAdded(handleTaskValueChange);
  }, [formik.values]);

  return (
    <div className="dash-container">
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? "visible" : ""}`}>
        <div className="home side-icons group  transition-all ">
          <FontAwesomeIcon icon={faHome} className="w-4 h-8" />
          <span className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-3 duration-200  ">
            Home
          </span>
        </div>
        <div className="tasks side-icons group  transition-all ">
          <FontAwesomeIcon icon={faBarsProgress} className="w-4 h-8" />
          <span className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-3 duration-200">
            Tasks
          </span>
        </div>
        <div className="groups side-icons group  transition-all ">
          <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-8" />
          <span className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-3 duration-200">
            Groups
          </span>
        </div>
      </div>
      <div className={`dash-content ${showSidebar ? "shifted" : ""}`}>
        <div className="addTasks dash-c">
          <div
            className="addBtn"
            onClick={() => {
              setaddtaskboxOpen(!addtaskboxOpen);
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            add
          </div>
        </div>
        <div className="taskList dash-c">
          {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
          <ul>
            {taskList.map((task) => {
              return (
                <li>
                  <div className="task-object">
                    <div className="taskInfo">
                      <div className="task-title">{task.title}</div>
                      <div className="task-description">{task.desc}</div>
                    </div>
                    <div className="taskMenu">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          className={`addTask-box ${addtaskboxOpen ? "add-task-box-open" : ""}`}
        >
          <div className="catagory-row">
            <button
              className={`catagory-button ${
                activeCategory === "Task" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Task")}
            >
              Task
            </button>
            <button
              className={`catagory-button ${
                activeCategory === "Group" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("Group")}
            >
              Group
            </button>
          </div>
          <form
            action=""
            onSubmit={formik.handleSubmit}
            className="addtask-form"
          >
            {/* to print formik values */}

            <label htmlFor="name" className="input_label"></label>
            <input
              {...formik.getFieldProps(`${activeCategory}Name`)}
              type="text"
              placeholder={`Enter ${activeCategory} name`}
            />
            <label htmlFor="desc" className="input_label"></label>
            <textarea
              {...formik.getFieldProps(`${activeCategory}Desc`)}
              type="text"
              placeholder={`Enter ${activeCategory} Description`}
            />
            <div className="btns">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  formik.setValues(formik.initialValues);
                  setaddtaskboxOpen(false);
                }}
              >
                cancel
              </button>
              <button
                type="submit"
                disabled={!taskInfoAdded}
                className={!taskInfoAdded ? "btn-disabled" : ""}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
