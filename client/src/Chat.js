import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import MDEditor from "@uiw/react-md-editor";


const mkdStr = `Hi
`;

function Chat({ socket, username, room }) {
  const [value, setValue] = React.useState(mkdStr);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (value !== "") {
      const messageData = {
        room: room,
        author: username,
        message: value,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Room id : {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <div className="container">
                      <MDEditor.Markdown source={messageContent.message} />

                    </div>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{username === messageContent.author ? "You" : messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="md">
        <MDEditor preview={'edit'} height={200} width={600} value={value} onChange={setValue} />
      </div>

      <div className="chat-footer">
        <div className="chat-send" onClick={sendMessage} >
          <a href="#">Send</a>
        </div>
      </div>
    </div>




  );
}

export default Chat;
//<button onClick={sendMessage}>&#9658;</button>