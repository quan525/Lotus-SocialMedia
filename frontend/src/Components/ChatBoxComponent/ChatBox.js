
const ChatBox = ({ messages }) => {
  return (
    <div className="chatBox">
        <div  className="message">
          <div className="messageSender"></div>
          <div className="messageContent"></div>
        </div>
    </div>
  );
};


export default ChatBox;