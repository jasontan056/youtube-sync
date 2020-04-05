import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PlaybackStates, ClientPlaybackStates } from "../actions";
import Firebase from "../Firebase";

// Only update room's seek position if it's off by more than this threshold.
const SEEK_THRESHOLD_SECONDS = 1;

const usePrevious = (value = undefined) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * Compares the actual client state with the desired state and room state
 * to determine if the client made any changes that should be saved in
 * firebase.
 */
const StoreToDbSyncer = ({
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

  const prevClientPlaybackState = usePrevious(clientPlaybackState);
  const prevClientSeekPosition = usePrevious(clientSeekPosition);
  const prevClientVideoId = usePrevious(clientVideoId);

  useEffect(() => {
    setRoomRef(Firebase.database().ref(`room/${roomId}`));
  }, [roomId]);

  // Update playback and buffering state in DB.
  useEffect(() => {
    if (!roomRef || clientPlaybackState === prevClientPlaybackState) {
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
          userBufferRef.onDisconnect().remove();
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
        if (
          userId in usersBuffering &&
          Object.keys(usersBuffering).length === 1
        ) {
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
    prevClientPlaybackState,
  ]);

  // Update seek position in DB.
  useEffect(() => {
    if (!roomRef || clientSeekPosition === prevClientSeekPosition) {
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
  }, [
    clientSeekPosition,
    desiredSeekPosition,
    prevClientSeekPosition,
    roomRef,
  ]);

  // Update video ID in DB.
  useEffect(() => {
    if (!roomRef || clientVideoId === prevClientVideoId) {
      return;
    }

    if (clientVideoId && clientVideoId !== desiredVideoId) {
      roomRef.update({
        videoId: clientVideoId,
      });
    }
  }, [desiredVideoId, clientVideoId, roomRef, prevClientVideoId]);

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

export default connect(mapStateToProps, null)(StoreToDbSyncer);
