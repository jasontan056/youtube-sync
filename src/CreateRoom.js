import React, { useEffect } from "react";
import Firebase from "./Firebase";

export default function CreateRoom() {
  const db = Firebase.database();
  return (
    <div>
      <p>create room page</p>
      <input
        className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
        type="text"
        placeholder="Room Name"
      ></input>
    </div>
  );
}
