import testeAvatar from '../assets/useravatarteste.png';
import React from "react";

const UserAvatar = ({ src, level}) => {
  const avatarSrc = src || testeAvatar;

  return (
    <div className="relative w-32 h-32">
    <div className="w-32 h-32 rounded-full border-[6px] border-green-600 bg-white flex items-center justify-center relative">
        <img
        src={avatarSrc}
        alt="avatar"
        className="w-full h-full object-cover rounded-full"
        />

        <div className="absolute left-1/2 -translate-x-1/2 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-md z-10" 
        style={{ bottom: '-6px' }}>
        {level}
        </div>
    </div>
    </div>
  );
};

export default UserAvatar;