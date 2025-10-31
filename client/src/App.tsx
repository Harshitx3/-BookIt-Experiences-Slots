import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Details from './pages/Details'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import Search from './pages/Search'
import Navbar from './components/Navbar'
import { SearchProvider } from './context/SearchContext'
import './index.css'

function App() {
  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <div className="flex-1 w-full overflow-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experience/:id" element={<Details />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/checkout-details" element={<Checkout />} />
            <Route path="/select-time" element={<Home />} />
            <Route path="/select-date" element={<Home />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </div>
    </SearchProvider>
  )
}

export default App
