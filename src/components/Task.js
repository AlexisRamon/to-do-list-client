import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Edit } from "./Edit";

export const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [editTaskId, setEditTaskId] = useState(null);
  
    useEffect(() => {
      const getTasks = () => {
        // Obtener las tareas desde la API
        fetch("http://localhost:9000/api")
          .then((res) => res.json())
          .then((data) => {
            setTasks(data); // Actualizar el estado de las tareas con los datos obtenidos
          })
          .catch((error) => {
            console.error("Error al obtener las tareas de la API:", error);
          });
      };
      getTasks(); // Llamar a la función getTasks cuando el componente se monte
    }, []);
  
    const handleDelete = (taskId) => {
      // Eliminar la tarea con el ID proporcionado
      fetch(`http://localhost:9000/api/${taskId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        window.location.href = "/";
    };
  
    const updateTaskStatus = (taskId) => {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          const newCompletedValue = task.completed === 0 ? 1 : 0;
          const updatedTask = { ...task, completed: newCompletedValue };
    
          // Actualizar el estado de la tarea con el ID proporcionado
          fetch(`http://localhost:9000/api/${taskId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
          })
          .then((res) => res.json())
          window.location.href = "/";
        }
        return task;
      });
    };

  return (
    <div className="Task">
      {tasks.map((task) => (
        <div
          className={`Format ${task.completed === 0 ? "completed" : ""}`}
          key={task.id}
        >
          {editTaskId === task.id ? (
            <Edit taskId={task.id} taskName={task.name_task} />
          ) : (
            <>
              <p className="P-Task">{task.name_task}</p>
              <FontAwesomeIcon
                icon={faPenSquare}
                onClick={() => task.completed !== 0 && setEditTaskId(task.id)}
                className={task.completed === 0 ? "disabled" : ""}
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(task.id)}
              />
              <FontAwesomeIcon
                icon={faCheck}
                onClick={() => updateTaskStatus(task.id)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
  
};
