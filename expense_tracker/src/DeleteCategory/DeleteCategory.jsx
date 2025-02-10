import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function DeleteCategory() {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expensesCategories, setExpensesCategories] = useState([]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setCategory("");
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  //handle delete category request
  const deletecategory = async () => {
    if (type === "Please select transaction type" || !type) {
      alert("Please select type of transaction that you want to delete");
      return;
    }
    if (category === "Please select transaction category" || !category) {
      alert("Please select category of transaction that you want to delete");
      return;
    }

    try {
      const endpoint =
        type === "Expenses"
          ? "http://localhost:8000/delete_expenses_category"
          : "http://localhost:8000/delete_income_category";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      if (response.ok) {
        alert(`Category ${category} deleted successfully`);
        navigate("/");
      } else {
        alert(`Deletion of category ${category} failed`);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

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

  return (
    <div>
      <button onClick={() => navigate("/")}>Back</button>
      <center>
        <div>
          <h1>Delete category</h1>
          <label>
            Type :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
          <p>
            Please select transaction type before selecting transaction category
          </p>
          <label>
            Category :&nbsp;
            <select
              value={category}
              onChange={handleCategoryChange}
              style={{ width: "150px" }}
            >
              (<option value=""> Please select transaction category</option>)
              {type === "Income"
                ? incomeCategories
                    .filter((cat) => cat !== "Others") // Exclude "Others"
                    .map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))
                : type === "Expenses"
                ? expensesCategories
                    .filter((cat) => cat !== "Others") // Exclude "Others"
                    .map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))
                : null}
            </select>
          </label>
          <p></p>
          <button onClick={deletecategory}>Delete Category</button>
        </div>
      </center>
    </div>
  );
}
