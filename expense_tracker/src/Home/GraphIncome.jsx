import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export function GraphIncome() {
  const [incomes, setIncome] = useState([]);

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

  const COLORS = ["red", "blue", "green", "orange"];

  const renderLabel = ({ name }) => name;

  return (
    <div style={{ display: "flex", gap: "50px" }}>
      <ResponsiveContainer width="50%" height={300}>
        <PieChart>
          <Pie
            data={incomes}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#green"
            label={renderLabel}
          >
            {incomes.map((_, index) => (
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
        {incomes.map((income) => {
          return (
            <div key={income.name}>
              {income.name}: RM{income.amount.toFixed(2)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
