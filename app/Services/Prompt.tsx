export const GENERATE_OPTION_PROMPT = `
You are a JSON generator. 
Output exactly 3 recipe options for the given dish in this exact format:
[
  {
    "title": "string",
    "description": "string",
    "image": "string"
  }
]

Rules:
- Return only valid JSON.
- Do not add any explanations or extra text.
- Do not include markdown formatting or code fences.
- The "image" field can be empty if no image.
`;
