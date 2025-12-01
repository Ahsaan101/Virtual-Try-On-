import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a virtual try-on image using the 'nano banana' (gemini-2.5-flash-image) model.
 * 
 * @param clothBase64 Base64 string of the clothing image (raw base64, no data URI prefix)
 * @param clothMimeType Mime type of the clothing image
 * @param personBase64 Base64 string of the person image (raw base64, no data URI prefix)
 * @param personMimeType Mime type of the person image
 * @returns The generated image as a data URI string.
 */
export const generateVirtualTryOn = async (
  clothBase64: string,
  clothMimeType: string,
  personBase64: string,
  personMimeType: string
): Promise<string> => {
  try {
    // Nano Banana mapping based on guidelines
    const model = 'gemini-2.5-flash-image'; 

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: "You are an expert fashion photo editor. I will provide two images. The first image is a piece of clothing. The second image is a person. Your task is to generate a new, photorealistic image where the person from the second image is wearing the clothing from the first image. Ensure the fit, lighting, shadows, and posture are completely natural. Maintain the person's identity, facial features, and the background of the original photo. Output ONLY the generated image."
          },
          {
            inlineData: {
              mimeType: clothMimeType,
              data: clothBase64,
            },
          },
          {
            inlineData: {
              mimeType: personMimeType,
              data: personBase64,
            },
          },
        ],
      },
      // Note: responseMimeType and responseSchema are NOT supported for nano banana models
    });

    // Iterate through parts to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          // Determine mime type if possible, default to png if not explicit
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image was generated. The model might have returned text instead.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};