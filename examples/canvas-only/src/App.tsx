import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { PDFViewer, PDFWorker } from "react-pdfjs-viewer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <PDFWorker workerDir="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js">
        <PDFViewer pdfURI="./compressed.tracemonkey-pldi-09.pdf" scale="auto" />
      </PDFWorker>
    </div>
  );
}

export default App;
