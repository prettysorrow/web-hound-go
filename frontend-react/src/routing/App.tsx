import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: "1%" }}>
        <Link to="/">Root</Link>
        <Link to="/first-page">First Page</Link>
        <Link to="/second-page">Second Page</Link>
        <Link to="/page-with-ui">Page With UI</Link>
      </nav>
      <Outlet />
    </>
  );
}

export default App;
