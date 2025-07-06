import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Image_resizer from "./Image_resizer";

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Image_resizer/>} />
      </Routes>
    </Router>
  )
}

export default App;