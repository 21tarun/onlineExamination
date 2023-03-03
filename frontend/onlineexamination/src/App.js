
import './App.css';
import { Route, Routes } from 'react-router-dom';

import Nav from './components/Nav'
import Home from './components/Home'
import About from './components/About'
import PageNotFound from './components/PageNotFound';
import Login from './components/Login';
import Quetions from './components/Quetions';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/signIn' element={<Login/>}/>
        <Route path='/quetions' element={<Quetions/>}/>

        <Route path='/*' element={<PageNotFound />}/>
      </Routes>
    </div>
  );
}

export default App;
