import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { email as validEmail } from '../lib/validators';

/** Demo sign-in (journey step 1-2). No backend, so any valid e-mail and a 6+ character password works. */
export default function AuthModal({ open, onClose }) {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    const emailErr = validEmail(form.email);
    if (emailErr) next.email = emailErr;
    if (form.password.length < 6) next.password = 'Use at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;
    login(form.email.trim());
    toast('Signed in. Welcome back!');
    setForm({ email: '', password: '' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Sign in to Book Worm" size="max-w-md" variant="sheet">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="auth-email" className="field-label">E-mail</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            className="field"
            placeholder="you@example.com"
            value={form.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'auth-email-err' : undefined}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p id="auth-email-err" className="field-error">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="auth-password" className="field-label">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete="current-password"
            className="field"
            value={form.password}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'auth-password-err' : undefined}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p id="auth-password-err" className="field-error">{errors.password}</p>}
        </div>
        <button type="submit" className="btn-primary w-full">Sign in</button>
        <p className="text-xs text-fg3">Demo only: there is no server, so nothing is sent anywhere. You can also keep browsing as a guest.</p>
      </form>
    </Modal>
  );
}
