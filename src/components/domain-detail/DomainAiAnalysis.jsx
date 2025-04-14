import React from "react";
import { AlertTriangle, Lightbulb, BarChart, LucideCode, Star, Brain, Palette, Rocket, Megaphone, Target } from "lucide-react";

export default function DomainAiAnalysis({ domain }) {
  // Check multiple possible locations for AI analysis data
  const aiData = domain?.data?.aiAnalysis;
  const brandfetchData = domain?.data?.brandfetch;
  
  console.log("Domain data:", domain);
  console.log("AI Analysis data:", aiData);
  console.log("Brandfetch data:", brandfetchData);
  
  if (!domain || (!aiData && !brandfetchData)) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Analysis Available</h3>
        <p className="text-sm text-muted-foreground">
          No analysis data is available for this domain.
        </p>
      </div>
    );
  }

  const renderBrandAnalysis = () => {
    const brandData = brandfetchData?.data || {};
    const brandAnalysis = aiData?.brandAnalysis || {};

    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <h3 className="text-sm font-medium">Brand Analysis</h3>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {/* Brandfetch Data */}
          {brandData.name && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Brand Name</h4>
              <p className="text-sm text-muted-foreground">{brandData.name}</p>
            </div>
          )}
          {brandData.colors?.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Brand Colors</h4>
              <div className="flex flex-wrap gap-2">
                {brandData.colors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs mt-1">{color.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {brandData.fonts?.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Brand Fonts</h4>
              <div className="space-y-2">
                {brandData.fonts.map((font, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {font.name} ({font.type})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Brand Analysis */}
          {Object.entries(brandAnalysis).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <h4 className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</h4>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    if (!aiData?.features?.length) return null;
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <h3 className="text-sm font-medium">Feature Suggestions</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {aiData.features.map((feature, index) => (
              <div key={index} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    feature.priority === 'high' ? 'bg-red-100 text-red-700' :
                    feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {feature.priority}
                  </div>
                  <h4 className="font-medium">{feature.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderColorSchemes = () => {
    if (!aiData?.colorSchemes?.length) return null;
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <h3 className="text-sm font-medium">Color Schemes</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {aiData.colorSchemes.map((scheme, index) => (
              <div key={index} className="rounded-lg border p-3 space-y-2">
                <h4 className="font-medium">{scheme.name}</h4>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.primary }}></div>
                    <span className="text-xs mt-1">Primary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.secondary }}></div>
                    <span className="text-xs mt-1">Secondary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.accent }}></div>
                    <span className="text-xs mt-1">Accent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAppIdeas = () => {
    if (!aiData?.appIdea1) return null;
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            <h3 className="text-sm font-medium">App Ideas</h3>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {aiData.appIdea1 && (
            <div className="space-y-2">
              <h4 className="font-medium">{aiData.appIdea1Headline}</h4>
              <p className="text-sm text-muted-foreground">{aiData.appIdea1}</p>
            </div>
          )}
          {aiData.appIdea2 && (
            <div className="space-y-2">
              <h4 className="font-medium">{aiData.appIdea2Headline}</h4>
              <p className="text-sm text-muted-foreground">{aiData.appIdea2}</p>
            </div>
          )}
          {aiData.appIdea3 && (
            <div className="space-y-2">
              <h4 className="font-medium">{aiData.appIdea3Headline}</h4>
              <p className="text-sm text-muted-foreground">{aiData.appIdea3}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMarketingTips = () => {
    if (!aiData.marketingTips || !aiData.marketingTips.length) return null;
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <h3 className="text-sm font-medium">Marketing Tips</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {aiData.marketingTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <Megaphone className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm">{tip.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tip.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderBrandAnalysis()}
      {renderFeatures()}
      {renderColorSchemes()}
      {renderAppIdeas()}
      {renderMarketingTips()}
    </div>
  );
} 