import { test, expect } from '@playwright/test';

test.describe('Ollama AI Portfolio Assistant E2E Tests', () => {
  // Give local LLM inference sufficient time to load weights on first request
  test.describe.configure({ timeout: 60000 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens and closes chat window smoothly', async ({ page }) => {
    const toggleBtn = page.locator('.chat-toggle-btn');
    await expect(toggleBtn).toBeVisible();

    // Open chat
    await toggleBtn.click();
    const chatWindow = page.locator('.chat-window');
    await expect(chatWindow).toBeVisible();

    // Verify welcome state
    await expect(page.locator('.chat-welcome')).toContainText('Hello!');

    // Close chat
    await page.locator('.chat-btn-close').click();
    await expect(chatWindow).not.toBeVisible();
  });

  test('answers question about Karthik role via local Ollama model', async ({ page }) => {
    // Open chat
    await page.locator('.chat-toggle-btn').click();
    await expect(page.locator('.chat-window')).toBeVisible();

    // Type query
    const input = page.locator('.chat-input');
    await input.fill('Where does Karthik intern?');
    await page.locator('.chat-submit-btn').click();

    // Verify message responds
    const assistantMsg = page.locator('.chat-message.assistant .message-content');
    await expect(assistantMsg.first()).toBeVisible({ timeout: 40000 });

    // Verify content from local llama3.2:3b model
    const text = await assistantMsg.first().textContent();
    expect(text.toLowerCase()).toContain('llamapress');
  });

  test('answers question about education and GPA accurately', async ({ page }) => {
    await page.locator('.chat-toggle-btn').click();

    const input = page.locator('.chat-input');
    await input.fill("What is Karthik's GPA and university?");
    await page.locator('.chat-submit-btn').click();

    const assistantMsg = page.locator('.chat-message.assistant .message-content');
    await expect(assistantMsg.first()).toBeVisible({ timeout: 40000 });

    const text = await assistantMsg.first().textContent();
    expect(text).toMatch(/Arizona State|ASU|4\.0/i);
  });

  test('clears conversation history when clear button is clicked', async ({ page }) => {
    await page.locator('.chat-toggle-btn').click();

    const input = page.locator('.chat-input');
    await input.fill('Hi');
    await page.locator('.chat-submit-btn').click();

    await expect(page.locator('.chat-message.assistant')).toBeVisible({ timeout: 40000 });

    // Clear chat
    await page.locator('.chat-btn-clear').click();

    // Verify back to welcome
    await expect(page.locator('.chat-welcome')).toBeVisible();
    await expect(page.locator('.chat-message')).toHaveCount(0);
  });
});
