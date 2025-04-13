import React, { useState } from "react";
import { AlertTriangle, Calendar, ChevronDown, ChevronRight, Clock, Tag, User } from "lucide-react";
import { Button } from "../ui/button";

export default function DomainBlogContent({ domain }) {
  const [expandedPost, setExpandedPost] = useState(null);

  if (!domain || !domain.blog_content || domain.blog_content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Blog Content Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No blog content has been detected or crawled for this domain.
        </p>
      </div>
    );
  }

  const blogPosts = domain.blog_content;

  const toggleExpand = (index) => {
    if (expandedPost === index) {
      setExpandedPost(null);
    } else {
      setExpandedPost(index);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Blog Posts ({blogPosts.length})</h2>
      </div>

      <div className="space-y-4">
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border transition-all"
          >
            <div
              className="cursor-pointer bg-card p-4 hover:bg-muted/20"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{post.title}</h3>
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(index);
                }}>
                  {expandedPost === index ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Meta information */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {post.published_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(post.published_date)}</span>
                  </div>
                )}
                {post.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.reading_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.reading_time} min read</span>
                  </div>
                )}
              </div>

              {/* Preview text */}
              {post.summary && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.summary}
                </p>
              )}
            </div>

            {/* Expanded content */}
            {expandedPost === index && (
              <div className="border-t bg-muted/10 p-4">
                {post.content && (
                  <div className="prose prose-sm max-w-none">
                    <p>{post.content}</p>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-1 text-sm font-medium">
                      <Tag className="h-4 w-4" />
                      <span>Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Link to original */}
                {post.url && (
                  <div className="mt-4 flex justify-end">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Read original post
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 