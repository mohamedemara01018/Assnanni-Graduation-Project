import { Link } from "react-router";

const HomePage = () => {
  return (
    <div>
      <h1>this is home page</h1>
      <Link to="register">Register</Link>
    </div>
  );
};

export default HomePage;
