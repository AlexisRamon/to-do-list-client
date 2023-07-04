import React, { useState } from "react";

export const Edit = ({ taskId, taskName }) => {
  const [updatedTask, setUpdatedTask] = useState(taskName);

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = "/";

    if (!updatedTask.trim()) {
        return; // Evita la actualización si el campo está vacío
      }

      // Enviar la nueva tarea al servidor
    fetch(`http://localhost:9000/api/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name_task: updatedTask }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error al actualizar la tarea:", error);
      });
  };

  return (
    <form className="Todo">
      <input
        type="text"
        className="edit-input"
        placeholder="Update task"
        value={updatedTask}
        onChange={(event) => setUpdatedTask(event.target.value)}
      />
      <button onClick={handleSubmit} type="submit" className="todo-btn">
        Update task
      </button>
    </form>
  );
};
