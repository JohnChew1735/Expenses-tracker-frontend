import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraphExpenses } from "./GraphExpenses";

export function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const Add = () => {
    navigate("/Handling", { state: { mode: "add_expenses" } });
  };

  const Delete = (index) => {
    navigate("/Handling", { state: { mode: "delete_expenses", index } });
  };

  const Edit = (index) => {
    navigate("/Handling", { state: { mode: "edit_expenses", index } });
  };

  //change mode
  const toggleMode = () => {
    navigate("/", { state: { mode: "None" } });
  };

  //fetch all expenses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("http://localhost:8000/api/expenses");
        const data = await result.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchData();
  }, []);

  //fetch Balance
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
          <p>Current Mode: Expenses</p>
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
        <h1>Expenses list</h1>
        <button onClick={() => navigate("DeleteCategory")}>
          Delete category
        </button>
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
            {expenses.map((expense, index) => (
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
      </center>
      <GraphExpenses />
    </div>
  );
}
