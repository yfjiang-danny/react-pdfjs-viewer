import React from "react";
import {
  PDFViewer,
  PDFViewerProvider,
  PDFWorker,
  Toolbar,
} from "react-pdfjs-viewer";
import "react-pdfjs-viewer/dist/index.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <PDFViewerProvider>
        <Toolbar />
        <PDFWorker workerDir="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js">
          <PDFViewer
            // pdfURI="./compressed.tracemonkey-pldi-09.pdf"
            width="100%"
            height="calc(100vh - 48px)"
          />
        </PDFWorker>
      </PDFViewerProvider>
    </div>
  );
}

export default App;
