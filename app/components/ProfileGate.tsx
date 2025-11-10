"use client";
import { useEffect, useState } from "react";
import { authTelegram, apiGetMe, apiUpdateProfile } from "./api";

type Me = { first_name?: string|null; last_name?: string|null; phone?: string|null; is_profile_complete?: boolean };

export default function ProfileGate({ children }:{ children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    (async () => {
      // 1) пробуем авторизацию через Telegram initData
      await authTelegram();
      // 2) получаем профиль
      try {
        const data = await apiGetMe();
        setMe(data);
        const complete = !!data?.is_profile_complete;
        setShowForm(!complete);
      } catch {
        setShowForm(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, "");
    if (!/^7\d{10}$/.test(cleaned)) {
      alert("Телефон должен быть в формате 7XXXXXXXXXX");
      return;
    }
    try {
      await apiUpdateProfile({ first_name, last_name, phone: cleaned });
      const data = await apiGetMe();
      setMe(data);
      setShowForm(false);
    } catch {
      alert("Не удалось сохранить профиль");
    }
  };

  if (loading) return <div style={{padding:16}}>Загрузка…</div>;

  if (showForm) {
    return (
      <div style={{padding:16}}>
        <h2>Заполните анкету</h2>
        <form onSubmit={onSubmit} style={{display:"grid", gap:8, maxWidth:360}}>
          <input placeholder="Имя" value={first_name} onChange={e=>setFirst(e.target.value)} required />
          <input placeholder="Фамилия" value={last_name} onChange={e=>setLast(e.target.value)} required />
          <input placeholder="Телефон (7XXXXXXXXXX)" value={phone} onChange={e=>setPhone(e.target.value)} required />
          <button type="submit" style={{padding:"10px 14px"}}>Сохранить</button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
