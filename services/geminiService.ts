
import { GoogleGenAI } from "@google/genai";
import { Tone, ModelLength, PromptRequest, Persona, PromptMode, TrainingExample } from '../types';

// Initialize the client. 
// Note: In a real production app, ensure strict backend proxying if keys are sensitive, 
// though for this specific request, we follow the instruction to use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GENERATE_SYSTEM_INSTRUCTION = `
You are a world-class Prompt Engineer and LLM Architect. 
Your goal is to transform a user's raw, simple intent into a highly engineered, sophisticated prompt optimized for advanced Large Language Models (like Gemini 1.5 Pro, GPT-4, Claude 3.5).

Follow this framework for the output prompt:
1. **Role/Persona**: Define who the AI should be.
2. **Context**: Background information needed.
3. **Task**: The specific instruction.
4. **Constraints**: What to avoid or adhere to.
5. **Output Format**: How the response should look.
6. **Example (Optional)**: If helpful.

Do not output chatty conversational text. Output ONLY the engineered prompt.
`;

const IMPROVE_SYSTEM_INSTRUCTION = `
You are an expert Prompt Doctor and Optimization Specialist.
Your goal is to take an EXISTING prompt provided by the user, analyze its weaknesses (ambiguity, lack of structure, weak constraints), and REWRITE it into a professional-grade prompt.

1. Analyze the user's draft.
2. Identify the core intent.
3. Re-structure it using advanced prompting techniques (Chain of Thought, Persona adoption, Delimiters).
4. Apply the requested Tone and Persona settings to the rewritten version.

Output ONLY the improved, rewritten prompt. Do not output the analysis or chatty text.
`;

const formatExamples = (examples: TrainingExample[]): string => {
  if (!examples || examples.length === 0) return "";
  
  return `
  Below are FEW-SHOT EXAMPLES provided by the user. 
  You MUST follow the style, structure, and depth of these examples when generating the final prompt.
  
  ${examples.map((ex, i) => `
  --- EXAMPLE ${i + 1} ---
  USER INPUT: "${ex.input}"
  IDEAL OUTPUT: 
  ${ex.output}
  ------------------------
  `).join('\n')}
  `;
};

export const generateOptimizedPrompt = async (request: PromptRequest): Promise<string> => {
  try {
    const { intent, tone, length, persona, mode, examples } = request;

    // Build specific instructions based on persona
    let personaInstruction = "";
    if (persona && persona !== Persona.GENERAL) {
        personaInstruction = `IMPORTANT: The "Role/Persona" section of the generated prompt MUST be explicitly defined as a "${persona}". Ensure the vocabulary and perspective align with this persona.`;
    }

    const isImprove = mode === PromptMode.IMPROVE;
    const examplesContext = formatExamples(examples);

    const userMessage = `
    ${isImprove ? 'EXISTING DRAFT PROMPT' : 'USER INTENT'}: "${intent}"
    
    Task: ${isImprove ? 'Critique and Rewrite this prompt to be production-ready.' : 'Generate a full prompt from this intent.'}
    
    Target Persona: ${persona}
    Desired Tone: ${tone}
    Desired Detail Level: ${length}
    
    ${personaInstruction}

    ${examplesContext}
    
    Please write the ${isImprove ? 'improved' : 'optimized'} prompt now.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: isImprove ? IMPROVE_SYSTEM_INSTRUCTION : GENERATE_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text || "Failed to generate prompt. Please try again.";

  } catch (error) {
    console.error("Error generating prompt:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}. Please check your API key and connection.`;
    }
    return "An unexpected error occurred.";
  }
};
