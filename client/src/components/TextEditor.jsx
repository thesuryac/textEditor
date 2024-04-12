import React, { useEffect, useState, useRef } from "react";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { io } from "socket.io-client";
import "../components/styles.css";
const socket = io("http://localhost:3000");

const TextEditor = () => {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [message, setMessage] = useState([]);
  const [username, setUsername] = useState({});
  const [cursorPosition, setCursorPosition] = useState({
    lineNumber: 1,
    column: 1,
  });

  const [value, setValue] = useState("");

  const handleChange = (value) => {
    setValue(value);
    console.log(editorRef.current);
    setCursorPosition(editorRef.current.getPosition());
    socket.emit("type", value);
  };

  useEffect(() => {
    socket.on("receive", (data) => {
      setMessage([...message, data]);
    });
    // Cleanup socket event listener
    return () => {
      socket.off("receive");
    };
  }, [socket, message]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full w-5/6 relative">
      <div className="editor h-1/2 w-full">
        <MonacoEditor
          defaultLanguage="text"
          onChange={handleChange}
          onMount={handleEditorDidMount}
          value={message.toString()}
          theme="vs-dark"
          className="indigo-cursor-line"
        />
        <div
          style={{
            position: "absolute",
            top: -19 + cursorPosition.lineNumber * 19,
            left: 70 + cursorPosition.column * 9,
          }}
          className="username-label z-100 text-black after-user"
        >
          surya
        </div>
      </div>

      <div>
        {message.map((ele) => {
          return <p key={ele}>{ele}</p>;
        })}
        <p>{message.toString()}</p>
      </div>
    </div>
  );
};

export default TextEditor;
