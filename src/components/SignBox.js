import { Link, useLocation } from "react-router-dom";

import React, { useEffect } from "react";
import { useUser } from "../context/useUser";
import { useNavigate } from "react-router-dom";
import { AuthenticationMode } from "../screens/Authentication";

function SignBox() {
  const { user, setUser, signUp, signIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [authenticationMode, setAuthenticationMode] = React.useState(
    AuthenticationMode.Login
  );

  useEffect(() => {
    if (location.pathname === "/signup") {
      setAuthenticationMode(AuthenticationMode.Register);
    } else {
      setAuthenticationMode(AuthenticationMode.Login);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp();
        navigate("/signin");
      } else {
        await signIn();
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data.error
          : error;
      alert(message);
    }
  };

  return (
    <div
      style={{
        // border: "solid 1px #234159",
        minWidth: "33vw",
        borderRadius: "16px",
        padding: "16px",
        backgroundColor: "#234159",
        boxShadow: "inset 0 0 5px #162837",
      }}
    >
      <div
        style={{
          minHeight: "5vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "2.5rem" }}>
          {authenticationMode === AuthenticationMode.Login
            ? "Sign in"
            : "Sign up"}
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            minHeight: "7vh",
          }}
        >
          <div style={{ height: "50%" }}>
            <label>Email:</label>
          </div>
          <div style={{ height: "50%" }}>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
        </div>
        <div
          style={{
            minHeight: "7vh",
          }}
        >
          <div style={{ height: "50%" }}>
            <label>Password:</label>
          </div>
          <div style={{ height: "50%" }}>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
        </div>
        <div
          style={{
            minHeight: "5vh",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <button
            style={{
              backgroundColor:
                authenticationMode === AuthenticationMode.Login
                  ? "#FED24D"
                  : "#234159",
              borderRadius: "16px",
              padding: "7px",
              color:
                authenticationMode === AuthenticationMode.Login
                  ? "#182bc3"
                  : "#fcfcfc",
              border:
                authenticationMode === AuthenticationMode.Login
                  ? "solid 1px #FED24D"
                  : "solid 1px #fcfcfc",
              marginLeft: "10px",
              marginTop: "40px",
            }}
          >
            {authenticationMode === AuthenticationMode.Login
              ? "Login"
              : "Submit"}
          </button>
        </div>
        <div
          style={{
            minHeight: "5vh",
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <Link
            to={
              authenticationMode === AuthenticationMode.Login
                ? "/signup"
                : "/signin"
            }
          >
            {authenticationMode === AuthenticationMode.Login
              ? "No account? Sign up"
              : "Already signed up? Sign in"}
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignBox;
