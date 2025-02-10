import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export function GraphExpenses() {
  const [expenses, setExpenses] = useState([]);

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

  const COLORS = ["red", "blue", "green", "orange"];

  const positiveExpenses = expenses.map((expense) => ({
    ...expense,
    amount: Math.abs(expense.amount),
  }));

  const renderLabel = ({ name }) => name;

  return (
    <div style={{ display: "flex", gap: "50px" }}>
      <ResponsiveContainer width="50%" height={300}>
        <PieChart>
          <Pie
            data={positiveExpenses}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#green"
            label={renderLabel}
          >
            {positiveExpenses.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "20px" }}>
        <h2>Summary</h2>
        {expenses.map((expense) => {
          return (
            <div key={expense.name}>
              {expense.name}: RM{(-expense.amount).toFixed(2)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
