"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/user/article",{ cache: 'force-cache' });
        if (!response.ok) throw new Error("Failed to fetch articles");
        
        const { data } = await response.json();
        setArticles(data);
      } catch (e) {
        setError(e.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCopyLink = async (id) => {
    const url = `${window.location.origin}/dashboard/pages/article/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-700 font-medium">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 to-white">
      {/* Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          📚 Latest Articles
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover insightful content and share your favorite reads with others
        </p>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 pb-16">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No articles yet
            </h3>
            <p className="text-gray-500">
              Be the first to create an amazing article!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article._id}
                className=" rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Image */}
                {article.image && (
                                    <div className="relative h-48 overflow-hidden">
                                      <img
                                        src={article.image}
                                        alt={article.heading || "Article cover"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                                    </div>
                                  )}

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>

                  {/* Title */}
                  <Link href={`/dashboard/pages/article/${article._id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors cursor-pointer">
                      {article.heading || "Untitled Article"}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.article?.split(" ").slice(0, 25).join(" ")}...
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/dashboard/pages/article/${article._id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
                    >
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => handleCopyLink(article._id)}
                      className={`p-2 rounded-full transition-all ${
                        copiedId === article._id
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                      }`}
                      title="Copy share link"
                    >
                      {copiedId === article._id ? (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link
        href="/dashboard/pages/article/create"
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110"
        title="Create new article"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}