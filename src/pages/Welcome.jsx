import GoogleLoginButton from "../components/GoogleLoginButton";
function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Application</h1>
      <p className="text-lg text-gray-700">
        This is the welcome page. Please log in to continue.
      </p>
        <div className="mt-6">
            <GoogleLoginButton />       
        </div>                              1                               
    </div>
  );
}

export default Welcome;