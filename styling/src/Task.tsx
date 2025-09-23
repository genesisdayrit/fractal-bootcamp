import { useState } from 'react'

export default function Task({ taskData }) {

    const [checked, setChecked] = useState(false)
    
    const baseButtonStyle = "border border-px border-gray-300 w-5 h-5 rounded-md"
    const buttonChecked = baseButtonStyle + " bg-green-600 border-green-600"

    const baseBgStyle = "p-2 px-4 border border-gray-300 w-md flex flex-row items-center gap-3 rounded-lg font-[350]"
    const bgChecked = baseBgStyle + " bg-green-100"

    function toggleChecked() { 
        if (!checked) {
            console.log('clicked')
            setChecked(true)
        } else {
            console.log('clicked')
            setChecked(false)
        }
    }
    
    return (
    <>
        <div className={checked ? bgChecked : baseBgStyle}>
            <div id="checkbox-container" className={baseButtonStyle}>
                <button onClick={toggleChecked} className={checked ? buttonChecked : baseButtonStyle}></button>
            </div>
                <div id="task-area" className="flex flex-col justify-center rounded-md px-3 py-2">
                <div id="task-name" className="text-lg font-regular">{taskData.name}</div>
                <div className="text-sm text-gray-600">{taskData.description}</div>
            </div>
        </div>
        
    </>
    )
}
