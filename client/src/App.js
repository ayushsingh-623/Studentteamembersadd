import React from 'react';
import {
  Route,
  Routes,
  Link
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddMemberPage from './pages/AddMemberPage';
import ViewMembersPage from './pages/ViewMembersPage';
import MemberDetailsPage from './pages/MemberDetailsPage';
import EditMemberPage from './pages/EditMemberPage';
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddMemberPage />} />
          <Route path="/members" element={<ViewMembersPage />} />
          <Route path="/members/:id" element={<MemberDetailsPage />} />
          <Route path="/edit/:id" element={<EditMemberPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

