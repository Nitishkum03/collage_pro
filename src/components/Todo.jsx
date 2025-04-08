import { useState ,useEffect } from "react";
import {FiPlus,FiSearch} from "react-icons/fi";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import "react-toastify/dist/ReactToastify.css";
export default function TaskMaster() {
  
  const [tasks,setTasks]=useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const now = new Date();

// Count overdue tasks
const overdueCount = tasks.filter(
  (task) => new Date(task.date) < now && task.status !== "Completed"
).length;

// Prepare task data grouped by category
const categories = ["Work", "Personal", "Shopping", "Health"];
const categoryData = categories.map((cat) => ({
  name: cat,
  value: tasks.filter((task) => task.category === cat).length,
}));

// Add overdue slice
const pieData = [
  ...categoryData,
  { name: "Overdue", value: overdueCount },
];

// Define colors (same order)
const COLORS = ["#3b82f6", "#10b981", "#f97316", "#a855f7", "#ef4444"]
const today = new Date();
const month = today.getMonth(); 
const year = today.getFullYear();
const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    priority: "Low",
    category: "",
    status: "Active",
  });
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  const addTasknew = () => {
    if (!newTask.title.trim() || !newTask.category.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }
    const newTaskWithId = { ...newTask, id: tasks.length + 1 };
    setTasks([...tasks, newTaskWithId]);
    setNewTask({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      priority: "Low",
      category: "",
      status: "Active",
    });
    setShowModal(false);
    toast.success("Task added Successfully!");
  };
  const toggleStatus = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status =
      updatedTasks[index].status === "Active" ? "Completed" : "Active";
    setTasks(updatedTasks);
  };
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "All") return true;
      if (filter === "Active" || filter === "Completed") {
        return task.status === filter;
      }
      return task.category === filter;
    })
    .filter((task) => {
      const term = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    });
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 border-red-300";
      case "Medium":
        return "text-yellow-500 border-yellow-300";
      case "Low":
      default:
        return "text-blue-500 border-blue-300";
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000}/>
        <aside className="w-66 bg-white  flex flex-col">
          <div className="p-6 ">
            <h1 className="text-2xl font-bold">Tasks </h1>
            <span className="text-xl text-gray-500">Todo User</span>
          </div>
          <div className="p-6 ">
            <h2 className="text-xl text-gray-600 font-semibold uppercase mb-4">Views</h2>
            <ul className="space-y-1">
              <li onClick={() => setFilter("All")}className={` text-xl flex items-center cursor-pointer ${ filter === "All"? "text-blue-500 font-semibold": "text-gray-700" }`}>
                 All Tasks
              </li>
              <li onClick={() => setFilter("Active")}className={` text-xl flex items-center cursor-pointer ${filter === "Active"? "text-blue-500 font-semibold": "text-gray-700"}`}>
                 Active
              </li>
              <li onClick={() => setFilter("Completed")} className={` text-xl flex items-center cursor-pointer ${filter === "Completed"? "text-blue-500 font-semibold": "text-gray-700"}`}>
               Completed
              </li>
            </ul>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-500 uppercase mb-2">Categories</h2>
            <ul className="space-y-1">
              {["Work", "Personal", "Shopping", "Health"].map((cat) => (
                <li
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xl cursor-pointer ${
                    filter === cat ? "text-blue-500 font-semibold" : "text-gray-700"
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 flex items-center mt-auto">
          <button onClick={() => { localStorage.removeItem("loggedInUser"); setIsAuthenticated(false);}} className=" bg-red-600 w-100 cursor-pointer  text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
          </div>
         

        </aside>
      <main className="flex-1 p-6 ml-16 overflow-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-semibold">
            {filter === "All" ? "All Tasks" : `${filter} Tasks`}
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input type="text" placeholder="Search tasks..." className="pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            {/* Add Task button */}
            <button onClick={() => setShowModal(true)} className="inline-flex items-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              <FiPlus className="mr-1" />
              Add Task
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, index) => {
            const priorityColor = getPriorityColor(task.priority);
            return (
              <div
                key={index}
                className={`bg-white rounded shadow p-4 border-l-4 ${priorityColor.split(" ")[1]}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <span className={`text-xs font-semibold ${priorityColor.split(" ")[0]} border border-gray-200 px-2 py-0.5 rounded-full`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {task.date
                      ? new Date(task.date).toLocaleDateString()
                      : "No date"}
                  </span>
                  <span>{task.category}</span>
                </div>
                <div className="flex items-center mt-3">
                  {task.status === "Completed" ? (
                    <FaCheckCircle
                      className="text-green-500 mr-2 cursor-pointer"
                      onClick={() => toggleStatus(index)}
                    />
                  ) : (
                    <FaRegCircle
                      className="text-gray-400 mr-2 cursor-pointer"
                      onClick={() => toggleStatus(index)}
                    />
                  )}
                  <span
                    className={`${task.status === "Completed"? "text-green-600": "text-gray-600"}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
              <div className="p-6 bg-gray-100 rounded-lg justify-center items-center gap-10">
                {/* <TodoCalendar tasks={tasks} /> */}
                <h3 className="text-lg font-semibold mt-4">Task Calendar</h3>
                <div className="bg-white p-4 rounded-lg shadow mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{new Date().toLocaleString("default", { month: "long" })} {new Date().getFullYear()}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                     {[...Array(daysInMonth).keys()].map((day) => {
                       const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                       day + 1
                      ).padStart(2, "0")}`;
                       return (
                       <button key={day} className={`w-10 h-10 rounded-full ${selectedDate === dateString ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}onClick={() => setSelectedDate(dateString)}>
                       {day + 1}
                       </button>
                       );
                    })}
                  </div>
                </div>
