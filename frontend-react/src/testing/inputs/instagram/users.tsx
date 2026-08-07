import type { InstagramUserVerbose } from "@/transport/dtos/instagram";

export const WebHoundTesting___InstagramUsers: InstagramUserVerbose[] = [
  // 1. alex
  {
    kind: "public",
    username: "alex",
    pfp_url: "https://picsum.photos/id/101/200",
    followees: [
      { kind: "short", username: "mike", pfp_url: "https://picsum.photos/id/1/100" },
      { kind: "short", username: "nature", pfp_url: "https://picsum.photos/id/10/100" },
      { kind: "short", username: "city", pfp_url: "https://picsum.photos/id/20/100" },
    ],
    followers: [
      { kind: "short", username: "buddy", pfp_url: "https://picsum.photos/id/30/100" },
      { kind: "short", username: "wander", pfp_url: "https://picsum.photos/id/40/100" },
    ],
    posts: {
      description: "Golden hour in the Alps 🌄 #nature #mountains",
      media: [
        { kind: "photo", url: "https://picsum.photos/id/102/600" },
        { kind: "photo", url: "https://picsum.photos/id/103/600" },
        { kind: "video", url: "https://example.com/video1.mp4" },
      ],
    },
  },

  // 2. mia
  {
    kind: "public",
    username: "mia",
    pfp_url: "https://picsum.photos/id/200/200",
    followees: [{ kind: "short", username: "critic", pfp_url: "https://picsum.photos/id/50/100" }],
    followers: [
      { kind: "short", username: "joe", pfp_url: "https://picsum.photos/id/60/100" },
      { kind: "short", username: "ella", pfp_url: "https://picsum.photos/id/70/100" },
      { kind: "short", username: "sweet", pfp_url: "https://picsum.photos/id/80/100" },
    ],
    posts: {
      description: "Homemade pasta with truffle oil 🍝 #italianfood",
      media: [
        { kind: "video", url: "https://example.com/cooking1.mp4" },
        { kind: "photo", url: "https://picsum.photos/id/201/600" },
      ],
    },
  },

  // 3. emma
  {
    kind: "public",
    username: "emma",
    pfp_url: "https://picsum.photos/id/300/200",
    followees: [
      { kind: "short", username: "john", pfp_url: "https://picsum.photos/id/90/100" },
      { kind: "short", username: "library", pfp_url: "https://picsum.photos/id/100/100" },
      { kind: "short", username: "poet", pfp_url: "https://picsum.photos/id/110/100" },
    ],
    followers: [],
    posts: {
      description: "Currently reading «The Midnight Library» 📚",
      media: [{ kind: "photo", url: "https://picsum.photos/id/301/600" }],
    },
  },

  // 4. max
  {
    kind: "public",
    username: "max",
    pfp_url: "https://picsum.photos/id/400/200",
    followees: [{ kind: "short", username: "lucy", pfp_url: "https://picsum.photos/id/120/100" }],
    followers: [
      { kind: "short", username: "pro_gamer", pfp_url: "https://picsum.photos/id/130/100" },
    ],
    posts: {
      description: "New gaming setup finally complete! 🎮✨",
      media: [
        { kind: "photo", url: "https://picsum.photos/id/401/600" },
        { kind: "photo", url: "https://picsum.photos/id/402/600" },
        { kind: "photo", url: "https://picsum.photos/id/403/600" },
      ],
    },
  },

  // 5. secret_admirer (private)
  {
    kind: "private",
    username: "secret_admirer",
    pfp_url: "https://picsum.photos/id/500/200",
  },

  // 6. sunny
  {
    kind: "public",
    username: "sunny",
    pfp_url: "https://picsum.photos/id/600/200",
    followees: [
      { kind: "short", username: "club", pfp_url: "https://picsum.photos/id/140/100" },
      { kind: "short", username: "beat", pfp_url: "https://picsum.photos/id/150/100" },
    ],
    followers: [{ kind: "short", username: "party", pfp_url: "https://picsum.photos/id/160/100" }],
    posts: {
      description: "Drop the bass! 🔊 Tomorrow night at Club Nova",
      media: [
        { kind: "video", url: "https://example.com/set1.mp4" },
        { kind: "video", url: "https://example.com/set2.mp4" },
      ],
    },
  },

  // 7. cryptic (private)
  {
    kind: "private",
    username: "cryptic",
    pfp_url: "https://picsum.photos/id/700/200",
  },

  // 8. luna
  {
    kind: "public",
    username: "luna",
    pfp_url: "https://picsum.photos/id/800/200",
    followees: [{ kind: "short", username: "zen", pfp_url: "https://picsum.photos/id/170/100" }],
    followers: [
      { kind: "short", username: "ray", pfp_url: "https://picsum.photos/id/180/100" },
      { kind: "short", username: "amy", pfp_url: "https://picsum.photos/id/190/100" },
      { kind: "short", username: "calm", pfp_url: "https://picsum.photos/id/210/100" },
      { kind: "short", username: "salute", pfp_url: "https://picsum.photos/id/220/100" },
    ],
    posts: {
      description: "Morning flow by the ocean 🌊🧘‍♀️",
      media: [
        { kind: "photo", url: "https://picsum.photos/id/801/600" },
        { kind: "video", url: "https://example.com/yoga1.mp4" },
      ],
    },
  },

  // 9. leo
  {
    kind: "public",
    username: "leo",
    pfp_url: "https://picsum.photos/id/900/200",
    followees: [],
    followers: [
      { kind: "short", username: "collector", pfp_url: "https://picsum.photos/id/230/100" },
      { kind: "short", username: "gallery", pfp_url: "https://picsum.photos/id/240/100" },
    ],
    posts: {
      description: "New mural in the downtown district 🎨🖌️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/901/600" }],
    },
  },

  // 10. ghost (private)
  {
    kind: "private",
    username: "ghost",
    pfp_url: "https://picsum.photos/id/1000/200",
  },

  // ========= ДОПОЛНЕННЫЕ ПОЛЬЗОВАТЕЛИ =========

  // 11. mike (подписан на alex, сам ни на кого)
  {
    kind: "public",
    username: "mike",
    pfp_url: "https://picsum.photos/id/1/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
    posts: {
      description: "📸",
      media: [{ kind: "photo", url: "https://picsum.photos/id/11/600" }],
    },
  },

  // 12. nature
  {
    kind: "public",
    username: "nature",
    pfp_url: "https://picsum.photos/id/10/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
    posts: {
      description: "🌿",
      media: [{ kind: "photo", url: "https://picsum.photos/id/12/600" }],
    },
  },

  // 13. city
  {
    kind: "public",
    username: "city",
    pfp_url: "https://picsum.photos/id/20/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
    posts: {
      description: "🏙️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/13/600" }],
    },
  },

  // 14. buddy (подписан на alex)
  {
    kind: "public",
    username: "buddy",
    pfp_url: "https://picsum.photos/id/30/100",
    followees: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
    followers: [],
    posts: {
      description: "🤙",
      media: [{ kind: "photo", url: "https://picsum.photos/id/14/600" }],
    },
  },

  // 15. wander
  {
    kind: "public",
    username: "wander",
    pfp_url: "https://picsum.photos/id/40/100",
    followees: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
    followers: [],
    posts: {
      description: "🗺️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/15/600" }],
    },
  },

  // 16. critic (подписчик mia)
  {
    kind: "public",
    username: "critic",
    pfp_url: "https://picsum.photos/id/50/100",
    followees: [],
    followers: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
    posts: {
      description: "🍽️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/16/600" }],
    },
  },

  // 17. joe
  {
    kind: "public",
    username: "joe",
    pfp_url: "https://picsum.photos/id/60/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
    followers: [],
    posts: {
      description: "😋",
      media: [{ kind: "photo", url: "https://picsum.photos/id/17/600" }],
    },
  },

  // 18. ella
  {
    kind: "public",
    username: "ella",
    pfp_url: "https://picsum.photos/id/70/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
    followers: [],
    posts: {
      description: "🧁",
      media: [{ kind: "photo", url: "https://picsum.photos/id/18/600" }],
    },
  },

  // 19. sweet
  {
    kind: "public",
    username: "sweet",
    pfp_url: "https://picsum.photos/id/80/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
    followers: [],
    posts: {
      description: "🍰",
      media: [{ kind: "photo", url: "https://picsum.photos/id/19/600" }],
    },
  },

  // 20. john (на него подписана emma)
  {
    kind: "public",
    username: "john",
    pfp_url: "https://picsum.photos/id/90/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/300/200" }],
    posts: {
      description: "📖",
      media: [{ kind: "photo", url: "https://picsum.photos/id/20/600" }],
    },
  },

  // 21. library
  {
    kind: "public",
    username: "library",
    pfp_url: "https://picsum.photos/id/100/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/300/200" }],
    posts: {
      description: "📚",
      media: [{ kind: "photo", url: "https://picsum.photos/id/21/600" }],
    },
  },

  // 22. poet
  {
    kind: "public",
    username: "poet",
    pfp_url: "https://picsum.photos/id/110/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/300/200" }],
    posts: {
      description: "🖋️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/22/600" }],
    },
  },

  // 23. lucy (на неё подписан max)
  {
    kind: "public",
    username: "lucy",
    pfp_url: "https://picsum.photos/id/120/100",
    followees: [],
    followers: [{ kind: "short", username: "max", pfp_url: "https://picsum.photos/id/400/200" }],
    posts: {
      description: "🎮",
      media: [{ kind: "photo", url: "https://picsum.photos/id/23/600" }],
    },
  },

  // 24. pro_gamer (подписан на max)
  {
    kind: "public",
    username: "pro_gamer",
    pfp_url: "https://picsum.photos/id/130/100",
    followees: [{ kind: "short", username: "max", pfp_url: "https://picsum.photos/id/400/200" }],
    followers: [],
    posts: {
      description: "🏆",
      media: [{ kind: "photo", url: "https://picsum.photos/id/24/600" }],
    },
  },

  // 25. club (на него подписан sunny)
  {
    kind: "public",
    username: "club",
    pfp_url: "https://picsum.photos/id/140/100",
    followees: [],
    followers: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/600/200" }],
    posts: {
      description: "🪩",
      media: [{ kind: "photo", url: "https://picsum.photos/id/25/600" }],
    },
  },

  // 26. beat
  {
    kind: "public",
    username: "beat",
    pfp_url: "https://picsum.photos/id/150/100",
    followees: [],
    followers: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/600/200" }],
    posts: {
      description: "🎧",
      media: [{ kind: "photo", url: "https://picsum.photos/id/26/600" }],
    },
  },

  // 27. party (подписан на sunny)
  {
    kind: "public",
    username: "party",
    pfp_url: "https://picsum.photos/id/160/100",
    followees: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/600/200" }],
    followers: [],
    posts: {
      description: "🎉",
      media: [{ kind: "photo", url: "https://picsum.photos/id/27/600" }],
    },
  },

  // 28. zen (на него подписана luna)
  {
    kind: "public",
    username: "zen",
    pfp_url: "https://picsum.photos/id/170/100",
    followees: [],
    followers: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    posts: {
      description: "🧘",
      media: [{ kind: "photo", url: "https://picsum.photos/id/28/600" }],
    },
  },

  // 29. ray (подписан на luna)
  {
    kind: "public",
    username: "ray",
    pfp_url: "https://picsum.photos/id/180/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
    posts: {
      description: "☀️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/29/600" }],
    },
  },

  // 30. amy
  {
    kind: "public",
    username: "amy",
    pfp_url: "https://picsum.photos/id/190/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
    posts: {
      description: "🌸",
      media: [{ kind: "photo", url: "https://picsum.photos/id/30/600" }],
    },
  },

  // 31. calm
  {
    kind: "public",
    username: "calm",
    pfp_url: "https://picsum.photos/id/210/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
    posts: {
      description: "🌊",
      media: [{ kind: "photo", url: "https://picsum.photos/id/31/600" }],
    },
  },

  // 32. salute
  {
    kind: "public",
    username: "salute",
    pfp_url: "https://picsum.photos/id/220/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
    posts: {
      description: "🌅",
      media: [{ kind: "photo", url: "https://picsum.photos/id/32/600" }],
    },
  },

  // 33. collector (подписан на leo)
  {
    kind: "public",
    username: "collector",
    pfp_url: "https://picsum.photos/id/230/100",
    followees: [{ kind: "short", username: "leo", pfp_url: "https://picsum.photos/id/900/200" }],
    followers: [],
    posts: {
      description: "🖼️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/33/600" }],
    },
  },

  // 34. gallery
  {
    kind: "public",
    username: "gallery",
    pfp_url: "https://picsum.photos/id/240/100",
    followees: [{ kind: "short", username: "leo", pfp_url: "https://picsum.photos/id/900/200" }],
    followers: [],
    posts: {
      description: "🏛️",
      media: [{ kind: "photo", url: "https://picsum.photos/id/34/600" }],
    },
  },
];
