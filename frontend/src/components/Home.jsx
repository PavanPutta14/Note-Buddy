import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaThumbtack, FaSearch } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);

    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  const handleAddOrUpdate = () => {
    if (!title.trim() || !desc.trim()) {
      setError("Please fill both title and description.");
      return;
    }
    setError("");

    const newTask = {
      title,
      desc,
      dateTime,
      completed: false,
      pinned: false,
    };

    if (editId) {
      axios
        .put(`http://localhost:5000/tasks/${editId}`, {
          title,
          desc,
          dateTime,
        })
        .then(() => {
          fetchTasks();
          resetFields();
        });
    } else {
      axios.post("http://localhost:5000/tasks", newTask).then(() => {
        fetchTasks();
        resetFields();
      });
    }
  };

  const resetFields = () => {
    setEditId(null);
    setTitle("");
    setDesc("");
    setDateTime("");
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDesc(task.desc);
    setDateTime(task.dateTime);
    setEditId(task._id);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5000/tasks/${deleteId}`).then(() => {
      fetchTasks();
      setShowDeleteConfirm(false);
      setDeleteId(null);
    });
  };

  const toggleCheckbox = (task) => {
    const updated = { ...task, completed: !task.completed };
    axios.put(`http://localhost:5000/tasks/${task._id}`, updated).then(fetchTasks);
  };

  const togglePin = (task) => {
    const updated = { ...task, pinned: !task.pinned };
    axios.put(`http://localhost:5000/tasks/${task._id}`, updated).then(fetchTasks);
  };

  const filteredTasks = tasks
    .filter((t) =>
      filter === "all" ? true : filter === "completed" ? t.completed : !t.completed
    )
    .filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.pinned - a.pinned);

  return (
    <div className="container-fluid p-0 m-0 position-relative">
     
      <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center">
        <span className="navbar-brand fs-4">NoteBuddy</span>
        <button
          className="btn text-white fs-4 border-0"
          onClick={() => setShowDrawer(!showDrawer)}
        >
          ☰
        </button>
      </nav>

     
      {showDrawer && (
        <div className="sidebar-drawer">
          <button
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={() => setShowDrawer(false)}
          ></button>
          <div className="d-flex flex-column p-4">
            <button className="btn btn-outline-light mb-3" onClick={() => setShowProfile(true)}>
              Profile
            </button>
            <button className="btn btn-outline-light" onClick={() => setShowLogoutConfirm(true)}>
              Logout
            </button>
          </div>
        </div>
      )}

  
  {showProfile && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h5>User Profile</h5>
            <p><strong>Name:</strong> {userName || "Not Available"}</p>
            <p><strong>Email:</strong> {userEmail || "Not Available"}</p>
            <button className="btn btn-secondary mt-3" onClick={() => setShowProfile(false)}>
              Close
            </button>
          </div>
        </div>
      )} 


     
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to logout?</p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this task permanently?</p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

     
      <div className="container mt-4">
        <div className="input-group mb-4">
          <span className="input-group-text"><FaSearch /></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search your tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

     
      <div className="container">
        <h5 className="fw-semibold">Title</h5>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <h5 className="fw-semibold">Description</h5>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter description..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <h5 className="fw-semibold">Date and Time (Optional)</h5>
        <input
          type="datetime-local"
          className="form-control mb-3 stylish-date-input"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-primary w-100" onClick={handleAddOrUpdate}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

     
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-outline-primary" onClick={() => setFilter("all")}>
          All Tasks
        </button>
        <button className="btn btn-outline-success" onClick={() => setFilter("completed")}>
          Completed Tasks
        </button>
        <button className="btn btn-outline-danger" onClick={() => setFilter("pending")}>
          Pending Tasks
        </button>
      </div>

      <div className="container mt-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center mt-4 fw-bold text-secondary">
            {searchQuery ? "No results found." : "No tasks available."}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="task-box shadow-sm p-3 mb-3 rounded bg-light d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCheckbox(task)}
                />
                <div>
                  <div className={task.completed ? "text-decoration-line-through text-muted" : ""}>
                    <div><strong>{task.title}</strong>: {task.desc}</div>
                  </div>
                  {task.dateTime && (
                    <div className="text-muted small mt-1">
                      <strong>Date & Time:</strong> {new Date(task.dateTime).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm ${task.pinned ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => togglePin(task)}
                  title={task.pinned ? "Unpin Note" : "Pin Note"}
                >
                  <FaThumbtack />
                </button>
                <button className="btn btn-success btn-sm" onClick={() => handleEdit(task)}>
                  <FaEdit />
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(task._id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
