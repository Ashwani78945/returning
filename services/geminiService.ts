
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Character, GeminiStoryResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyModel = 'gemini-2.5-pro';
const imageModel = 'gemini-2.5-flash-image';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        story: { type: Type.STRING, description: "The narrative text for the current scene." },
        choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-4 actions the player can take."
        },
        characterStats: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
                hp: { type: Type.NUMBER, description: "Character's current health points." },
                maxHp: { type: Type.NUMBER, description: "Character's maximum health points." },
                mp: { type: Type.NUMBER, description: "Character's current mana points." },
                maxMp: { type: Type.NUMBER, description: "Character's maximum mana points." }
            }
        },
        inventory: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The character's updated inventory."
        },
        sceneDescription: {
            type: Type.STRING,
            description: "A concise, visually descriptive prompt (under 100 characters) for an AI image generator."
        }
    },
    required: ["story", "choices", "inventory", "sceneDescription"]
};


export const generateInitialScenario = async (characterName: string, characterClass: string): Promise<GeminiStoryResponse> => {
    const prompt = `
        You are the Dungeon Master for a text-based fantasy adventure game. Create an exciting starting scenario for a new character.
        Character Name: ${characterName}
        Character Class: ${characterClass}

        Your response MUST be a valid JSON object that strictly follows the provided schema.
        
        Instructions:
        1.  Set initial HP and MP based on the character's class. A warrior should have high HP, a mage high MP, a rogue should be balanced.
        2.  The story should be engaging and immediately present a challenge or a choice.
        3.  Provide 3-4 distinct choices for the player.
        4.  Provide a starting inventory relevant to the character's class.
        5.  The sceneDescription should be a short, vivid phrase for an image generator (e.g., "A lone warrior standing at the entrance of a dark, mossy cave.").
    `;

    const response = await ai.models.generateContent({
        model: storyModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeminiStoryResponse;
    } catch (e) {
        console.error("Failed to parse initial scenario JSON:", response.text);
        throw new Error("Received an invalid format from the story generator.");
    }
};

export const generateNextStep = async (storyContext: string, playerChoice: string, character: Character): Promise<GeminiStoryResponse> => {
    const prompt = `
        You are the Dungeon Master for a text-based fantasy adventure game. The player has just made a decision. Continue the story based on their action.

        Here is the current state of the character:
        - Name: ${character.name}
        - Class: ${character.characterClass}
        - HP: ${character.hp}/${character.maxHp}
        - MP: ${character.mp}/${character.maxMp}
        - Inventory: [${character.inventory.join(', ')}]
        
        Recent story context:
        ---
        ${storyContext}
        ---

        Player's Action: "${playerChoice}"

        Your response MUST be a valid JSON object that strictly follows the provided schema.

        Instructions:
        1.  Write the next part of the narrative describing the outcome of the player's action.
        2.  Update the character's stats and inventory as appropriate. If they get into a fight, they might lose HP. If they find treasure, they gain an item.
        3.  If the character's HP reaches 0, the story should describe their demise and the "choices" array should be empty to signify game over.
        4.  If the game is not over, provide 2-4 new, relevant choices.
        5.  Create a new sceneDescription for the image generator based on the new situation.
    `;

    const response = await ai.models.generateContent({
        model: storyModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });
    
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeminiStoryResponse;
    } catch (e) {
        console.error("Failed to parse next step JSON:", response.text);
        throw new Error("Received an invalid format from the story generator.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    const fullPrompt = `Epic fantasy digital painting of ${prompt}, dramatic lighting, detailed, high quality.`;
    const response = await ai.models.generateContent({
        model: imageModel,
        contents: {
            parts: [{ text: fullPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error("No image was generated.");
};
