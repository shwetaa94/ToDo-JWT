import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [item, setItem] = useState("");
  const [list, setList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
   }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/todos",{
        headers:{Authorization: "Bearer "+ token }
      });
      setList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const itemEvent = (event) => {
    setItem(event.target.value);
  };

  const addItem = async () => {
    if (!item.trim()) return; // Ensure item is not empty or only whitespace
  
    try {
      // Save item to database
      await axios.post("http://localhost:8080/addtodo", { todo: item },{

        headers:{Authorization: "Bearer "+ token }
      }); // Use the correct property name for the todo item
  
      // Fetch updated list of todos
      await fetchData();
  
      // Clear input field
      setItem("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  

  const deleteItem = async (id) => {
    try {
      // Delete item from database
      await axios.delete(`http://localhost:8080/todos/${id}`,{

      headers:{Authorization: "Bearer "+ token }
    });

      // Fetch updated list of todos
      await fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  return (
    <>
      <div className="main_div">
        <div className="center_div">
          <h1>TO- DO List</h1>

          <div className="inputt">
            <input
              type="text"
              onChange={itemEvent}
              value={item}
              placeholder="Add a task"
            />
            <button onClick={addItem} className="addd">
              +
            </button>
          </div>

          <br />

          {list.map((val) => {
            return (
              <div className="listitems" key={val._id}>
                <div>{val.todo}</div>
                <button onClick={() => deleteItem(val._id)} className="remove">
                  x
                </button>
              </div>
            );
          })}

          <br />
        </div>
      </div>
    </>
  );
};

export default Home;
