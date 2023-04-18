function downloadBlob(blobUrl: string, filename: string) {
  const a = document.createElement("a");
  if (!a.click) {
    throw new Error('DownloadManager: "a.click()" is not supported.');
  }
  a.href = blobUrl;
  a.target = "_blank";
  // Use a.download if available. This increases the likelihood that
  // the file is downloaded instead of opened by another PDF plugin.
  if ("download" in a) {
    a.download = filename;
  }
  // <a> must be in the document for recent Firefox versions,
  // otherwise .click() is ignored.
  (document.body || document.documentElement).append(a);
  a.click();
  a.remove();
}

export { downloadBlob };
