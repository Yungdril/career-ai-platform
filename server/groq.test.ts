import { describe, it, expect } from "vitest";
import { invokeGroq } from "./_core/groq";

describe("Groq API Integration", () => {
  it("should successfully call Groq API with valid key", async () => {
    try {
      const response = await invokeGroq({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: "Say 'Groq API is working' in exactly those words.",
          },
        ],
        max_tokens: 50,
      });

      expect(response).toBeDefined();
      expect(typeof response).toBe("string");
      expect(response.length).toBeGreaterThan(0);
      console.log("✓ Groq API test passed:", response);
    } catch (error) {
      console.error("✗ Groq API test failed:", error);
      throw error;
    }
  });
});
