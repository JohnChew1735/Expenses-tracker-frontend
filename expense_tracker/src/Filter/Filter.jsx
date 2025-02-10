import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Filter() {
  const navigate = useNavigate();
  const [output, setOutput] = useState("");
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expensesCategories, setExpensesCategories] = useState([]);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  //get all income categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          "http://localhost:8000/api/income_categories"
        );
        const data = await result.json();
        setIncomeCategories(data.map((category) => category.name));
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchData();
  }, []);

  //get all expenses categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          "http://localhost:8000/api/expenses_categories"
        );
        const data = await result.json();
        setExpensesCategories(data.map((category) => category.name));
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchData();
  }, []);

  const filterResult = async () => {
    if (mode === "name") {
      if (!name) {
        alert("Please enter a transaction name to be filtered");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:8000/get_expenses_by_name",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          setFilteredData(data.data);
        } else {
          setFilteredData([]);
          alert(data.message);
        }
      } catch (error) {
        console.error("Error", error);
        alert("Failed to fetch data. Please try again.");
      }
    }
    if (mode === "type-amount") {
      if (!type) {
        alert("Please select a transaction type to be filtered");
        return;
      }
      if (!amount) {
        alert("Please enter transaction amount to be filtered");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:8000/get_expenses_by_type_and_amount",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, amount }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          setFilteredData(data.data);
        } else {
          setFilteredData([]);
          alert(data.message);
        }
      } catch (error) {
        console.error("Error", error);
        alert("Failed to fetch data. Please try again.");
      }
    }
    if (mode === "type-category") {
      if (!type) {
        alert("Please select a transaction type to be filtered");
        return;
      }
      if (!category) {
        alert("Please select a transaction category to be filtered");
        return;
      }

      setFilteredData([]); // Clear table before fetching new data

      try {
        const response = await fetch(
          "http://localhost:8000/get_expenses_by_type_and_category",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, category }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          setFilteredData(data.data);
        } else {
          alert(data.message || "No data found.");
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error", error);
        alert("Failed to fetch data. Please try again.");
      }
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>Back</button>
      <center>
        <h1>Filter by</h1>
        <p>Please select a category to filter transaction</p>
        <label>
          <select
            onChange={(e) => {
              setOutput(e.target.value);
              setMode("");
              setFilteredData([]);
            }}
            value={output}
          >
            <option value="">Select Filter</option>
            <option value="name">Name</option>
            <option value="type-amount">Type and Amount</option>
            <option value="type-category">Type and Category</option>
          </select>
        </label>
        <p></p>

        {/* if user filter by name */}
        {output === "name" && (
          <div>
            Name:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "150px" }}
            ></input>
            <p></p>
            <button
              onClick={() => {
                setMode(output);
                filterResult();
              }}
            >
              Filter
            </button>
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
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Name
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Type
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Amount(RM)
                  </td>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.name}
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.type}
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        RM
                        {item.type === "Expenses"
                          ? Math.abs(Number(item.amount).toFixed(2))
                          : item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ border: "1px solid black", padding: "8px" }}
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p></p>
          </div>
        )}

        {/* if user selects type and amount */}
        {output === "type-amount" && (
          <div>
            Type:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label>
              <select
                onChange={(e) => setType(e.target.value)}
                value={type}
                style={{ width: "150px" }}
              >
                <option value="">Select an option </option>
                <option value="Income">Income </option>
                <option value="Expenses">Expenses </option>
              </select>
            </label>
            <p></p>
            Amount: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="number"
              value={amount === 0 ? "" : amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
            ></input>
            <p></p>
            <button
              onClick={() => {
                setMode(output);
                filterResult();
              }}
            >
              Filter
            </button>
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
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Name
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Type
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Amount (RM)
                  </td>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.name}
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.type}
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        RM
                        {item.type === "Expenses"
                          ? Math.abs(Number(item.amount)).toFixed(2)
                          : item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ border: "1px solid black", padding: "8px" }}
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* if user selects output to be type and category */}
        {output === "type-category" && (
          <div>
            <label>
              Type:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: "150px" }}
              >
                <option value="">Select an option </option>
                <option value="Income">Income </option>
                <option value="Expenses">Expenses </option>
              </select>
            </label>
            <p></p>
            <label>
              Category :&nbsp;&nbsp;&nbsp;&nbsp;
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "150px" }}
              >
                <option value=""> Please select transaction category</option>
                {type === "Income"
                  ? incomeCategories
                      .filter((cat) => cat !== "Others") // Exclude "Others"//
                      .map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))
                  : type === "Expenses"
                  ? expensesCategories
                      .filter((cat) => cat !== "Others") // Exclude "Others"//
                      .map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))
                  : null}
              </select>
            </label>
            <p></p>
            <button
              onClick={() => {
                setMode(output);
                filterResult();
              }}
            >
              Filter
            </button>
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
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Name
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Type
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    Amount
                  </td>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.name}
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.type}
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.type === "Expenses"
                          ? Math.abs(Number(item.amount))
                          : item.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ border: "1px solid black", padding: "8px" }}
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <p></p>
      </center>
    </div>
  );
}
