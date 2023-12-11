import { createContext } from "react"
import SearchBill from "./screens/SearchBill"
import { I_Bill } from "./interfaces/general.interface"
import useBillData from "./hooks/useBillData";
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import BillDetails from "./screens/BillDetails";
import TransactionDetails from "./screens/TransactionDetails";

type T_BillContext = {
  billData: null | I_Bill | false;
  setBillData: (data: null | I_Bill | false) => void
}

export const billContext = createContext({} as T_BillContext)

const { Provider } = billContext;

function App() {
  const { billData, setBillData } = useBillData();

  return (
    <Provider value={{ billData, setBillData }}>
      <div className="main-content p-2 p-sm-4 p-md-5">
        <div className="px-4 py-5 px-sm-5 position-relative">
          <Router>
            <Routes >
              <Route path='/' element={<SearchBill />} />
              <Route path='/factura/:id_sede/:id_contract' element={<BillDetails />} />
              <Route path='/transaccion' element={<TransactionDetails />} />
              <Route path='*' element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </div>
      </div>
    </Provider>
  )
}

export default App