<div className="flex justify-between items-center mt-4">
  <h3 className="text-lg font-semibold">Tasks for {new Date().toLocaleDateString()}</h3>
  <button onClick={() => setSelectedDate(null)} className="text-blue-500 hover:underline cursor-pointer">Clear</button>
  </div>
  <div>
  <div className="bg-white p-4 rounded-lg shadow mt-4">
    {tasks.filter((task) => task.date === selectedDate).length ? (tasks.filter((task) => task.date === selectedDate).map((task) => (
      <div key={task.id} className="p-3 mb-2 shadow-xl rounded flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="text-sm text-gray-600">{task.description}</p>
          <div className="flex gap-2 mt-1">
            {task.category && (
              <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                {task.category}
              </span>
            )}
            
         </div>
          <span className="text-xs text-gray-500">
            {new Date(task.date).toLocaleDateString()}
          </span>
        </div>
        <span
          className={`w-3 h-3 rounded-full ${
            task.priority === "High"
              ? "bg-red-600"
              : task.priority === "Medium"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        ></span>
      </div>
    ))) : (
    <p className="text-gray-500">No tasks for this day.</p>
    )}

  </div>
  </div>
  </div>
  <div className="bg-white p-6 rounded-lg shadow mt-8">
    <h2 className="text-xl font-semibold mb-2">Task Distribution</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percent }) =>
            `${(percent * 100).toFixed(0)}%`
          }
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </div>
  </main>
  {showModal && (
          <div className="fixed inset-0  bg-white/80 flex items-center justify-center z-50">
            <div className=" p-6 rounded-lg shadow-lg  bg-white  w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
              {/* Title */}
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
             <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                value={newTask.date}
                onChange={(e) =>
                  setNewTask({ ...newTask, date: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              />
              {/* Priority */}
              <label className="text-sm text-gray-600">Priority</label>
              <select value={newTask.priority} onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {/* Category */}
              <label className="text-sm text-gray-600">Category</label>
              <select
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
              </select>
              {/* Status */}
              <label className="text-sm text-gray-600">Status</label>
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
              {/* Action buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button onClick={addTasknew} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
                  Add Task
                </button>
              </div> 
            </div>
            
          </div>
        )}
  </div>
  );
}
