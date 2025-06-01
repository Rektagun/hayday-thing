import "./output.css";
import axios from "axios";
import { useState } from "react";
import ItemCard from "./comps/itemCard";

function App() {

  const [user_level, setUserLevel] = useState(2);
  const [itemsDetails, setItemsDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [neededItems, setNeededItems] = useState();

  function handleChange(e) {
    setUserLevel(e.target.value)
  }

  const getWholeDatabase = async () => {
    const whole_Database = await axios.get('http://localhost:3001/api/data');
    if (whole_Database) {
      console.log("Got data from backend");
    }
    else {
      setIsLoading(true)
    }
  }

  getWholeDatabase();
  const sendLevel = () => { };

  function addCount(id) {
    setItemsDetails(itemsDetails.map(item => {
      if (item.id === id) {
        return {
          ...item,
          count: item.count + 1
        }
      }
      return item;
    }));
  };

  function calculate() {
    setNeededItems(itemsDetails.map(item => {
      return {
        id: item.id,
        name: item.name,
        count: item.count,
      }
    }))
  };

  // HTML

  return (

    <div className="flex flex-col bg-slate-300">
      <h1 className="text-center text-4xl">HayDay Thing</h1>

      <div className="flex m-auto">
        {isLoading ? (
          <div>
            Loading database...
          </div>
        ) : (
          <></>
        )}
      </div>

    </div>
  );
}

export default App;
