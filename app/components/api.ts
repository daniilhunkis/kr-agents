"use client";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export function getTgInitData(): string | null {
  try {
    // initData передаётся только внутри Telegram WebApp
    // вне Telegram просто вернём null
    // @ts-ignore
    const tg = window?.Telegram?.WebApp;
    return tg?.initData || null;
  } catch {
    return null;
  }
}

export async function authTelegram(): Promise<string | null> {
  const initData = getTgInitData();
  if (!initData) return null;
  try {
    const res = await fetch(`${API}/auth/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const token = data?.access_token || data?.token || null;
    if (token) localStorage.setItem("jwt", token);
    return token;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt");
}

export async function apiGetMe() {
  const token = getToken();
  const res = await fetch(`${API}/me`, {
  headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("ME_FAILED");
  return res.json();
}

export async function apiUpdateProfile(payload: { first_name: string; last_name: string; phone: string; }) {
  const token = getToken();
  const res = await fetch(`${API}/me/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("PROFILE_UPDATE_FAILED");
  return res.json();
}
