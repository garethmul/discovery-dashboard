import React from "react";
import { AlertTriangle, Lightbulb, BarChart, LucideCode, Star, Brain } from "lucide-react";

export default function DomainAiAnalysis({ domain }) {
  // Check multiple possible locations for AI analysis data
  const aiData = domain?.aiAnalysis || domain?.ai_analysis || domain?.brandAnalysis || domain?.data?.aiAnalysis;
  
  console.log("AI Analysis data:", aiData);
  
  if (!domain || !aiData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No AI Analysis Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          AI analysis has not been generated for this domain.
        </p>
      </div>
    );
  }

  // Determine if this is a basic text analysis
  const isRawTextAnalysis = typeof aiData === 'string' || aiData.analysis;
  
  // For raw text analysis just display it directly
  if (isRawTextAnalysis) {
    const analysisText = typeof aiData === 'string' ? aiData : aiData.analysis;
    
    return (
      <div className="space-y-6">
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <h3 className="text-sm font-medium">AI Analysis</h3>
            </div>
          </div>
          <div className="p-4">
            <p className="whitespace-pre-line text-sm">{analysisText}</p>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise use the structured analysis format
  const analysis = aiData;

  const renderSentimentSection = () => {
    if (!analysis.sentiment) return null;
    
    const { score, label, confidence } = analysis.sentiment;
    
    const getSentimentColor = () => {
      if (label === "positive") return "text-green-500";
      if (label === "negative") return "text-red-500";
      return "text-amber-500"; // neutral
    };
    
    const getSentimentEmoji = () => {
      if (label === "positive") return "😀";
      if (label === "negative") return "😞";
      return "😐"; // neutral
    };
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <h3 className="text-sm font-medium">Content Sentiment Analysis</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-5xl">{getSentimentEmoji()}</div>
            <div className={`text-xl font-bold capitalize ${getSentimentColor()}`}>
              {label}
            </div>
            <div className="text-sm text-muted-foreground">
              Sentiment score: {score.toFixed(2)} (Confidence: {(confidence * 100).toFixed(0)}%)
            </div>
          </div>
          
          {analysis.sentiment.explanation && (
            <div className="mt-4">
              <p className="text-sm">{analysis.sentiment.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderTopicsSection = () => {
    if (!analysis.topics || analysis.topics.length === 0) return null;
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <h3 className="text-sm font-medium">Main Topics</h3>
          </div>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {analysis.topics.map((topic, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium">{topic.name}</h4>
                  {topic.relevance && (
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-full max-w-40 overflow-hidden rounded-full bg-muted">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${topic.relevance * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {(topic.relevance * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  const renderKeywordsSection = () => {
    if (!analysis.keywords || analysis.keywords.length === 0) return null;
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <h3 className="text-sm font-medium">Key Terms</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, index) => (
              <div 
                key={index}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                title={`Relevance: ${(keyword.relevance * 100).toFixed(0)}%`}
              >
                {keyword.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderSummarySection = () => {
    if (!analysis.summary) return null;
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <LucideCode className="h-4 w-4" />
            <h3 className="text-sm font-medium">Content Summary</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm">{analysis.summary}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderSentimentSection()}
      {renderSummarySection()}
      <div className="grid gap-6 md:grid-cols-2">
        {renderTopicsSection()}
        {renderKeywordsSection()}
      </div>
    </div>
  );
} 