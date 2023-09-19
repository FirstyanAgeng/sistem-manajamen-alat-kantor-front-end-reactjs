// import Login from "./Login";
import { Routes, Route } from "react-router-dom";
// import RecipeList from "./Recipe";
import {
  HOME,
  EQUIPMENT,
  BORROW,
  ADD_BORROW,
  EDIT_BORROW,
  HISTORY,
  ADD_EQUIPMENT,
  EDIT_EQUIPMENT,
} from "./router";
import Login from "./pages/Login";
import EquipmentList from "./pages/Equipment";
import Borrowing from "./pages/Borrowing";
import AddBorrowing from "./pages/AddBorrow";
import HistoryList from "./pages/History";
import EditBorrowing from "./pages/EditBorrow";
import NotFound from "./pages/NotFound";
import AddEquipment from "./pages/AddEquipment";
import EditEquipment from "./pages/EditEquipment";

const App = () => {
  return (
    <>
      <Routes>
        <Route path={HOME} element={<Login />} />
        <Route path={EQUIPMENT} element={<EquipmentList />} />
        <Route path={ADD_EQUIPMENT} element={<AddEquipment />} />
        <Route path={EDIT_EQUIPMENT} element={<EditEquipment />} />
        <Route path={BORROW} element={<Borrowing />} />
        <Route path={ADD_BORROW} element={<AddBorrowing />} />
        <Route path={EDIT_BORROW} element={<EditBorrowing />} />
        <Route path={HISTORY} element={<HistoryList />} />
        {/* <Route path={UPDATE} element={<></>}/> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
