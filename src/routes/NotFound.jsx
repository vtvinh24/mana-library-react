import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-8xl font-bold">404</h1>
        <p className="text-xl">May be you should go <Link to="/" className="text-blue-500">home</Link>!</p>
      </div>
    </div>
  );
};

export default NotFound;
