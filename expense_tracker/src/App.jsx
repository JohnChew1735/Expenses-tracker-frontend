import { BrowserRouter, Routes, Route } from "react-router-dom";
import { None } from "./Home/None";
import { Handling } from "./Handling/Handling";
import { DeleteCategory } from "./DeleteCategory/DeleteCategory";
import { Filter } from "./Filter/Filter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<None />} />
        <Route path="/Handling" element={<Handling />} />
        <Route path="/DeleteCategory" element={<DeleteCategory />} />
        <Route path="/Filter" element={<Filter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
