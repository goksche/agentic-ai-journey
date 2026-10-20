"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });
  return (
    <form action={action}>
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password">Passwort</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Wird geprüft …" : "Anmelden"}
      </button>
    </form>
  );
}
