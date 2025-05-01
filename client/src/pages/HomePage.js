import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to Team 1</h1>
      <p>Manage your student team members efficiently.</p>
      <div>
        <Link to="/add">
          <button style={{ marginRight: '10px' }}>Add Member</button>
        </Link>
        <Link to="/members">
          <button>View Members</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

