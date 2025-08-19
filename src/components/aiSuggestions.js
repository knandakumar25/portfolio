// Test file for AI suggestion feature
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const generateAISuggestions = async (botResponse, genAI) => {
  if (!genAI) {
    return ["Tell me more", "What else?", "Show me more"];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const suggestionPrompt = `Based on this response about Karthik's portfolio: "${botResponse}"

Generate exactly 3 short follow-up questions (under 40 characters each) that a user might ask next. Return only the questions, one per line, no numbering or bullets.`;

    const result = await model.generateContent(suggestionPrompt);
    const response = await result.response;
    const suggestions = response.text().trim().split('\n').map(s => s.trim()).slice(0, 3);
    
    return suggestions.length === 3 ? suggestions : ["Tell me more", "What else?", "Show me more"];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return ["Tell me more", "What else?", "Show me more"];
  }
};

export { generateAISuggestions };
