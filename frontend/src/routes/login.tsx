import * as React from "react";
import { flushSync } from "react-dom";
import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { useAuth } from "../auth"; // Ensure this path matches your project structure

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().default("/"),
  }),
  component: LoginComponent,
});

const routeApi = getRouteApi("/login");

function LoginComponent() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const search = routeApi.useSearch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here we use the login function provided by the useAuth hook
      await auth.login(username, password);

      // Using flushSync here is not necessary unless you have specific reasons
      // related to concurrent React features.
      navigate({ to: search.redirect || "/" });
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show an error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 h-screen flex justify-center items-center bg-white"> {/* Adjusted to center content */}
      <div className="w-full max-w-md py-8"> {/* Added vertical padding */}
        <form className="mt-4" onSubmit={handleLogin}>
          <fieldset
            disabled={isSubmitting}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2 items-center">
              <label htmlFor="username-input" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="password-input" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </fieldset>
        </form>
        <div className="mt-4 text-center">
          No account? <a href="/register" className="text-blue-500">Register now</a>
        </div>
      </div>
    </div>
  );
}
