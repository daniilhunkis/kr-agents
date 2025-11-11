import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface StoryItem {
  rank: number;
  object_id: number;
}

interface StorySet {
  id: number;
  category: string;
  items: StoryItem[];
}

export default function Home() {
  const [stories, setStories] = useState<StorySet[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/stories/today").then((res) => {
      setStories(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🏡 Сторисы лучших цен</h1>
      {stories.map((s) => (
        <div key={s.id} style={{ marginBottom: 40 }}>
          <h2>{s.category.toUpperCase()}</h2>
          <Swiper slidesPerView={1}>
            {s.items.map((i) => (
              <SwiperSlide key={i.rank}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 20,
                    background: "#f9f9f9",
                  }}
                >
                  <p>Объект #{i.object_id}</p>
                  <p>Рейтинг: {i.rank}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
}
