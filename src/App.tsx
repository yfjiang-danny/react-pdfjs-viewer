import React from "react";
import "./App.css";
import { Viewer } from "./viewer";
import PDFWorker from "./viewer/worker";

function App() {
  return (
    <div className="App">
      <PDFWorker
        workerDir={"https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js"}
      >
        <Viewer pdfURI={`${process.env.PUBLIC_URL}/test.pdf`} />
      </PDFWorker>
    </div>
  );
}

export default App;
