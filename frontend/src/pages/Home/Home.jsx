
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Hello, Tailwind!</h1>
        <p className="mt-2 text-gray-600">This is a basic component with Tailwind CSS.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Click Me
        </button>
      </div>
    </div>
  );
}
