import { useState } from "react"
import UserAvatar from "./UserAvatar"
import AchievementsBox from "./AchievementsBox"

export default function UserDrawer({setOpen}) {
  const [xp] = useState(1370)
  const [username] = useState("João Antonio A. B. Camilo")

  return (
    <div className="h-screen w-full bg-[#E4E4E4] shadow-lg flex flex-col items-center p-7 space-y-12 relative">
      <button onClick={() => setOpen(false)} className="absolute top-5 left-3 bg-white text-black px-1.5 py-2 rounded-2xl shadow-lg hover:bg-gray-100 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <UserAvatar level={2} xp={xp} />
      <div className="text-green-700 font-fancy">XP: {xp}</div>
      <div className="text-black/80 text-2xl font-semibold font-fancy">{username}</div>
      <div className="w-full px-5">
        <AchievementsBox />
      </div>
      <button className="w-56 h-8 border-[2px] absolute bottom-10 left-1/2 -translate-x-1/2 border-red-500/70 text-red-600/80 rounded-md hover:bg-red-500/80 hover:text-white">
        Sair
      </button>
    </div>
  )
}
