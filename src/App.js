import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormLiver from './compenets/FormLiver';
import ListeLivres from './compenets/ListeLivres';
import Navbarlivre from './compenets/Navbarlivre';
import Rechercher from './compenets/Rechercher';
import AjouterLivre from './compenets/AjouterLivre';

function App() {
  return (
    <Router>
      <Navbarlivre />
      <Routes>
        <Route path="/" element={<FormLiver />} />
        <Route path="/liste-livres" element={<ListeLivres />} />
        <Route path="/rechercher" element={<Rechercher />} />
        <Route path="/ajouter-livre" element={<AjouterLivre />} />
      </Routes>
    </Router>
  )
}

export default App
