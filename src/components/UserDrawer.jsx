import { useState } from "react"
import UserAvatar from "./UserAvatar"

export default function UserDrawer() {
  const [open, setOpen] = useState(false)
  const [xp] = useState(1370)
  const [username] = useState("João Antonio A. B. Camilo")

  return (
    <>
      <button onClick={() => setOpen(true)} className={`fixed right-5 top-5 z-50 bg-white text-black px-1 py-1.5 rounded-xl ${open ? "hidden" : "block"} shadow-lg hover:bg-gray-200 transition-colors duration-300`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#E4E4E4] shadow-lg transform transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={() => setOpen(false)} className="fixed top-5 left-3 bg-white text-black px-1 py-1.5 rounded-xl shadow-lg hover:bg-gray-100 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
        <div className="mt-6 w-full h-full flex flex-col items-center p-4 space-y-4">
            <UserAvatar level={2} xp={xp}/>
            <div className="text-green-700 text-sm font-fancy">XP: {xp}</div>
          <div className="text-black font-fancy">{username}</div>
          <button className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">sair</button>
        </div>
      </div>
    </>
  )
}