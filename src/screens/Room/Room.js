import React from "react";
import "./room.css"

const Room = () => {
  return (
    <div id="lobby-container">
      <div id="form-container">
        <div id="form__container__header">
          <p>👋 Create OR Join a Room</p>
        </div>
        <div id="form__content__wrapper">
          <form id="join-form">
            <input placeholder="Join a Room" type="text" name="invite_link" />
            <input type="submit" value="Create Room" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Room;
