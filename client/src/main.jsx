import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 animate-pulse">
          Welcome Yuvraj Singh 🚀
        </h1>
        <p className="mt-4 text-xl text-gray-800 animate-bounce">
          Your Tailwind CSS setup is working beautifully! 🎉
        </p>
      </header>

      {/* Card Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Card 1 */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl w-72 text-center">
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Fast</h2>
          <p className="text-gray-700">
            Build responsive UIs quickly with Tailwind CSS utility classes.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl w-72 text-center">
          <h2 className="text-2xl font-bold text-pink-500 mb-2">Customizable</h2>
          <p className="text-gray-700">
            Easily apply colors, gradients, and animations to make your UI beautiful.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl w-72 text-center">
          <h2 className="text-2xl font-bold text-green-500 mb-2">Interactive</h2>
          <p className="text-gray-700">
            Add hover effects, transitions, and animations to engage users.
          </p>
        </div>
      </div>

      {/* Button */}
      <button className="mt-12 px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl shadow-md hover:scale-110 transition transform duration-300 ease-in-out">
        Explore More 🌟
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />)
