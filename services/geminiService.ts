
import { GoogleGenAI, Type } from "@google/genai";
import { InstitutionType, IDCardData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateRandomIDData = async (preferredType?: InstitutionType, preferredState?: string): Promise<IDCardData> => {
  const randomSalt = Math.random().toString(36).substring(7);

  // 1. Generate text data using Gemini 3 Pro for real-world verification
  // Using Thinking Budget to ensure the model carefully selects a REAL institution.
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a realistic Student ID card data for a REAL and EXISTING educational institution in the US.
               Reference ID: ${randomSalt}.
               State Context: ${preferredState || 'Random US State'}.
               Institution Type: ${preferredType || 'Any'}.

               STRICT VALIDITY RULES:
               1. SCHOOL NAME: Must be a real, accredited, and existing school (University or High School) in the USA. It should be verifiable on platforms like SheerID or NCES.
               2. ADDRESS: Must be the ACTUAL real-world address (Street, City, Zip) of that specific institution.
               3. NAMES: Use a very common US resident name (diverse backgrounds: Caucasian, African American, Hispanic, or Asian).
               4. STUDENT ID: Generate a realistic ID format used by that specific school if known, otherwise a long alphanumeric string.
               5. CONSISTENCY: Ensure the City and State match the School's real location.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          firstName: { type: Type.STRING },
          lastName: { type: Type.STRING },
          gender: { type: Type.STRING, enum: ['male', 'female'] },
          schoolName: { type: Type.STRING, description: "Official name of a REAL US school" },
          schoolType: { type: Type.STRING, description: "High School or University" },
          schoolAddress: { type: Type.STRING, description: "Official street address of the school" },
          schoolEmail: { type: Type.STRING },
          studentId: { type: Type.STRING },
          majorOrGrade: { type: Type.STRING },
          faculty: { type: Type.STRING },
          enrollmentYear: { type: Type.STRING },
          issueDate: { type: Type.STRING },
          expiryDate: { type: Type.STRING },
          state: { type: Type.STRING },
          city: { type: Type.STRING },
        },
        required: ["firstName", "lastName", "gender", "schoolName", "schoolType", "schoolAddress", "schoolEmail", "studentId", "majorOrGrade", "faculty", "enrollmentYear", "issueDate", "expiryDate", "state", "city"]
      }
    }
  });

  const rawData = JSON.parse(textResponse.text || "{}");
  
  // 2. Generate AI Image matching the data
  let photoUrl = `https://picsum.photos/seed/${Math.random()}/300/400`; 
  
  try {
    const ageGroup = rawData.schoolType === InstitutionType.UNIVERSITY ? "20-year-old college student" : "16-year-old student";
    const imagePrompt = `A professional, clean ID card headshot of a ${rawData.gender} ${ageGroup}. 
                         Solid white or light blue background, standard US student ID style, 
                         neutral expression, high resolution photography.`;

    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt }]
      }
    });

    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        photoUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }

  return {
    ...rawData,
    photoUrl
  };
};
