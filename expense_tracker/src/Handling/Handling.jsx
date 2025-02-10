import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Handling() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "";
  const index = Number(location.state?.index || "");
  const [expenses, setExpenses] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expensesCategories, setExpensesCategories] = useState([]);

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

  //add expenses
  const Add = async () => {
    if (!name) {
      alert("Please enter a expense name");
      return;
    }
    if (!amount) {
      alert("Please enter an expense amount");
      return;
    }
    if (type === "Please select transaction type") {
      alert("Please select an expense type");
      return;
    }
    if (category === "Select a type first") {
      alert("Please select an expense category");
      return;
    }
    //change expenses positive value to be stored as negative value in the table
    const calculatedAmount =
      type === "Expenses" && amount >= 0 ? -Math.abs(amount) : Math.abs(amount);

    // prompt user to categorize the expenses
    if (category === "Others" && type === "Expenses") {
      const userInput = window.prompt(
        " You have chosen others as transaction category. Enter a new expenses category:"
      );

      if (!userInput || userInput.trim() === "") {
        alert("Please enter a category name");
        return null;
      } else {
        //userInput is not empty, proceed with adding expenses
        console.log(`User category given is ${userInput}`);
        try {
          const addExpenseCategoryResponse = await fetch(
            "http://localhost:8000/add_expenses_category",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: userInput,
              }),
            }
          );
          if (addExpenseCategoryResponse.ok) {
            //user category added successfully, proceed with getting its ID
            console.log(`Expenses category ${userInput} added successfully`);
            try {
              const getIDresponse = await fetch(
                `http://localhost:8000/api/expenses_id?name=${encodeURIComponent(
                  userInput
                )}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );
              //expensesID success, proceed with adding into the table
              const data = await getIDresponse.json();
              const expensesID = data.id;

              try {
                const addExpensesresponse = await fetch(
                  "http://localhost:8000/add_expenses",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: name,
                      amount: calculatedAmount,
                      type: type,
                      ExpensesID: expensesID,
                    }),
                  }
                );
                if (addExpensesresponse.ok) {
                  alert("Expenses added successfully");
                  navigate("/");
                }
              } catch (error) {
                console.error("Add expenses error", error);
              }
            } catch (error) {
              console.error("Get expenses id error", error);
            }
          }
        } catch (error) {
          console.error("Adding expenses category error", error);
        }
      }
    }
    // prompt user to categorize the income
    if (category === "Others" && type === "Income") {
      const userInput = window.prompt(
        " You have chosen others as transaction category. Enter a new income category:"
      );

      if (!userInput || userInput.trim() === "") {
        alert("Please enter a category name");
        return null;
      } else {
        //userInput is not empty, proceed with adding income
        console.log(`User category given is ${userInput}`);
        try {
          const addIncomeCategoryResponse = await fetch(
            "http://localhost:8000/add_income_category",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: userInput,
              }),
            }
          );
          if (addIncomeCategoryResponse.ok) {
            //user category added successfully, proceed with getting its ID
            console.log(`Income category ${userInput} added successfully`);
            try {
              const getIDresponse = await fetch(
                `http://localhost:8000/api/income_id?name=${encodeURIComponent(
                  userInput
                )}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );
              //IncomeID success, proceed with adding into the table
              const data = await getIDresponse.json();
              const IncomeID = data.id;

              try {
                const addIncomeresponse = await fetch(
                  "http://localhost:8000/add_income",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: name,
                      amount: calculatedAmount,
                      type: type,
                      IncomeID: IncomeID,
                    }),
                  }
                );
                if (addIncomeresponse.ok) {
                  alert("Income added successfully");
                  navigate("/");
                }
              } catch (error) {
                console.error("Add income error", error);
              }
            } catch (error) {
              console.error("Get income id error", error);
            }
          }
        } catch (error) {
          console.error("Adding income category error", error);
        }
      }
    }
    if (category !== "Others" && type === "Expenses") {
      try {
        const getIDresponse = await fetch(
          `http://localhost:8000/api/expenses_id?name=${encodeURIComponent(
            category
          )}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        //expensesID success, proceed with adding into the table
        const data = await getIDresponse.json();
        const expensesID = data.id;

        try {
          const addExpensesresponse = await fetch(
            "http://localhost:8000/add_expenses",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: name,
                amount: calculatedAmount,
                type: type,
                ExpensesID: expensesID,
              }),
            }
          );
          if (addExpensesresponse.ok) {
            alert("Expenses added successfully");
            navigate("/");
          }
        } catch (error) {
          console.error("Add expenses error", error);
        }
      } catch (error) {
        console.error("Get expenses id error", error);
      }
    }
    if (category !== "Others" && type === "Income") {
      try {
        const getIDresponse = await fetch(
          `http://localhost:8000/api/income_id?name=${encodeURIComponent(
            category
          )}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        //IncomeID success, proceed with adding into the table
        const data = await getIDresponse.json();
        const IncomeID = data.id;

        try {
          const addIncomeresponse = await fetch(
            "http://localhost:8000/add_income",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: name,
                amount: calculatedAmount,
                type: type,
                IncomeID: IncomeID,
              }),
            }
          );
          if (addIncomeresponse.ok) {
            alert("Income added successfully");
            navigate("/");
          }
        } catch (error) {
          console.error("Add income error", error);
        }
      } catch (error) {
        console.error("Get income id error", error);
      }
    }
  };

  //delete expenses
  const DeleteExpenses = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this expenses?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch("http://localhost:8000/delete_expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: expenses[index]?.id }),
        });
        if (response.ok) {
          alert("Deleted successfully");
          navigate("/");
        }
      } catch (error) {
        console.error("ERROR", error);
      }
    } else alert("Not deleted");
  };

  //edit expenses
  const EditExpenses = async () => {
    if (!name1) {
      alert("Please enter a expense name");
      return;
    }
    if (!amount1) {
      alert("Please enter an expense amount");
      return;
    }
    if (type1 === "Please select transaction type") {
      alert("Please select an expense type");
      return;
    }
    if (category1 === "Select a type first") {
      alert("Please select an expense category");
      return;
    } else {
      try {
        const response = await fetch("http://localhost:8000/delete_expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: expenses[index]?.id }),
        });
        if (response.ok) {
          alert(`Expenses ${name1} is being edited`);
        }
      } catch (error) {
        console.error("ERROR", error);
      }
      const calculatedAmount =
        type1 === "Expenses"
          ? -Math.abs(Number(amount1))
          : Math.abs(Number(amount1));

      // prompt user to categorize the expenses
      if (category1 === "Others" && type1 === "Expenses") {
        const userInput = window.prompt(
          " You have chosen others as transaction category. Enter a new expenses category:"
        );

        if (!userInput || userInput.trim() === "") {
          alert("Please enter a category name");
          return null;
        } else {
          //userInput is not empty, proceed with adding expenses
          console.log(`User category given is ${userInput}`);
          try {
            const addExpenseCategoryResponse = await fetch(
              "http://localhost:8000/add_expenses_category",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: userInput,
                }),
              }
            );
            if (addExpenseCategoryResponse.ok) {
              //user category added successfully, proceed with getting its ID
              console.log(`Expenses category ${userInput} added successfully`);
              try {
                const getIDresponse = await fetch(
                  `http://localhost:8000/api/expenses_id?name=${encodeURIComponent(
                    userInput
                  )}`,
                  {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  }
                );
                //expensesID success, proceed with adding into the table
                const data = await getIDresponse.json();
                const expensesID = data.id;

                try {
                  const addExpensesresponse = await fetch(
                    "http://localhost:8000/add_expenses",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: name1,
                        amount: calculatedAmount,
                        type: type1,
                        ExpensesID: expensesID,
                      }),
                    }
                  );
                  if (addExpensesresponse.ok) {
                    alert("Expenses added successfully");
                    navigate("/");
                  }
                } catch (error) {
                  console.error("Add expenses error", error);
                }
              } catch (error) {
                console.error("Get expenses id error", error);
              }
            }
          } catch (error) {
            console.error("Adding expenses category error", error);
          }
        }
      }
      // prompt user to categorize the income
      if (category1 === "Others" && type1 === "Income") {
        const userInput = window.prompt(
          " You have chosen others as transaction category. Enter a new income category:"
        );

        if (!userInput || userInput.trim() === "") {
          alert("Please enter a category name");
          return null;
        } else {
          //userInput is not empty, proceed with adding income
          console.log(`User category given is ${userInput}`);
          try {
            const addIncomeCategoryResponse = await fetch(
              "http://localhost:8000/add_income_category",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: userInput,
                }),
              }
            );
            if (addIncomeCategoryResponse.ok) {
              //user category added successfully, proceed with getting its ID
              console.log(`Income category ${userInput} added successfully`);
              try {
                const getIDresponse = await fetch(
                  `http://localhost:8000/api/income_id?name=${encodeURIComponent(
                    userInput
                  )}`,
                  {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  }
                );
                //IncomeID success, proceed with adding into the table
                const data = await getIDresponse.json();
                const IncomeID = data.id;

                try {
                  const addIncomeresponse = await fetch(
                    "http://localhost:8000/add_income",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: name1,
                        amount: calculatedAmount,
                        type: type1,
                        IncomeID: IncomeID,
                      }),
                    }
                  );
                  if (addIncomeresponse.ok) {
                    alert("Income added successfully");
                    navigate("/");
                  }
                } catch (error) {
                  console.error("Add income error", error);
                }
              } catch (error) {
                console.error("Get income id error", error);
              }
            }
          } catch (error) {
            console.error("Adding income category error", error);
          }
        }
      }
      if (category1 !== "Others" && type1 === "Expenses") {
        try {
          const getIDresponse = await fetch(
            `http://localhost:8000/api/expenses_id?name=${encodeURIComponent(
              category1
            )}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          //expensesID success, proceed with adding into the table
          const data = await getIDresponse.json();
          const expensesID = data.id;

          try {
            const addExpensesresponse = await fetch(
              "http://localhost:8000/add_expenses",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: name1,
                  amount: calculatedAmount,
                  type: type1,
                  ExpensesID: expensesID,
                }),
              }
            );
            if (addExpensesresponse.ok) {
              alert("Expenses added successfully");
              navigate("/");
            }
          } catch (error) {
            console.error("Add expenses error", error);
          }
        } catch (error) {
          console.error("Get expenses id error", error);
        }
      }
      if (category1 !== "Others" && type1 === "Income") {
        try {
          const getIDresponse = await fetch(
            `http://localhost:8000/api/income_id?name=${encodeURIComponent(
              category1
            )}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          //IncomeID success, proceed with adding into the table
          const data = await getIDresponse.json();
          const IncomeID = data.id;

          try {
            const addIncomeresponse = await fetch(
              "http://localhost:8000/add_income",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: name1,
                  amount: calculatedAmount,
                  type: type1,
                  IncomeID: IncomeID,
                }),
              }
            );
            if (addIncomeresponse.ok) {
              alert("Income added successfully");
              navigate("/");
            }
          } catch (error) {
            console.error("Add income error", error);
          }
        } catch (error) {
          console.error("Get income id error", error);
        }
      }
    }
  };

  //used in adding
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [character, setCharacter] = useState(50);

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setCategory("");
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    setCharacter(50 - name.length);
  }, [name]);

  //used in editing
  const [name1, setName1] = useState("");
  const [amount1, setAmount1] = useState(0);
  const [type1, setType1] = useState("");
  const [category1, setCategory1] = useState();
  const [character1, setCharacter1] = useState(50);

  const handleTypeChange1 = (event) => {
    setType1(event.target.value);
    setCategory1("");
  };

  const handleCategoryChange1 = (event) => {
    setCategory1(event.target.value);
  };

  useEffect(() => {
    setCharacter1(50 - name1.length);
  }, [name1]);

  //get all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("http://localhost:8000/api/all");
        const data = await result.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchData();
  }, []);

  //delete expenses
  if (mode === "delete_expenses") {
    return (
      <div>
        <button onClick={() => navigate("/")}>Back</button>
        <center>
          <h1>Delete</h1>
          Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            style={{ color: "black" }}
            type="text"
            value={expenses[index]?.name || ""}
            disabled
          ></input>
          <p></p>
          Amount:&nbsp;&nbsp;
          <input
            style={{ color: "black" }}
            type="number"
            value={
              expenses[index]?.type === "Expenses"
                ? Math.abs(expenses[index]?.amount || 0)
                : Math.abs(expenses[index]?.amount || 0)
            }
            disabled
          ></input>
          <p></p>
          Type:&nbsp;&nbsp;
          <input
            style={{ color: "black" }}
            type="type"
            value={expenses[index]?.type || ""}
            disabled
          ></input>
          <p></p>
          Category:&nbsp;&nbsp;
          <input
            style={{ color: "black" }}
            type="type"
            value={expenses[index]?.category || ""}
            disabled
          ></input>
          <button onClick={DeleteExpenses}>Delete</button>
        </center>
      </div>
    );
  }

  //edit expenses
  if (mode === "edit_expenses") {
    return (
      <div>
        <button onClick={() => navigate("/")}>Back</button>
        <center>
          <h1>Edit</h1>
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
                  Category
                </th>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Previous
                </th>
                <th style={{ border: "1px solid black", padding: "20px" }}>
                  Edit to:
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  Name:
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  {expenses[index]?.name || ""}
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  <input
                    style={{ color: "black" }}
                    type="text"
                    value={name1}
                    input={name1}
                    onChange={(e) => setName1(e.target.value)}
                    onFocus={() => setName1("")}
                  ></input>
                  <p> Characters left: {character1}</p>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  Amount:
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  RM {Math.abs(Number(expenses[index]?.amount || 0)).toFixed(2)}
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  <input
                    style={{ color: "black" }}
                    type="number"
                    value={amount1}
                    input={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    onFocus={() => setAmount1("")}
                  ></input>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  Type:
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  {expenses[index]?.type || ""}
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  <label>
                    Type :&nbsp;&nbsp; &nbsp;{" "}
                    <select onChange={handleTypeChange1}>
                      <option value="">Please select transaction type</option>
                      <option value="Income">Income</option>
                      <option value="Expenses">Expenses</option>
                    </select>
                  </label>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  Category:
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  {expenses[index]?.category || ""}
                </td>
                <td style={{ border: "1px solid black", padding: "20px" }}>
                  <p>
                    Please select transaction type to select transaction
                    category
                  </p>
                  <label>
                    Category :&nbsp;
                    <select
                      value={category1 || expenses[index]?.category || ""}
                      onChange={handleCategoryChange1}
                      style={{ width: "150px" }}
                    >
                      (
                      <option value="">
                        {" "}
                        Please select transaction category
                      </option>
                      )
                      {type1 === "Income"
                        ? incomeCategories.map((cat, index) => (
                            <option key={index} value={cat}>
                              {cat}
                            </option>
                          ))
                        : type1 === "Expenses"
                        ? expensesCategories.map((cat, index) => (
                            <option key={index} value={cat}>
                              {cat}
                            </option>
                          ))
                        : null}
                    </select>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <p></p>
          <button onClick={EditExpenses}>Edit</button>
        </center>
      </div>
    );
  }

  //add expenses
  if (mode === "add_expenses") {
    return (
      <div>
        <button onClick={() => navigate("/")}>Back</button>
        <center>
          <h1>Add</h1>
          <p>
            Please select a transaction type before selecting transaction
            category
          </p>
          Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="text"
            input={name}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <p>Characters left: {character}</p>
          <p></p>
          Amount:&nbsp;&nbsp;
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></input>
          <p></p>
          <label>
            Type :&nbsp;&nbsp; &nbsp;
            <select
              value={type}
              onChange={handleTypeChange}
              style={{ width: "150px" }}
            >
              <option value="">Please select transaction type</option>
              <option value="Income">Income</option>
              <option value="Expenses">Expenses</option>
            </select>
          </label>
          <p></p>
          <label>
            Category :&nbsp;
            <select
              value={category}
              onChange={handleCategoryChange}
              style={{ width: "150px" }}
            >
              (<option value=""> Please select transaction category</option>)
              {type === "Income"
                ? incomeCategories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))
                : type === "Expenses"
                ? expensesCategories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))
                : null}
            </select>
          </label>
          <p></p>
          <button onClick={Add}>Done</button>
        </center>
      </div>
    );
  }
}
