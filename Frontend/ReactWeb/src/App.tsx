import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Kitchen from './Components/Kitchen/Kitchen'

export default function App() {
  return (
    <div className='p-4'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Kitchen/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}