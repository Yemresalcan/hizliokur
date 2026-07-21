import * as pdfjsLib from 'pdfjs-dist';
import { detectLocale, translate } from '../i18n/translations';

// Set worker source to CDN to avoid build issues
// Using unpkg as it often handles ESM better than cdnjs for some packages
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const generatePdfThumbnail = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 0.6 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d')!;
    await page.render({ canvasContext: context, viewport, canvas }).promise;

    return canvas.toDataURL('image/jpeg', 0.75);
  } catch {
    return '';
  }
};

export interface ExtractedPdf {
  text: string;
  // pageOffsets[i] = word index where page (i+1) starts in the full text
  pageOffsets: number[];
}

export const extractTextFromPdf = async (file: File): Promise<ExtractedPdf> => {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    const pageOffsets: number[] = [];
    let cumulativeWords = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = (textContent.items as Array<{ str: string }>)
        .map(item => item.str)
        .join(' ');

      // Record word index where this page starts
      pageOffsets.push(cumulativeWords);

      const pageWordCount = pageText.trim() ? pageText.trim().split(/\s+/).length : 0;
      cumulativeWords += pageWordCount;

      fullText += pageText + '\n\n';
    }

    return { text: fullText.trim(), pageOffsets };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(translate(detectLocale(), 'errors.pdfRead'));
  }
};
