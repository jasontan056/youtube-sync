import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PlaybackStates, ClientPlaybackStates } from "../actions";
import Firebase from "../Firebase";
import { usePrevious } from "../utilities/hooks";

// Only update room's seek position if it's off by more than this threshold.
const SEEK_THRESHOLD_SECONDS = 1.5;

/**
 * Compares the actual client state with the desired state and room state
 * to determine if the client made any changes that should be saved in
 * firebase.
 */
const StoreToDbSyncer = ({
  roomId,
  clientPlaybackState,
  desiredSeekPosition,
  clientSeekPosition,
  desiredVideoId,
  clientVideoId,
}) => {
  const [roomRef, setRoomRef] = useState(null);
  const [userId, setUserId] = useState(null);

  const prevClientSeekPosition = usePrevious(clientSeekPosition);
  const prevClientVideoId = usePrevious(clientVideoId);

  useEffect(() => {
    setRoomRef(Firebase.database().ref(`room/${roomId}`));
  }, [roomId]);

  const updateState = useCallback(() => {
    if (
      !roomRef ||
      clientPlaybackState === null ||
      clientSeekPosition === null
    ) {
      return;
    }

    const updates = {};

    switch (clientPlaybackState) {
      case ClientPlaybackStates.PLAYING:
        Object.assign(updates, {
          playbackState: PlaybackStates.PLAYING,
          playStartTimestamp: Firebase.database.ServerValue.TIMESTAMP,
        });
        break;
      case ClientPlaybackStates.PAUSED:
        Object.assign(updates, { playbackState: PlaybackStates.PAUSED });
        break;
      case ClientPlaybackStates.BUFFERING:
        if (!userId) {
          const userBufferRef = roomRef.child("usersBuffering").push();
          userBufferRef.onDisconnect().remove();
          Object.assign(updates, {
            usersBuffering: {
              [userBufferRef.key]: true,
            },
          });
          setUserId(userBufferRef.key);
        }
        break;
      case ClientPlaybackStates.WAITING:
        if (userId) {
          Object.assign(updates, {
            usersBuffering: {
              [userId]: null,
            },
          });
          setUserId(null);
        }
        break;
      default:
        throw new Error("Client in abnormal state.");
    }

    if (clientSeekPosition !== prevClientSeekPosition) {
      if (
        Math.abs(desiredSeekPosition - clientSeekPosition) >
        SEEK_THRESHOLD_SECONDS
      ) {
        Object.assign(updates, {
          seekPosition: clientSeekPosition,
        });
        if (clientPlaybackState === ClientPlaybackStates.PLAYING) {
          Object.assign(updates, {
            playStartTimestamp: Firebase.database.ServerValue.TIMESTAMP,
          });
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      roomRef.update(updates);
    }
  }, [
    clientPlaybackState,
    clientSeekPosition,
    desiredSeekPosition,
    prevClientSeekPosition,
    roomRef,
    userId,
  ]);

  useEffect(updateState, [roomRef, clientPlaybackState, clientSeekPosition]);

  // Update video ID in DB.
  useEffect(() => {
    if (!roomRef || clientVideoId === prevClientVideoId) {
      return;
    }

    if (clientVideoId && clientVideoId !== desiredVideoId) {
      roomRef.update({
        videoId: clientVideoId,
        playbackState: PlaybackStates.PAUSED,
        seekPosition: 0,
        playStartTimestamp: null,
      });
    }
  }, [desiredVideoId, clientVideoId, roomRef, prevClientVideoId]);

  return null;
};

StoreToDbSyncer.propTypes = {
  roomId: PropTypes.string,
  clientPlaybackState: PropTypes.oneOf(Object.values(ClientPlaybackStates)),
  usersBuffering: PropTypes.object,
  desiredSeekPosition: PropTypes.number,
  clientSeekPosition: PropTypes.number,
  desiredVideoId: PropTypes.string,
  clientVideoId: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  roomId: ownProps.roomId,
  clientPlaybackState: state.client.playbackState,
  usersBuffering: state.room.usersBuffering,
  desiredSeekPosition: state.desired.seekPosition,
  clientSeekPosition: state.client.seekPosition,
  desiredVideoId: state.desired.videoId,
  clientVideoId: state.client.videoId,
});

export default connect(mapStateToProps, null)(StoreToDbSyncer);
