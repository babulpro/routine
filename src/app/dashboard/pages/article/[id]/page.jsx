"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function EditRoutinePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/user/article/byId?id=${id}`,{ cache: 'force-cache' });
        if (!response.ok) throw new Error("Failed to fetch article");
        const { data } = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const paragraphs = article.article?.split(/\n\s*\n/) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 to-slate-600 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Article Card */}
        <article className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Cover Image */}
          {article.image && (
            <div className="relative h-80 w-full overflow-hidden">
              <img
                src={article.image}
                alt={article.heading || "Article cover"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {article.heading || "Untitled Article"}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-slate-300 rounded-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl">
                {article.userId?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {article.userId?.name || "Anonymous Author"}
                </p>
                <p className="text-sm text-slate-900">
                  Published on {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-slate-900 leading-relaxed">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, index) => (
                  <p key={index} className="mb-6 text-lg leading-8 whitespace-pre-line">
                    {para.trim()}
                  </p>
                ))
              ) : (
                <p className="text-lg leading-8">{article.article}</p>
              )}
            </div>

            {/* Article Meta */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-900">Last updated:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-slate-900">Published</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </button>
        </div>
      </div>

      {/* Floating Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
          style={{ width: '30%' }} // You can make this dynamic based on scroll
        ></div>
      </div>
    </div>
  );
}