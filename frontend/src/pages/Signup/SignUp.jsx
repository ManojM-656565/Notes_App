import { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";

export default function SignUp() {


  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);

  const handleSignUp=async (e)=>{
    e.preventDefault();

    if(!name){
      setError("Please enter yout name");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }
    setError('');

    //Sign Up API Call
  }
  return (
   <>
    <NavBar />

    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSignUp}> 
        <h4 className="text-2xl mb-7">SignUp</h4>
  <input 
  type="text" 
  placeholder="Name" 
  className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline none" 
  value={name}
  onChange={(e)=>setName(e.target.value)}
 />
  <input 
  type="text" 
  placeholder="Email" 
  className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline none" 
  value={email}
  onChange={(e)=>setEmail(e.target.value)}
 />

<PasswordInput 
  value={password}
  onChange={(e)=>{
    setPassword(e.target.value);

  }}
 />
 {error && <p className="text-red-500 text-xs pb-1 ">{error}</p> }
  <button 
    type="submit" className="w-full text-sm bg-blue-500 text-white p-2 rounded my-1 hover:bg-blue-600"
    // onClick={()=>navigate('/dashboard')}
  >
                Create Account
                </button>

                <p className="text-sm text-center mt-4">Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary underline">
                    Login
                </Link>
                </p>
        </form>
      </div>
    </div>

   </>
  )
}
