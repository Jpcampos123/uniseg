'use client';
import { useState } from "react";
import PdfViewer from "./PdfViewer";

const App = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
      {file && <PdfViewer file={file} />}
    </div>
  );
};

export default App;
