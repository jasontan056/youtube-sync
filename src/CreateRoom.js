import React, { useEffect } from "react";
import Firebase from "./Firebase";

export default function CreateRoom() {
  const db = Firebase.database();
  return (
    <div>
      <p>create room page</p>
    </div>
  );
}
