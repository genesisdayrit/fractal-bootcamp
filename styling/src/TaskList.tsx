import Task from "./Task"

export default function TaskList() {

    const tasks = [
        {
            id: 0,
            name: "Sweep the floors",
            description: "Get under the cabinets, do a good job",
            checked: false
        },
        {
            id: 1,
            name: "Laundry",
            description: "Wash, dry, fold, and put away clothes and linens.",
            checked: false
        },
        {
            id: 2,
            name: "Dishwashing",
            description: "Wash and dry dishes, posts, pans, and utensils",
            checked: false
        },
        {
            id: 3,
            name: "Vacuuming",
            description: "Vacuum carpets, rugs, and floors throughout the house",
            checked: false
        },
    ]
    
    return (
        <>
        <div className='w-1/2 h-screen flex flex-col gap-2 items-center justify-center'>
            {tasks.map((task) => <Task taskData={task} />)}
        </div>
        </>

    )

}
