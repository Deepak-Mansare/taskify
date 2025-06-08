import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold">Welcome to Taskify</h1>
          <p className="text-muted fs-5">
            Manage your tasks efficiently with a powerful dashboard and admin
            tools.
          </p>
          <button
            className="btn btn-success px-4 mt-3"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>

        {/* Features Section */}
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-semibold">User Dashboard</h5>
                <p className="text-muted">
                  Create, view, and manage all your tasks in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-semibold">Admin Panel</h5>
                <p className="text-muted">
                  View user stats, control access, and monitor activity.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h5 className="card-title fw-semibold">Real-Time Updates</h5>
                <p className="text-muted">
                  Keep your task list up-to-date with smooth and fast
                  performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
