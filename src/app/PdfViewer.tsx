'use client';
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

const PdfViewer = ({ file }: { file: File }) => {
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  // Inicializando o estado de formData com todos os campos como strings vazias
  const fieldNames = [
    "QTD_CLIENTES", "DIA_MENSALIDADE_VENCIMENTO", "DIA_VENCIMENTO_CONTRATO",
    "MES_VENCIMENTO_CONTRATO", "ANO_VENCIMENTO_CONTRATO", "DIA_ASSINATURA_CONTRATO",
    "MES_ASSINATURA_CONTRATO", "ANO_ASSINATURA_CONTRATO", "CONTRATANTE",
    "TESTEMUNHA_1_CONTRATO", "TESTEMUNHA_2_CONTRATO", "PLANO A ENFERMARIA00 à 18 anos",
    "PLANO A ENFERMARIA19 à 23 anos", "PLANO A ENFERMARIA24 à 28 anos",
    "PLANO A ENFERMARIA29 à 33 anos", "PLANO A ENFERMARIA34 à 38 anos",
    "PLANO A ENFERMARIA39 à 43 anos", "PLANO A ENFERMARIA44 à 48 anos",
    "PLANO A ENFERMARIA49 à 53 anos", "PLANO A ENFERMARIA54 à 58 anos",
    "PLANO A ENFERMARIA59 anos acima", "PLANO A ENFERMARIAPara 19 à 23 anos",
    "PLANO A ENFERMARIAPara 24 à 28 anos", "PLANO A ENFERMARIAPara 29 à 33 anos",
    "PLANO A ENFERMARIAPara 34 à 38 anos", "PLANO A ENFERMARIAPara 39 à 43 anos",
    "PLANO A ENFERMARIAPara 44 à 48 anos", "PLANO A ENFERMARIAPara 49 à 53 anos",
    "PLANO A ENFERMARIAPara 54 à 58 anos", "PLANO A ENFERMARIAPara 59 anos acima",
    "EMPRESA_CONTRATANTE", "CNPJ_CONTRATANTE", "INSCRIÇÃO_CNPJ", "ENDEREÇO_CONTRATANTE",
    "BAIRRO_CONTRATANTE", "FONE_CONTRATANTE", "EMAIL_CONTRATANTE", "CEP_CONTRATANTE",
    "CPF_1_CONTRATANTE", "CIDADE_UF_CONTRATANTE", "REPRESENTANTE_1_CONTRATANTE",
    "CARGO_2_CONTRATANTE", "REPRESENTANTE_2_CONTRATANTE", "CARGO_1_CONTRATANTE",
    "CPF_2_CONTRATANTE"
  ];

  // Inicializa todos os campos com valor vazio
  const [formData, setFormData] = useState(
    fieldNames.reduce((acc, field) => {
      acc[field] = ""; // Inicializa cada campo com uma string vazia
      return acc;
    }, {} as Record<string, string>)
  );

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

        // Preenche os campos com os valores do formulário
        fieldNames.forEach((fieldName) => {
          const field = form.getTextField(fieldName);
          if (field) {
            field.setText(formData[fieldName] || ""); // Preenche com o valor do formulário
          }
        });

        // Salva o PDF preenchido
        const updatedPdfBytes = await pdfDoc.save();
        setPdfData(updatedPdfBytes);

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

  const handlePrint = () => {
    if (!pdfData) return;

    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Abre o PDF em uma nova aba para impressão
    const newWindow = window.open(url);
    if (newWindow) {
      newWindow.onload = () => newWindow.print();
    } else {
      alert("Habilite pop-ups para visualizar a impressão.");
    }
  };

  return (
    <div className="p-6">
      {loading && <p>Carregando PDF...</p>}

      <div className="space-y-4">
        {/* Gera os inputs dinamicamente com base nos nomes dos campos */}
        {fieldNames.map((fieldName) => (
          <div key={fieldName}>
            <label className="block text-lg font-medium text-gray-700">{fieldName.replace(/_/g, ' ')}</label>
            <input
              name={fieldName}
              type="text"
              value={formData[fieldName]} // Garante que sempre será uma string vazia ou o valor preenchido
              onChange={handleInputChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handlePrint}
          disabled={!pdfData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Imprimir PDF
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
