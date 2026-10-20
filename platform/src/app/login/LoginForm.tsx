"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginForm({ next, email }: { next: string; email: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {
    step: "request",
    error: null,
    info: null,
  });
  const [hasCode, setHasCode] = useState(false);

  const message = (
    <>
      {state.info && <p className="info">{state.info}</p>}
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
    </>
  );

  if (state.step === "request" && !hasCode) {
    return (
      <form action={action}>
        <input type="hidden" name="intent" value="send" />
        <p className="muted">Wir schicken dir einen Login-Code an {email}.</p>
        {message}
        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Wird gesendet …" : "Code per E-Mail senden"}
          </button>
          <button type="button" className="btn" onClick={() => setHasCode(true)}>
            Ich habe schon einen Code
          </button>
        </div>
      </form>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="intent" value="verify" />
      <input type="hidden" name="next" value={next} />
      <label htmlFor="code">Code aus der E-Mail</label>
      <input
        id="code"
        name="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]{6,7}"
        maxLength={7}
        required
        autoFocus
      />
      {message}
      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Wird geprüft …" : "Anmelden"}
        </button>
        <button type="submit" name="resend" value="1" className="btn" disabled={pending} formNoValidate>
          Neuen Code senden
        </button>
      </div>
    </form>
  );
}
