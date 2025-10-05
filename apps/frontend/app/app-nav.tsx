import { NavLink } from 'react-router';

export function AppNav() {
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 8 }}>
      <NavLink to="/signin" end>
        Sign In
      </NavLink>
      <NavLink to="/signup" end>
        Sign Up
      </NavLink>
      <NavLink to="/app" end>
        App
      </NavLink>
    </nav>
  );
}
