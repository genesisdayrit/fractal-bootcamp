import { useState } from 'react'
import './App.css'
import Task from './Task'
// import Task, { type TaskData } from "./Task"

function App() {
  return (
    <div className='max-w-xlg flex justify-center font-[inter]'>
      <Task />
      {/* <TaskList /> */}
    </div>
  )
}

export default App


