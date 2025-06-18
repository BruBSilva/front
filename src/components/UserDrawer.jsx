import { useState } from "react"
import UserAvatar from "./UserAvatar"
import AchievementsBox from "./AchievementsBox"

export default function UserDrawer({setOpen}) {
  const [xp] = useState(1370)
  const [username] = useState("João Antonio A. B. Camilo")

  return (
    <div className="h-full w-80 bg-[#E4E4E4] shadow-lg flex flex-col items-center p-4 space-y-4 relative transition-all duration-300">
      <button onClick={() => setOpen(false)} className="absolute top-5 left-3 bg-white text-black px-1 py-1.5 rounded-xl shadow-lg hover:bg-gray-100 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <UserAvatar level={2} xp={xp} />
      <div className="text-green-700 text-sm font-fancy">XP: {xp}</div>
      <div className="text-black/80 text-lg font-[600] font-fancy">{username}</div>
      <div className="mt-6 w-full px-4">
        <AchievementsBox />
      </div>
      <button className="w-52 border-[1.5px] absolute bottom-9 left-1/2 -translate-x-1/2 border-red-500/70 text-red-500/80 rounded-md hover:bg-red-500/80 hover:text-white">
        Sair
      </button>
    </div>
  )
}
