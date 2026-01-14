import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, Scorecard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCandidateFit = async (candidate: Candidate): Promise<Partial<Scorecard>> => {
  try {
    const prompt = `
      You are a recruiter assistant for Verónica Sansi. Analyze the following candidate notes and resume details to suggest a scorecard assessment.
      
      Candidate: ${candidate.firstName} ${candidate.lastName}
      Role: ${candidate.role}
      Location: ${candidate.city}
      Notes: ${candidate.initialNotes}

      Criteria to evaluate (if information is present):
      1. Sales Experience & Drive
      2. Performance Accountability
      3. Motivation & Stability
      4. Licensing Commitment (Ability to take 32hr course + exam)
      5. Transportation (Reliable transport)
      6. Bilingual (English/Spanish)
      7. Evaluation Tolerance (Open to feedback)

      Return a JSON object suggesting 'Pass', 'Concern', or 'Fail' for any categories where the notes provide evidence. If no evidence, leave it null. Also provide short reasoning.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            salesExperience: { type: Type.STRING, enum: ["Pass", "Concern", "Fail", "null"] },
            salesExperienceNotes: { type: Type.STRING },
            performanceAccountability: { type: Type.STRING, enum: ["Pass", "Concern", "Fail", "null"] },
            performanceAccountabilityNotes: { type: Type.STRING },
            motivationStability: { type: Type.STRING, enum: ["Pass", "Concern", "Fail", "null"] },
            motivationStabilityNotes: { type: Type.STRING },
            licensing: { type: Type.STRING, enum: ["Pass", "Concern", "Fail", "null"] },
            licensingNotes: { type: Type.STRING },
            transportation: { type: Type.STRING, enum: ["Pass", "Concern", "Fail", "null"] },
            transportationNotes: { type: Type.STRING },
            bilingual: { type: Type.STRING, enum: ["Pass", "Concern", "Fail", "null"] },
            bilingualNotes: { type: Type.STRING },
            evaluationTolerance: { type: Type.STRING, enum: ["Pass", "Concern", "Fail", "null"] },
            evaluationToleranceNotes: { type: Type.STRING },
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Helper to map response to Scorecard structure
    const mapItem = (status: string, notes: string) => {
      if (status === 'null' || !status) return { status: undefined, notes: '' };
      return { status: status as any, notes: notes || '' };
    };

    return {
      salesExperience: mapItem(result.salesExperience, result.salesExperienceNotes),
      performanceAccountability: mapItem(result.performanceAccountability, result.performanceAccountabilityNotes),
      motivationStability: mapItem(result.motivationStability, result.motivationStabilityNotes),
      licensing: mapItem(result.licensing, result.licensingNotes),
      transportation: mapItem(result.transportation, result.transportationNotes),
      bilingual: mapItem(result.bilingual, result.bilingualNotes),
      evaluationTolerance: mapItem(result.evaluationTolerance, result.evaluationToleranceNotes),
    };

  } catch (error) {
    console.error("Error analyzing candidate:", error);
    return {};
  }
};

export const parseCandidateData = async (rawData: string): Promise<Partial<Candidate>[]> => {
  try {
    const prompt = `
      You are a data import assistant for a recruitment app. 
      Parse the following raw text data into a structured JSON array of candidates.
      The data might be CSV, Excel copy-paste, or a messy list.
      
      Extract these fields:
      - firstName (if name is full, split it)
      - lastName
      - email
      - phone
      - city (or location)
      - role (position applied for)
      - initialNotes (any other text describing background, skills, or comments)

      Ignore header rows like "Name, Email, Date".
      Clean up phone numbers to be consistent if possible.
      If a field is missing, use an empty string.
      
      Raw Data:
      ${rawData}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              firstName: { type: Type.STRING },
              lastName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              city: { type: Type.STRING },
              role: { type: Type.STRING },
              initialNotes: { type: Type.STRING },
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error parsing data:", error);
    throw new Error("Failed to parse data with AI.");
  }
};
