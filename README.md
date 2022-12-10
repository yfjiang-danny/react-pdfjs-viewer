# React PDF Viewer

A React component to view PDF document. It is base on [mozilla/pdfjs](https://github.com/mozilla/pdfjs-dist).

## Features

- [ ] Support password protected document
- [x] Zooming: Support custom levels such as actual size, page fit, and page width
- [x] Navigation between pages
- [ ] Can go to the first and last pages quickly
- [ ] Search for text
- [ ] Preview page thumbnails
- [ ] View and navigate the table of contents
- [ ] List and download attachments
- [ ] Rotating
- [x] Text selection and hand tool modes
- [ ] Different scrolling modes
- [ ] Full screen mode
- [ ] Can open a file from local. Users can drag and drop a local file to view it
- [ ] Download file
- [ ] View the document properties
- [ ] Support SSR
- [ ] Print
- [ ] Theming
- [ ] Dark mode
- [ ] Accessibility

## 🖥 Environment Support

- Modern browsers
- Server-side Rendering
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Electron |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge                                                                                                                                                                                                 | last 2 versions                                                                                                                                                                                                  | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                                      |

## Install

```bash
npm install react-pdfjs-viewer
```

```bash
yarn add react-pdfjs-viewer
```

## 🔨 Usage

```jsx
import {
  PDFViewer,
  PDFViewerProvider,
  PDFWorker,
  Toolbar,
} from "react-pdfjs-viewer";
import "react-pdfjs-viewer/dist/index.css";
const App = () => (
  <PDFViewerProvider>
    <Toolbar />
    <PDFWorker workerDir="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js">
      <PDFViewer pdfURI="xxx.pdf" width="100%" height="100%" />
    </PDFWorker>
  </PDFViewerProvider>
);
```

### TypeScript

`react-pdfjs-viewer` is written in TypeScript with complete definitions.
