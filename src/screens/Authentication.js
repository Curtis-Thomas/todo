import Hero from "../components/Hero";
import SignBox from "../components/SignBox";

export const AuthenticationMode = Object.freeze({
  Login: "Login",
  Register: "Register",
});


export default function Authentication() {

  

  return (
    <div>
      <Hero />
      <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
        <SignBox />
      
     
      
      </div>
    </div>
  );
}