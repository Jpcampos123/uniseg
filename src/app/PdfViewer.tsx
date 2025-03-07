'use client';
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import "pdfjs-dist/web/pdf_viewer.css";

// Configura o worker do pdf.js para a versão correta
GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const PdfViewer = ({ file }: { file: File }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    contratante: "João da Silva",
    testemunhas: "Maria Oliveira e José Santos",
    plano: "",
    texto1: "Texto de exemplo 1",
    texto2: "Texto de exemplo 2",
    // Adicione outros campos conforme necessário
  });

  useEffect(() => {
    if (!file) return;

    const fillPdfFields = async () => {
      setLoading(true);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const pdfBytes = reader.result as ArrayBuffer;

        // Carrega o PDF usando pdf-lib
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        // Preenche os campos com dados reais
        form.getTextField("CONTRATANTE").setText(formData.contratante);
        form.getTextField("Testemunhas").setText(formData.testemunhas);

        // Exemplo de preenchimento de plano baseado em dados
        // form.getTextField("PLANO A ENFERMARIA").setText(formData.plano);

        // Preenchendo outros campos de texto
        form.getTextField("Texto1").setText(formData.texto1);
        form.getTextField("Texto2").setText(formData.texto2);

        // Salva o PDF preenchido
        const updatedPdfBytes = await pdfDoc.save();

        // Renderiza o PDF preenchido
        const updatedPdfData = updatedPdfBytes;
        const pdfJsDoc = await getDocument({ data: updatedPdfData }).promise;

        // Itera sobre todas as páginas do PDF e renderiza
        const numPages = pdfJsDoc.numPages;
        const renderPage = async (pageNumber: number) => {
          const page = await pdfJsDoc.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          containerRef.current?.appendChild(canvas);

          await page.render({ canvasContext: context, viewport }).promise;
        };

        // Limpa o conteúdo anterior antes de renderizar as novas páginas
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        // Renderiza todas as páginas
        for (let i = 1; i <= numPages; i++) {
          await renderPage(i);
        }

        setLoading(false);
      };
    };

    fillPdfFields();
  }, [file, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="p-6">
      {loading && <p>Carregando PDF...</p>}
      <div className="space-y-4">
        {/* Inputs personalizados */}
        <div>
          <label htmlFor="contratante" className="block text-lg font-medium text-gray-700">
            Contratante
          </label>
          <input
            id="contratante"
            name="contratante"
            type="text"
            value={formData.contratante}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="testemunhas" className="block text-lg font-medium text-gray-700">
            Testemunhas
          </label>
          <input
            id="testemunhas"
            name="testemunhas"
            type="text"
            value={formData.testemunhas}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="plano" className="block text-lg font-medium text-gray-700">
            Plano de Saúde
          </label>
          <input
            id="plano"
            name="plano"
            type="text"
            value={formData.plano}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="texto1" className="block text-lg font-medium text-gray-700">
            Texto 1
          </label>
          <input
            id="texto1"
            name="texto1"
            type="text"
            value={formData.texto1}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="texto2" className="block text-lg font-medium text-gray-700">
            Texto 2
          </label>
          <input
            id="texto2"
            name="texto2"
            type="text"
            value={formData.texto2}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        {/* Renderiza o PDF na tela */}
        <div ref={containerRef}></div>
      </div>
    </div>
  );
};

export default PdfViewer;
