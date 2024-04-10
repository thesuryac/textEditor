import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const TextEditor = () => {
  const [message, setMessage] = useState([]);
  const editorRef = useRef(null);
  const [positionC, setPositionC] = useState({
    x: null,
    y: null,
  });
  const [value, setValue] = useState("");
  const [mousePosition, setMousePosition] = useState({
    x: null,
    y: null,
  });
  const handleChange = (value) => {
    setValue(value);
    socket.emit("type", value);
  };

  const getCursorPosition = () => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      return position; // Return the entire position object
    }
    return null;
  };
  const handleCursorChange = () => {
    const position = getCursorPosition();
    if (position) {
      console.log(
        "Cursor at line:",
        position.lineNumber,
        "column:",
        position.column
      );
      // You can potentially send this information via socket.emit or use it for other functionalities
    }
  };
  useEffect(() => {
    socket.on("receive", (data) => {
      setMessage([...message, data]);
    });
  }, [socket]);
  useEffect(() => {
    getCursorPosition();
    const handle = (e) => {
      setMousePosition({
        x: e.offsetX,
        y: e.offsetY,
      });
    };
    document.querySelector(".editor")?.addEventListener("mousemove", handle);
    socket.emit("mouse", mousePosition);
    return () =>
      document
        .querySelector(".editor")
        ?.removeEventListener("mousemove", handle);
  }, [mousePosition]);
  return (
    <div className="h-full w-5/6">
      <div className="editor h-1/2 w-full">
        <Editor
          defaultLanguage="text"
          onChange={handleChange}
          value={message.toString()}
          options={{
            theme: "vs-dark",
          }}
          onCursorChange={handleCursorChange}
        />
      </div>
      <div>
        {message.map((ele) => {
          return <p>{ele}</p>;
        })}{" "}
        <p>{message.toString()}</p>
      </div>
      <div className="">
        <p>{mousePosition.x}</p>
        <p>{mousePosition.y}</p>
      </div>
    </div>
  );
};

export default TextEditor;
