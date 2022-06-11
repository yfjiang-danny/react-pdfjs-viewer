import React, { useState } from "react";
import { PDFViewer, PDFWorker } from "react-pdfjs-viewer";
import "react-pdfjs-viewer/dist/index.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <PDFWorker workerDir="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js">
        <PDFViewer
          pdfURI="./compressed.tracemonkey-pldi-09.pdf"
          scale="fitWidth"
          width="100%"
          height="100vh"
        />
      </PDFWorker>
    </div>
  );
}

export default App;
