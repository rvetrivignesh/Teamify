import React from "react";
import "./Signup.css";

const Signup = () => {
  return (
    <div className="page">
      <div className="card">
        <h2>Sign-up to Teamify</h2>

        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="text" placeholder="Skills" />
        <input type="text" placeholder="College" />
        <input type="text" placeholder="Branch" />

        <button className="primary">Create Account</button>
      </div>
    </div>
  );
};

export default Signup;
