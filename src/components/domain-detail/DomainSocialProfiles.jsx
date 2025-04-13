import React from "react";
import { AlertTriangle, Link2, ExternalLink, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Globe } from "lucide-react";

// Helper to get the right icon for a social platform
const getSocialIcon = (platform) => {
  const normalizedPlatform = platform?.toLowerCase() || '';
  
  if (normalizedPlatform.includes('facebook')) return Facebook;
  if (normalizedPlatform.includes('twitter') || normalizedPlatform.includes('x.com')) return Twitter;
  if (normalizedPlatform.includes('instagram')) return Instagram;
  if (normalizedPlatform.includes('youtube')) return Youtube;
  if (normalizedPlatform.includes('linkedin')) return Linkedin;
  if (normalizedPlatform.includes('github')) return Github;
  
  return Globe;
};

// Extract username from social media URL
const extractUsername = (url, platform) => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').filter(Boolean);
    
    const normalizedPlatform = platform?.toLowerCase() || '';
    
    if (normalizedPlatform.includes('facebook')) {
      return path[0] || urlObj.hostname.split('.')[0];
    }
    
    if (normalizedPlatform.includes('twitter') || normalizedPlatform.includes('x.com')) {
      return '@' + (path[0] || '');
    }
    
    if (normalizedPlatform.includes('instagram')) {
      return '@' + (path[0] || '');
    }
    
    if (normalizedPlatform.includes('linkedin')) {
      // LinkedIn URLs can be complex - company, profile, etc.
      return path.length > 1 ? path.slice(-1)[0] : path[0] || '';
    }
    
    // For platforms we don't have specific parsing for, just return the path
    return path.join('/') || urlObj.hostname;
  } catch (e) {
    console.error('Error parsing social URL:', url, e);
    return url;
  }
};

export default function DomainSocialProfiles({ domain }) {
  if (!domain) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Data Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No information has been crawled for this domain.
        </p>
      </div>
    );
  }

  const socialProfiles = domain.opengraph?.filter(item => item.isSocialProfile || item.type === 'social_profile') || [];

  if (socialProfiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Link2 className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Social Profiles Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No social media profiles were detected for this domain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Social Media Profiles</h3>
        <span className="text-sm text-muted-foreground">
          {socialProfiles.length} profile{socialProfiles.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {socialProfiles.map((profile, index) => {
          const SocialIcon = getSocialIcon(profile.platform || profile.title);
          const username = extractUsername(profile.url, profile.platform || profile.title);
          
          return (
            <div 
              key={index} 
              className="flex flex-col rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <SocialIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{profile.platform || profile.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{username}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <a 
                  href={profile.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit Profile
                </a>
                <span className="flex-1 truncate text-right text-xs text-muted-foreground">
                  {profile.url}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 