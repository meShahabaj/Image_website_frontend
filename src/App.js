import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ImageResizer from "./ImageResizer";

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageResizer/>} />
      </Routes>
    </Router>
  )
}

export default App;