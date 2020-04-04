import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PlaybackStates, ClientPlaybackStates } from "../actions";
import Firebase from "../Firebase";

// Only update room's seek position if it's off by more than this threshold.
const SEEK_THRESHOLD_SECONDS = 1;

/**
 * Compares the actual client state with the desired state and room state
 * to determine if the client made any changes that should be saved in
 * firebase.
 */
export const StoreToDbSyncer = ({
  roomId,
  desiredPlaybackState,
  clientPlaybackState,
  usersBuffering,
  desiredSeekPosition,
  clientSeekPosition,
  desiredVideoId,
  clientVideoId,
}) => {
  const [roomRef, setRoomRef] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setRoomRef(Firebase.database().ref(`room/${roomId}`));
  }, [roomId]);

  // Update playback and buffering state in DB.
  useEffect(() => {
    if (!roomRef) {
      return;
    }

    switch (clientPlaybackState) {
      case ClientPlaybackStates.PLAYING:
        if (desiredPlaybackState !== PlaybackStates.PLAYING) {
          roomRef.update({
            playbackState: PlaybackStates.PLAYING,
            playStartTimestamp: Firebase.database.ServerValue,
          });
        }
        break;
      case ClientPlaybackStates.PAUSED:
        if (desiredPlaybackState !== PlaybackStates.PAUSED) {
          roomRef.update({ playbackState: PlaybackStates.PAUSED });
        }
        break;
      case ClientPlaybackStates.BUFFERING:
        if (userId && userId in usersBuffering) {
          // no-op
        } else {
          const userBufferRef = roomRef.child("usersBuffering").push();
          setUserId(userBufferRef.key);
          userBufferRef.set(true);
        }
        if (desiredPlaybackState !== PlaybackStates.BUFFERING) {
          roomRef.update({ playbackState: PlaybackStates.BUFFERING });
        }
        break;
      case ClientPlaybackStates.WAITING:
        if (userId) {
          roomRef.child(`/usersBuffering/${userId}`).remove();
        }
        if (userId in usersBuffering && usersBuffering.length === 1) {
          roomRef.update({ playbackState: PlaybackStates.PLAYING });
        }
        break;
      default:
        console.log("Client is in some other state!!!");
    }
  }, [
    roomRef,
    desiredPlaybackState,
    clientPlaybackState,
    usersBuffering,
    userId,
  ]);

  // Update seek position in DB.
  useEffect(() => {
    if (!roomRef) {
      return;
    }

    if (
      Math.abs(desiredSeekPosition - clientSeekPosition) >
      SEEK_THRESHOLD_SECONDS
    ) {
      if (clientSeekPosition === ClientPlaybackStates.PLAYING) {
        roomRef.update({
          seekPosition: clientSeekPosition,
          playStartTimestamp: Firebase.database.ServerValue,
        });
      } else {
        roomRef.update({
          seekPosition: clientSeekPosition,
        });
      }
    }
  }, [clientSeekPosition, desiredSeekPosition, roomRef]);

  // Update video ID in DB.
  useEffect(() => {
    if (!roomRef) {
      return;
    }

    if (desiredVideoId !== clientVideoId) {
      roomRef.update({
        videoId: clientVideoId,
      });
    }
  }, [desiredVideoId, clientVideoId, roomRef]);

  return <div>Store to db syncer</div>;
};

StoreToDbSyncer.propTypes = {
  roomId: PropTypes.string,
  desiredPlaybackState: PropTypes.oneOf(Object.values(PlaybackStates)),
  clientPlaybackState: PropTypes.oneOf(Object.values(ClientPlaybackStates)),
  usersBuffering: PropTypes.object,
  desiredSeekPosition: PropTypes.number,
  clientSeekPosition: PropTypes.number,
  desiredVideoId: PropTypes.string,
  clientVideoId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  roomId: state.roomId,
  desiredPlaybackState: state.desired.playbackState,
  clientPlaybackState: state.client.playbackState,
  usersBuffering: state.room.usersBuffering,
  desiredSeekPosition: state.desired.seekPosition,
  clientSeekPosition: state.client.seekPosition,
  desiredVideoId: state.desired.videoId,
  clientVideoId: state.client.videoId,
});

export default connect(mapStateToProps, {})(StoreToDbSyncer);
