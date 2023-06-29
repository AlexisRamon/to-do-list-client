import React, {  } from "react";
import { AddTask } from "../components/AddTask";
import { Task } from "../components/Task";
// import { Edit } from "../components/Edit";

export const Wrapper = () => {

  return (
    <div className="Wrapper">
      <h1>Get Things Done!</h1>
      <AddTask/>
      <Task/>
    </div>
  );
};
