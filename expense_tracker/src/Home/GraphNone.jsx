import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export function GraphNone() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  //fetch all income
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("http://localhost:8000/api/income");
        const data = await result.json();
        setIncome(data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchData();
  }, []);

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

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = -expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings = totalIncome - totalExpenses;

  const finalData = [
    { name: "Expenses", amount: totalExpenses },
    { name: "Savings", amount: totalSavings },
  ];

  const COLORS = ["red", "blue"];

  const renderLabel = ({ name }) => name;

  return (
    <div style={{ display: "flex", gap: "50px" }}>
      <ResponsiveContainer width="50%" height={300}>
        <PieChart>
          <Pie
            data={finalData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#green"
            label={renderLabel}
          >
            {finalData.map((_, index) => (
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
        <div>Income: RM{totalIncome.toFixed(2)}</div>
        <div>Expenses: RM{totalExpenses.toFixed(2)}</div>
        <div>Savings: RM{totalSavings.toFixed(2)}</div>
      </div>
    </div>
  );
}
