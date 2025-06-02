import "./output.css";
import axios from "axios";
import { useState, useEffect } from "react";
import ItemCard from "./comps/itemCard";

function App() {
  const [user_level, setUserLevel] = useState(2);
  const [itemsDetails, setItemsDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [neededItems, setNeededItems] = useState([]);
  const [whole_Database, setWhole_Database] = useState();
  const [userCounts, setUserCounts] = useState({}); // Track user item counts

  function handleChange(e) {
    setUserLevel(e.target.value);
  }

  const getWholeDatabase = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/api/data');
      setWhole_Database(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch data on mount
  useEffect(() => {
    getWholeDatabase();
  }, []);

  // Process database when it changes
  useEffect(() => {
    if (whole_Database?.data?.records) {
      const records = whole_Database.data.records;
      console.log('Raw records:', records);

      const parsedItems = records.map(record => {
        const path = record._fields[0]; // Get the path from _fields

        // Extract item data (start node)
        const itemNode = path.start;
        const itemProps = itemNode.properties;

        // Extract relationship data
        const relationship = path.segments[0]?.relationship;
        const relationshipType = relationship?.type;
        const relationshipProps = relationship?.properties;

        // Extract connected node (end node)
        const connectedNode = path.end;
        const connectedProps = connectedNode?.properties;

        return {
          id: itemNode.elementId,
          name: itemProps.name,
          level: itemProps.level?.low || 0,
          quantity: itemProps.quantity?.low || 0,
          imageUrl: itemProps.imageUrl,
          minPrice: itemProps.minPrice?.low || 0,
          maxPrice: itemProps.maxPrice?.low || 0,
          xp: itemProps.xp?.low || 0,
          productionTime: itemProps.productionTime,

          // Relationship data
          relationshipType,
          relationshipAmount: relationshipProps?.amount?.low || 0,

          // Connected node data
          connectedTo: {
            name: connectedProps?.name,
            labels: connectedNode?.labels
          }
        };
      });

      console.log('Parsed items:', parsedItems);
      setItemsDetails(parsedItems);
    }
  }, [whole_Database]);

  // Recalculate based on user level changes only (no item tracking needed)
  useEffect(() => {
    // Add any level-based calculations here if needed
    console.log('User level changed to:', user_level);
  }, [user_level]);

  function addCount(id) {
    setUserCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  }

  function decrementCount(id) {
    setUserCounts(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0)
    }));
  }

  function removeProduct(id) {
    setUserCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[id];
      return newCounts;
    });
  }

  const records = whole_Database?.data?.records || [];

  return (
    <div className="flex flex-col bg-slate-300">
      <h1 className="text-center text-4xl">HayDay Thing</h1>
      <div className="flex m-auto">
        <input
          type="number"
          value={user_level}
          onChange={handleChange}
          placeholder="User Level"
        />
        {isLoading && <p>Loading...</p>}
        {itemsDetails.map(item => (
          <ItemCard
            key={item.id}
            name={item.name}
            icon_File={item.imageUrl}
            count={userCounts[item.id] || 0}
            incrementCount={() => addCount(item.id)}
            decrementCount={() => decrementCount(item.id)}
            removeProduct={() => removeProduct(item.id)}
          />
        ))}
      </div>
      <div>
        <h2>Needed Items: {neededItems.length}</h2>
        {neededItems.map(item => (
          <div key={item.id}>{item.name}: {item.count}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
