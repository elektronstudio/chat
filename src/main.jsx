import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import UseWebSocket from "react-use-websocket";
import { useList, useKeyPressEvent } from "react-use";

import "./styles.css";

const useWebSocket = UseWebSocket.default;

const Message = ({ item }) => (
  <div style={{ marginBottom: "20px" }}>
    <div
      style={{
        display: "inline-grid",
        background: "#333",
        borderRadius: "8px",
        padding: "15px",
        gap: "7px",
      }}
    >
      {item.name && (
        <div style={{ fontSize: "0.8em", opacity: 0.5 }}>{item.name}</div>
      )}
      {item.message}
    </div>
  </div>
);

const App = () => {
  const [list, { push }] = useList([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    "wss://ws-fggq5.ondigitalocean.app/",
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );
  useEffect(() => {
    if (lastJsonMessage !== null) {
      push(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  const handleSend = () => {
    if (message) {
      sendJsonMessage({ message, name });
      setMessage("");
    }
  };

  useKeyPressEvent("Enter", handleSend);

  const log = useRef(null);

  useEffect(() => {
    if (log.current !== null) {
      log.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [list]);

  return (
    <div style={{ height: "100vh", padding: "25px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: "20px",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr  auto",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <h1>Sample elektron chat</h1>
          <input
            placeholder="Enter your name"
            style={{ border: "none" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div
          style={{
            height: "100%",
            overflowX: "scroll",
          }}
        >
          {list.map((item, i) => (
            <Message key={i} item={item} />
          ))}
          <div ref={log} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleSend}>Send message</button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
