"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function UserList() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.user.getAll.invalidate();
      setName("");
      setEmail("");
      setError("");
    },
  });
  const { data: users, isLoading } = api.user.getAll.useQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter both name and email.");
      return;
    }
    setError("");
    createUser.mutate({ name, email });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 rounded-xl p-8 shadow-lg mt-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-6 text-center w-full">User List</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white/10 rounded-xl shadow p-6 mb-8 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="user-name" className="text-sm font-medium text-white">Name</label>
          <input
            id="user-name"
            type="text"
            placeholder="User name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-lg bg-white/20 px-4 py-2 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-300"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="user-email" className="text-sm font-medium text-white">Email</label>
          <input
            id="user-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-lg bg-white/20 px-4 py-2 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-300"
            autoComplete="off"
          />
        </div>
        {error && <div className="text-red-400 text-sm font-medium mt-1">{error}</div>}
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-semibold text-white shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 mt-2"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? "Adding..." : "Add User"}
        </button>
      </form>
      <div className="w-full">
        {isLoading ? (
          <p className="text-center text-gray-300">Loading users...</p>
        ) : users && users.length > 0 ? (
          <ul className="space-y-4">
            {users.map(user => (
              <li key={user.id} className="p-4 rounded-lg bg-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-1 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="font-bold text-lg text-white">{user.name}</span>
                  <span className="text-xs text-gray-300">{user.email}</span>
                </div>
                <span className="text-xs text-gray-400 mt-1 md:mt-0 md:text-right">{user.createdAt ? new Date(user.createdAt).toLocaleString() : ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-300">No users yet. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
} 