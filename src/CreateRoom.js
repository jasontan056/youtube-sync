import React, { useState } from "react";
import Firebase from "./Firebase";
import { Redirect } from "react-router-dom";

export default function CreateRoom() {
  const [roomId, setRoomId] = useState(null);

  const createRoom = () => {
    const roomRef = Firebase.database().ref("room");
    const newRoomRef = roomRef.push();
    newRoomRef
      .set({
        videoId: "eXf0hnC1cuE",
        playbackState: "PAUSED",
        seekPosition: 0,
      })
      .then(() => {
        setRoomId(newRoomRef.key);
      });
  };

  if (roomId) {
    return <Redirect push to={`/room/${roomId}`} />;
  }

  return (
    <div>
      <button
        onClick={createRoom}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Create a room
      </button>
    </div>
  );
}
