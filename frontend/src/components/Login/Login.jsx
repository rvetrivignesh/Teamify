import "./Login.css";

const Login = () => {
  return (
    <div className="page">
      <div className="card">
        <h2>Login to Teamify</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button className="primary">Login</button>
      </div>
    </div>
  );
};

export default Login;
