import React, { useState } from "react";
import { PDFViewer, PDFWorker } from "react-pdfjs-viewer";
import "./App.css";

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
