import React from "react";
import { AlertTriangle, Target, Megaphone, Palette, Rocket } from "lucide-react";

const DomainAiAnalysis = ({ domain }) => {
  const aiData = domain?.aiAnalysis;
  
  console.log("Domain data:", domain);
  console.log("AI Analysis data:", aiData);
  
  if (!domain || !aiData) {
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
          <div className="grid gap-6 sm:grid-cols-2">
            {aiData.colorSchemes.map((scheme, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium">{scheme.name}</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <div 
                      className="h-12 w-full rounded-lg shadow-sm" 
                      style={{ backgroundColor: scheme.primary || scheme.primary_color }}
                    />
                    <p className="text-xs text-center text-muted-foreground">Primary</p>
                    <p className="text-xs text-center font-mono">{scheme.primary || scheme.primary_color}</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="h-12 w-full rounded-lg shadow-sm" 
                      style={{ backgroundColor: scheme.secondary || scheme.secondary_color }}
                    />
                    <p className="text-xs text-center text-muted-foreground">Secondary</p>
                    <p className="text-xs text-center font-mono">{scheme.secondary || scheme.secondary_color}</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="h-12 w-full rounded-lg shadow-sm" 
                      style={{ backgroundColor: scheme.accent || scheme.accent_color }}
                    />
                    <p className="text-xs text-center text-muted-foreground">Accent</p>
                    <p className="text-xs text-center font-mono">{scheme.accent || scheme.accent_color}</p>
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
        <div className="p-4 space-y-6">
          {aiData.appIdea1 && (
            <div className="space-y-2">
              <h4 className="font-medium">{aiData.appIdea1Headline || "App Idea 1"}</h4>
              <p className="text-sm text-muted-foreground">{aiData.appIdea1}</p>
            </div>
          )}
          {aiData.appIdea2 && (
            <div className="space-y-2">
              <h4 className="font-medium">{aiData.appIdea2Headline || "App Idea 2"}</h4>
              <p className="text-sm text-muted-foreground">{aiData.appIdea2}</p>
            </div>
          )}
          {aiData.appIdea3 && (
            <div className="space-y-2">
              <h4 className="font-medium">{aiData.appIdea3Headline || "App Idea 3"}</h4>
              <p className="text-sm text-muted-foreground">{aiData.appIdea3}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMarketingTips = () => {
    if (!aiData.marketingTips || !aiData.marketingTips.length) return null;
    
    // Group tips by category
    const tipsByCategory = aiData.marketingTips.reduce((acc, tip) => {
      const category = tip.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tip);
      return acc;
    }, {});
    
    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <h3 className="text-sm font-medium">Marketing Tips</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-6">
            {Object.entries(tipsByCategory).map(([category, tips]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-sm">{category}</h4>
                <div className="grid gap-3">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Megaphone className="h-3 w-3 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">{tip.text || tip.tip_text}</p>
                        {tip.description && (
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
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

export default DomainAiAnalysis; 