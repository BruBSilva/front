import React from 'react'

export default function TrackDrawer({ node, onClose, onToggleDone }) {
  if (!node) return null

  return (
    <div className="z-[999] h-screen w-96 fixed top-0 right-0 bg-[#E4E4E4] shadow-lg flex flex-col p-7 transition-all duration-300">
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={onClose}
          className="bg-white text-black px-1.5 py-2 rounded-2xl shadow-lg hover:bg-gray-100 transition-colors duration-300"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
        <button
          onClick={() => onToggleDone(node.id)}
          className="flex items-center bg-white py-2 px-3 rounded-xl shadow-lg hover:bg-gray-100 transition-colors duration-300"
        >
          <span
            className={`h-3 w-3 rounded-full mr-2 ${
              node.data.done ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          {node.data.done ? 'Concluido' : 'Estudando'}
        </button>
      </div>

      <div className="p-4 overflow-auto flex-1">
        <h2 className="text-center font-semibold mb-2 text-3xl text-black">{node.data.label}</h2>
        <p className="text-sm">{node.data.description}</p>
      </div>
    </div>
  )
}