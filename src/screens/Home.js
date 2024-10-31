import "./Home.css";
import { useEffect, useState } from "react";

import axios from "axios";
import Row from "../components/Row";
import { useUser } from "../context/useUser";

const url = " http://localhost:3001";
function Home() {
  const { user } = useUser();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        alert(error.response.data.error ? error.response.data.error : error);
      });
  }, []);

  const addTask = () => {
    const headers = { headers: { Authorization: user.token } };

    axios
      .post(url + "/create", { description: task }, headers)
      .then((response) => {
        setTasks([...tasks, { id: response.data.id, description: task }]);
        setTask("");
      })
      .catch((error) => {
        alert(error.response.data.error ? error.response.data.error : error);
      });
  };

  const deleteTask = (id) => {
    const headers = { headers: { Authorization: user.token } };

    axios
      .delete(url + "/delete/" + id, headers)
      .then((response) => {
        const withoutRemoved = tasks.filter((item) => item.id !== id);
        setTasks(withoutRemoved);
      })
      .catch((error) => {
        alert(error.response.data.error ? error.response.data.error : error);
      });
  };

  return (
    <div id="container">
      <div
        style={{
          minHeight: "5vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <button
          className="delete-button"
          //clears session storage key user and reloads screen
          onClick={() => {
            try {
              sessionStorage.removeItem("user");
              window.location.reload();
            } catch (error) {
              alert(
                error.response.data.error ? error.response.data.error : error
              );
            }
          }}
        >
          Log Out
        </button>
      </div>
      <div
        style={{
          width: "100%",
          minHeight: "10vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Todos</h1>
      </div>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Add new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
        />
       
      </form>
      <div style={{display:"flex", alignItems:"center", justifyContent:"center", width:"100%", minHeight:"5vh"}}>
      <p>To add task, press enter</p>
      </div>
      <div
        class="tasks-list"
        style={{
          border: "solid 5px #234159",
          marginTop: "5vh",
          width: "50vw",
          marginLeft: "25vw",
          borderRadius: " 12px",
          padding: "10px",
          height: "60vh",
        
          overflow: "auto",
        }}
      >
        <ul>
          {tasks.map((item) => (
            <Row key={item.id} item={item} deleteTask={deleteTask} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
