

export default function Row({item,deleteTask}){
    return(
        <li key={item.id} style={{marginTop:"20px", display:"flex", justifyContent:"space-between", width:"50%", marginLeft:"auto", marginRight:"auto"}}>{item.description}
        <button className='delete-button' onClick={() =>deleteTask(item.id)}>Delete</button>
        </li>
    )
}