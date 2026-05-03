import { StoryGenerationError } from "@/domain/story-generation";
import { HttpStoryProviderAdapter } from "@/services/story-generation/provider";
import type { StoryProviderInput } from "@/services/story-generation/provider";

const input: StoryProviderInput = {
  params: {
    childName: "Luna",
    childAge: 6,
    theme: "animals",
    storyType: "bedtime",
    duration: "short"
  },
  prompt: {
    system: "system",
    user: "user"
  }
};

describe("HttpStoryProviderAdapter", () => {
  function mockFetch(response: unknown) {
    const fetchMock = jest.fn();
    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      configurable: true,
      writable: true
    });
    fetchMock.mockResolvedValue(response);
    return fetchMock;
  }

  function jsonResponse(body: unknown, ok = true) {
    return {
      ok,
      json: jest.fn(async () => body)
    } as unknown as Response;
  }

  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "fetch");
  });

  it("posts story params and returns normalized raw JSON for the service boundary", async () => {
    const fetchMock = mockFetch(
      jsonResponse({
        title: "A Noite de Luna",
        text: "**[SONOLENTO]** Luna dormiu em paz.",
        estimatedMinutes: 3,
        promptVersion: "tts-template-v1.0.0"
      })
    );

    const output = await new HttpStoryProviderAdapter("/api/test").generate(input);

    expect(fetchMock).toHaveBeenCalledWith("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input.params)
    });
    expect(JSON.parse(output.rawText)).toMatchObject({
      title: "A Noite de Luna",
      text: "**[SONOLENTO]** Luna dormiu em paz.",
      estimatedMinutes: 3,
      promptVersion: "tts-template-v1.0.0"
    });
  });

  it("maps API error codes to typed generation errors", async () => {
    mockFetch(jsonResponse({ error: { code: "provider_malformed" } }, false));

    await expect(new HttpStoryProviderAdapter("/api/test").generate(input)).rejects.toMatchObject<StoryGenerationError>({
      code: "provider_malformed"
    });
  });

  it("maps network failures to provider unavailable", async () => {
    const fetchMock = jest.fn();
    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      configurable: true,
      writable: true
    });
    fetchMock.mockRejectedValue(new Error("offline"));

    await expect(new HttpStoryProviderAdapter("/api/test").generate(input)).rejects.toMatchObject<StoryGenerationError>({
      code: "provider_unavailable"
    });
  });
});
