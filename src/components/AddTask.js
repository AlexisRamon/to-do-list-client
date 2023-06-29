import React, { useState } from "react";

export const AddTask = () => {
  const [taskName, setTaskName] = useState("");

  const handleInputChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar que haya texto escrito en el input
    if (taskName.trim() === "") {
      return;
    }

    const newTask = {
      name_task: taskName,
    };

    // Enviar la nueva tarea al servidor
    fetch("http://localhost:9000/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
        window.location.href = "/";
  };

  return (
    <form className="Todo" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="What is the task?"
        value={taskName}
        onChange={handleInputChange}
      />
      <button type="submit" className="todo-btn">
        Add Task
      </button>
    </form>
  );
};
