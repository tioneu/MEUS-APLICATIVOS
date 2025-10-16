import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("A chave da API Gemini não foi encontrada. Verifique suas variáveis de ambiente.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// A função lida com imagens (PNG, JPG, etc.) e PDFs.
// A API Gemini processa nativamente o MIME type 'application/pdf',
// extraindo o conteúdo para análise sem a necessidade de bibliotecas de terceiros no frontend.
export async function transcribeHandwriting(base64Data: string, mimeType: string): Promise<string> {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `Sua tarefa é transcrever o texto manuscrito do documento fornecido.
Diferencie claramente entre texto corrido e fórmulas matemáticas.
- Para o texto corrido, transcreva-o normalmente, preservando a estrutura de parágrafos.
- Para todas as fórmulas matemáticas, transcreva-as usando a sintaxe LaTeX. É crucial que você tente preservar a estrutura original da fórmula o máximo possível.
- Envolva fórmulas que aparecem em sua própria linha (fórmulas de bloco) com delimitadores \`$$ ... $$\`.
- Envolva fórmulas que aparecem no meio de uma frase (fórmulas em linha) com delimitadores \`\\( ... \\)\`.

Esta diferenciação é essencial para a renderização correta do conteúdo.`;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: prompt
        };

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [textPart, imagePart] },
        });
        
        return response.text;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        throw new Error("Não foi possível transcrever o texto. Por favor, tente novamente.");
    }
}