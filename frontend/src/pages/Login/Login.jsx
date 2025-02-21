import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";

export default function Login() {
  return (
    <>
      <NavBar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
            <form onSubmit={() =>{}}>
                <h4 className="text-2xl mb-7">Login</h4>

                <input type="text" placeholder="Email" className="w-full text-sm bg-transparent border-[1.5px] px-5
 py-3 rounded mb-4 outline none" />
                <button type="submit" className="w-full text-sm bg-blue-500 text-white p-2 rounded my-1 hover:bg-blue-600">Login</button>

                <p className="text-sm text-center mt-4">Not yet registered {" "}
                <Link to="/signup" className="font-medium text-primary underline">
                    Create an Account
                </Link>
                </p>
            </form>
        </div>
      </div>
    </>
  )
}
