"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function PostList() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      setName("");
      setContent("");
      setPublished(false);
      setPublishedAt("");
      setImageUrl("");
      setSelectedUserId(null);
    },
  });
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
    },
  });
  const updatePost = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      setEditingId(null);
      setEditValue("");
    },
  });

  const { data: posts, isLoading } = api.post.getAll.useQuery();
  const { data: users } = api.user.getAll.useQuery();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Post Creation Form */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 mb-8 border border-white/10 shadow-2xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
          Create New Post
        </h2>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !content.trim()) {
              setError("Please enter a post title and content.");
              return;
            }
            if (imageUrl && !/^https?:\/\//.test(imageUrl)) {
              setError("Image URL must be a valid URL.");
              return;
            }
            setError("");
            createPost.mutate({
              name,
              content,
              published,
              publishedAt: published ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null,
              imageUrl: imageUrl || null,
              userId: selectedUserId,
            });
            setName("");
            setContent("");
            setPublished(false);
            setPublishedAt("");
            setImageUrl("");
            setSelectedUserId(null);
          }}
          className="space-y-6"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="post-title" className="text-sm font-semibold text-white/90 uppercase tracking-wide">
              Post Title
            </label>
            <input
              id="post-title"
              type="text"
              placeholder="Enter an engaging title..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 placeholder-white/50"
              autoComplete="off"
            />
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label htmlFor="post-content" className="text-sm font-semibold text-white/90 uppercase tracking-wide">
              Content
            </label>
            <textarea
              id="post-content"
              placeholder="Write your post content here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 placeholder-white/50 min-h-[120px] resize-vertical"
            />
          </div>

          {/* Author Selection */}
          <div className="space-y-2">
            <label htmlFor="post-user" className="text-sm font-semibold text-white/90 uppercase tracking-wide">
              Author
            </label>
            <select
              id="post-user"
              value={selectedUserId ?? ""}
              onChange={e => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select an author</option>
              {users?.map(user => (
                <option key={user.id} value={user.id} className="bg-gray-800">
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <input
              id="post-published"
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              className="w-5 h-5 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400"
            />
            <label htmlFor="post-published" className="text-sm font-medium text-white">
              Publish this post
            </label>
          </div>

          {/* Published Date (conditional) */}
          {published && (
            <div className="space-y-2">
              <label htmlFor="post-publishedAt" className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                Publish Date
              </label>
              <input
                id="post-publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={e => setPublishedAt(e.target.value)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Image URL */}
          <div className="space-y-2">
            <label htmlFor="post-imageUrl" className="text-sm font-semibold text-white/90 uppercase tracking-wide">
              Featured Image URL
            </label>
            <input
              id="post-imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 placeholder-white/50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={createPost.isPending}
          >
            {createPost.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Post...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          All Posts
        </h3>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((postData) => {
              const post = postData.post;
              const user = postData.user;
              return (
                <article key={post.id} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
                  {/* Author Info */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-purple-300 font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.createdAt ? new Date(post.createdAt).toLocaleTimeString() : ""}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-4">
                    {editingId === post.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full rounded-lg bg-white/20 px-3 py-2 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <div className="flex space-x-2">
                          <button
                            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                            onClick={() => {
                              if (editValue.trim()) {
                                updatePost.mutate({ id: post.id, name: editValue });
                              }
                            }}
                            disabled={updatePost.isPending}
                          >
                            Save
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors"
                            onClick={() => {
                              setEditingId(null);
                              setEditValue("");
                            }}
                            disabled={updatePost.isPending}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-white">{post.name}</h2>
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                              onClick={() => {
                                setEditingId(post.id);
                                setEditValue(post.name);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this post?")) {
                                  deletePost.mutate({ id: post.id });
                                }
                              }}
                              disabled={deletePost.isPending}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed">{post.content}</p>
                        
                        {/* Post Metadata */}
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                            Views: {post.views}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            post.published 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                          {post.published && post.publishedAt && (
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                              Published: {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        {/* Featured Image */}
                        {post.imageUrl && (
                          <div className="mt-4">
                            <img 
                              src={post.imageUrl} 
                              alt="Post featured image" 
                              className="w-full max-h-48 rounded-xl object-cover border border-white/10 shadow-lg"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg">No posts yet. Be the first to create one!</p>
            <p className="text-gray-500 text-sm mt-2">Your posts will appear here once you create them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
