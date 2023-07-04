import React, {  } from "react";
import { Add } from "../components/Add";
import { Task } from "../components/Task";

export const Wrapper = () => {

  const requestNotificationPermission = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Permisos de notificación otorgados");
          // Puedes realizar acciones adicionales aquí después de obtener los permisos
        } else {
          console.log("Permisos de notificación denegados");
          // Puedes manejar el caso en el que los permisos sean denegados
        }
      });
    }
  };
  
  // Llama a la función para solicitar los permisos de notificación
  requestNotificationPermission();  

  return (
    <div className="Wrapper">
      <h1>Get Things Done!</h1>
      <Add/>
      <Task/>
    </div>
  );
};
