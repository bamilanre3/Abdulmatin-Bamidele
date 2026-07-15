/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  Calendar, 
  User as UserIcon, 
  X, 
  Send,
  MessageCircle,
  Clock
} from "lucide-react";
import { BlogPost, Comment, User } from "../types";

interface BlogViewProps {
  user: User | null;
  onOpenLogin: () => void;
}

export default function BlogView({ user, onOpenLogin }: BlogViewProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error("Failed to fetch blog posts:", e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state instantly
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
        if (readingPost && readingPost.id === postId) {
          setReadingPost(prev => prev ? { ...prev, likes: data.likes } : null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (!readingPost || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch("/api/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: readingPost.id,
          author: user.name,
          text: commentText
        })
      });

      if (res.ok) {
        const newComment = await res.json();
        // Update local reading post comments state
        setReadingPost(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
        setCommentText("");
        fetchPosts(); // reload primary state
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const categories = ["All", "Market Analysis", "Trading Psychology", "Forex Tips", "Crypto Analysis"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Intro */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            The BOA Trading Editorial
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Daily market analysis, macro breakdowns, trading psychology hacks, and position sizing tips published by our lead institutional strategists.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/60">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search editorial topics..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Grid Cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 font-mono text-sm">
              No articles matched your criteria.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div 
                key={post.id}
                className="bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row h-auto md:h-[230px] group"
              >
                
                {/* Side image */}
                <div className="md:w-2/5 h-48 md:h-full relative overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 text-gray-900 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
                      <span className="flex items-center"><UserIcon className="w-3 h-3 mr-1" /> {post.author}</span>
                      <span>•</span>
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs font-mono text-gray-400">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                        className="flex items-center hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp className="w-4.5 h-4.5 mr-1" /> {post.likes}
                      </button>
                      <span className="flex items-center">
                        <MessageSquare className="w-4.5 h-4.5 mr-1" /> {post.comments.length}
                      </span>
                    </div>

                    <button
                      id={`read-blog-btn-${post.id}`}
                      onClick={() => setReadingPost(post)}
                      className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      Read Article
                    </button>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>

        {/* Read Expanded blog post Modal */}
        {readingPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header Image */}
              <div className="h-52 sm:h-64 relative bg-gray-100">
                <img 
                  src={readingPost.image} 
                  alt={readingPost.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <button 
                  onClick={() => setReadingPost(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 text-white space-y-1">
                  <span className="bg-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                    {readingPost.category}
                  </span>
                  <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
                    {readingPost.title}
                  </h3>
                </div>
              </div>

              {/* Body and Content */}
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* Meta details */}
                <div className="flex items-center space-x-6 text-xs text-gray-400 font-mono border-b border-gray-50 pb-4">
                  <span className="flex items-center"><UserIcon className="w-4 h-4 mr-1.5 text-blue-500" /> By {readingPost.author}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-indigo-500" /> Published {new Date(readingPost.date).toLocaleDateString()}</span>
                  <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1.5 text-amber-500" /> {readingPost.likes} Likes</span>
                </div>

                {/* Article Copy with custom formatting */}
                <div className="text-gray-600 text-sm leading-relaxed space-y-4 font-sans whitespace-pre-wrap">
                  {readingPost.content}
                </div>

                {/* Comments Thread Section */}
                <div className="border-t border-gray-100 pt-8 space-y-6">
                  <h4 className="font-extrabold text-gray-900 text-base flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                    Student Discussions ({readingPost.comments.length})
                  </h4>

                  {/* Add Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={user ? "Share your feedback/notes..." : "Log in to post a comment..."}
                      disabled={!user}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !user}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl text-white font-semibold text-xs flex items-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-gray-50">
                    {readingPost.comments.length === 0 ? (
                      <p className="text-xs text-gray-400 font-mono py-4">No comments posted yet. Be the first!</p>
                    ) : (
                      readingPost.comments.map((comm) => (
                        <div key={comm.id} className="pt-3.5 first:pt-0 flex items-start space-x-3 text-xs">
                          <img 
                            src={comm.avatar} 
                            alt={comm.author} 
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 mt-0.5"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-800">{comm.author}</span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {new Date(comm.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{comm.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
