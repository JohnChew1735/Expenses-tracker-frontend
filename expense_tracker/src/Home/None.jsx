import { React, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Income } from "./Income";
import { Expenses } from "./Expenses";
import { GraphNone } from "./GraphNone";

export function None() {
  const [none, setNone] = useState([]);

  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const Add = () => {
    navigate("/Handling", { state: { mode: "add_expenses" } });
  };

  const Delete = (index) => {
    navigate("/Handling", { state: { mode: "delete_expenses", index } });
  };

  const Edit = (index) => {
    navigate("/Handling", { state: { mode: "edit_expenses", index } });
  };

  const [mode, setMode] = useState("None");

  //change mode
  const toggleMode = () => {
    if (mode === "None") {
      setMode("Income"); // Switch from None to Income
      navigate("/", { state: { mode: "Income" } }); // Update the mode state in URL
    } else if (mode === "Income") {
      setMode("Expenses"); // Switch from Income to Expenses
      navigate("/", { state: { mode: "Expenses" } }); // Update the mode state in URL
    } else if (mode === "Expenses") {
      setMode("None"); // Switch from Expenses to None
      navigate("/", { state: { mode: "None" } }); // Update the mode state in URL
    }
  };

  useEffect(() => {
    if (location.state && location.state.mode) {
      setMode(location.state.mode);
    }
  }, [location]);

  //fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("http://localhost:8000/api/all");
        const data = await result.json();
        setNone(data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchData();
  }, []);

  //get Balance
  useEffect(() => {
    const getBalance = async () => {
      try {
        const response = await fetch("http://localhost:8000/balance");
        const data = await response.json();

        let totalBalance = 0;
        for (let i = 0; i < data.length; i++) {
          totalBalance += data[i].amount;
        }
        setBalance(totalBalance);
      } catch (error) {
        console.error("Error", error);
      }
    };
    getBalance();
  }, []);

  if (mode === "None") {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px", // Adds spacing between sections
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={toggleMode}>Toggle Mode</button>
            <p>Current Mode: {mode}</p>
          </div>

          {/* Right */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button onClick={Add}>Add New Income/Expenses</button>
              <p>Balance: RM {balance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <center>
          <h1>Budgeting list</h1>
          <button onClick={() => navigate("DeleteCategory")}>
            Delete category
          </button>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={() => navigate("Filter")}>Filter </button>
          <p></p>
          <table
            style={{
              borderCollapse: "collapse",
              textAlign: "center",
              tableLayout: "auto",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Amount (RM)
                </th>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Type
                </th>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Category
                </th>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Action
                </th>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {none.map((expense, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {expense.name}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {expense.amount < 0
                      ? `RM${Math.abs(expense.amount).toFixed(2)}`
                      : `RM${Math.abs(expense.amount).toFixed(2)}`}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {expense.type}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {expense.category}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    <button onClick={() => Edit(index)}>Edit</button>
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    <button onClick={() => Delete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p></p>
        </center>
        <GraphNone />
      </div>
    );
  }

  if (mode === "Income") {
    return <Income />;
  }
  if (mode === "Expenses") {
    return <Expenses />;
  }
}
