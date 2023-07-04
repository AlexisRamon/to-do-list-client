import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faCheck, faClock } from "@fortawesome/free-solid-svg-icons";

import { Edit } from "./Edit";

export const Task = () => {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [editTaskId, setEditTaskId] = useState(null); // Estado para almacenar el ID de la tarea en edición
  const [selectedTime, setSelectedTime] = useState({}); // Estado para almacenar la hora seleccionada para la alarma
  const [editedTime, setEditedTime] = useState(""); // Estado para almacenar la hora editada

  useEffect(() => {
    const getTasks = () => {
      // Obtener las tareas desde la API al cargar el componente
      fetch("http://localhost:9000/api")
        .then((res) => res.json())
        .then((data) => {
          setTasks(data); // Actualizar el estado de las tareas con los datos obtenidos
        })
        .catch((error) => {
          console.error("Error al obtener las tareas de la API:", error);
        });
    };
    getTasks();
  }, []);

  useEffect(() => {
        // Obtener las horas de alarma y nombres de tareas desde la base de datos y mostrar notificaciones
        fetch("http://localhost:9000/api")
        .then((res) => res.json())
        .then((data) => {
          const rows = data;
          const alarms = rows.map((row) => row.alarm);
          const nameTasks = rows.map((row) => row.name_task);
  
          nameTasks.forEach((nameTask, index) => {
            const alarm = alarms[index];
            const message = `Esto es un recordatorio para tu tarea ${nameTask} - ${alarm}`;
            showNotificationAtSpecificTime(alarm, message); // Mostrar notificación en la hora especificada
          });
        })
        .catch((error) => {
          console.error("Error al obtener la hora desde la base de datos:", error);
        });
  }, [])

  const handleDelete = (taskId) => {
    // Eliminar la tarea con el ID proporcionado
    fetch(`http://localhost:9000/api/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      window.location.href = "/"; // Redirigir a la página principal después de eliminar la tarea
  };

  const updateTaskStatus = (taskId) => {
    // Actualizar el estado de la tarea con el ID proporcionado
    tasks.forEach((task) => {
      if (task.id === taskId) {
        const newCompletedValue = task.completed === 0 ? 1 : 0;
        const updatedTask = { ...task, completed: newCompletedValue, alarm: "00:00" };

        fetch(`http://localhost:9000/api/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        })
          .then((res) => res.json())
          window.location.href = "/"; // Redirigir a la página principal después de actualizar la tarea
      }
    });
  };

  const updateTaskAlarm = (taskId) => {
    // Actualizar la hora de alarma de la tarea con el ID proporcionado
    const updatedTask = tasks.find((task) => task.id === taskId);
    if (updatedTask) {
      updatedTask.alarm = editedTime;

      fetch(`http://localhost:9000/api/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })
        .then((res) => res.json())
        window.location.href = "/"; // Redirigir a la página principal después de actualizar la tarea
    }
  };

  const handleTimeChange = (event, taskId) => {
    // Manejar el cambio de hora en el selector para la alarma
    const { value } = event.target;
    setSelectedTime((prevSelectedTime) => ({
      ...prevSelectedTime,
      [taskId]: value,
    }));
    setEditedTime(value);
  };

  const closeClock = (taskId) => {
    // Cerrar el selector de hora para la alarma de la tarea con el ID proporcionado
    setSelectedTime((prevSelectedTime) => ({
      ...prevSelectedTime,
      [taskId]: undefined,
    }));
  };

  const finishAlert = (taskName) => {
    // Mostrar una alerta al completar una tarea
    alert(`Task "${taskName}" is finished. Congratulations!`);
  };  

  const showNotificationAtSpecificTime = (targetTime, message) => {
    // Mostrar una notificación en un momento específico
    const checkTime = () => {
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      if (currentTime.startsWith(targetTime)) {
        showNotification(message); // Mostrar la notificación
        clearInterval(interval); // Limpiar el intervalo para dejar de verificar la hora
      }
    };

    const interval = setInterval(checkTime, 1000); // Verificar la hora cada segundo
  };

  const showNotification = (message) => {
    // Mostrar una notificación en el navegador
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Notificación", { body: message }); // Mostrar la notificación si los permisos están concedidos
      } else if (Notification.permission !== "denied") {
        // Solicitar permisos de notificación si no se han denegado
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Notificación", { body: message }); // Mostrar la notificación si se conceden los permisos
          }
        });
      }
    }
  };

  return (
    <div className="Task">
      {tasks.map((task) => (
        <div className={`Format ${task.completed === 0 ? "completed" : ""}`} key={task.id}>
          {editTaskId === task.id ? (
            <Edit taskId={task.id} taskName={task.name_task} />
          ) : (
            <>
              <p className="P-Task">{task.name_task}</p>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(task.id)}
              />
              <FontAwesomeIcon
                icon={faPen}
                onClick={() => task.completed !== 0 && setEditTaskId(task.id)}
                className={task.completed === 0 ? "disabled" : ""}
              />
              <FontAwesomeIcon
                icon={faClock}
                onClick={() => task.completed !== 0 && setSelectedTime((prevSelectedTime) => ({
                  ...prevSelectedTime,
                  [task.id]: task.alarm,
                }))}
                className={task.completed === 0 ? "disabled" : ""}
              />
              <FontAwesomeIcon
                icon={faCheck}
                onClick={() => {
                  updateTaskStatus(task.id);
                  if (task.completed === 1) {
                    finishAlert(task.name_task);
                  }
                }}
              />
              {selectedTime[task.id] !== undefined && (
                <div className="edit-overlay">
                  <div className="edit-container">
                    <h2 className="edit-title">Seleccionar Hora</h2>
                    <input
                      type="time"
                      value={selectedTime[task.id] || ""}
                      onChange={(event) => handleTimeChange(event, task.id)}
                      className="custom-timepicker"
                    />
                    <div className="edit-buttons">
                      <button
                        className="edit-button"
                        onClick={() => {
                          setEditedTime(selectedTime[task.id]);
                          closeClock(task.id);
                          updateTaskAlarm(task.id);
                        }}
                      >
                        Guardar
                      </button>
                      <button className="edit-button" onClick={() => closeClock(task.id)}>
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};