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
  },

  // 12. nature
  {
    kind: "public",
    username: "nature",
    pfp_url: "https://picsum.photos/id/10/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
  },

  // 13. city
  {
    kind: "public",
    username: "city",
    pfp_url: "https://picsum.photos/id/20/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
  },

  // 14. buddy (подписан на alex)
  {
    kind: "public",
    username: "buddy",
    pfp_url: "https://picsum.photos/id/30/100",
    followees: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
    followers: [],
  },

  // 15. wander
  {
    kind: "public",
    username: "wander",
    pfp_url: "https://picsum.photos/id/40/100",
    followees: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/101/200" }],
    followers: [],
  },

  // 16. critic (подписчик mia)
  {
    kind: "public",
    username: "critic",
    pfp_url: "https://picsum.photos/id/50/100",
    followees: [],
    followers: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
  },

  // 17. joe
  {
    kind: "public",
    username: "joe",
    pfp_url: "https://picsum.photos/id/60/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
    followers: [],
  },

  // 18. ella
  {
    kind: "public",
    username: "ella",
    pfp_url: "https://picsum.photos/id/70/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
    followers: [],
  },

  // 19. sweet
  {
    kind: "public",
    username: "sweet",
    pfp_url: "https://picsum.photos/id/80/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/200/200" }],
    followers: [],
  },

  // 20. john (на него подписана emma)
  {
    kind: "public",
    username: "john",
    pfp_url: "https://picsum.photos/id/90/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/300/200" }],
  },

  // 21. library
  {
    kind: "public",
    username: "library",
    pfp_url: "https://picsum.photos/id/100/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/300/200" }],
  },

  // 22. poet
  {
    kind: "public",
    username: "poet",
    pfp_url: "https://picsum.photos/id/110/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/300/200" }],
  },

  // 23. lucy (на неё подписан max)
  {
    kind: "public",
    username: "lucy",
    pfp_url: "https://picsum.photos/id/120/100",
    followees: [],
    followers: [{ kind: "short", username: "max", pfp_url: "https://picsum.photos/id/400/200" }],
  },

  // 24. pro_gamer (подписан на max)
  {
    kind: "public",
    username: "pro_gamer",
    pfp_url: "https://picsum.photos/id/130/100",
    followees: [{ kind: "short", username: "max", pfp_url: "https://picsum.photos/id/400/200" }],
    followers: [],
  },

  // 25. club (на него подписан sunny)
  {
    kind: "public",
    username: "club",
    pfp_url: "https://picsum.photos/id/140/100",
    followees: [],
    followers: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/600/200" }],
  },

  // 26. beat
  {
    kind: "public",
    username: "beat",
    pfp_url: "https://picsum.photos/id/150/100",
    followees: [],
    followers: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/600/200" }],
  },

  // 27. party (подписан на sunny)
  {
    kind: "public",
    username: "party",
    pfp_url: "https://picsum.photos/id/160/100",
    followees: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/600/200" }],
    followers: [],
  },

  // 28. zen (на него подписана luna)
  {
    kind: "public",
    username: "zen",
    pfp_url: "https://picsum.photos/id/170/100",
    followees: [],
    followers: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
  },

  // 29. ray (подписан на luna)
  {
    kind: "public",
    username: "ray",
    pfp_url: "https://picsum.photos/id/180/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
  },

  // 30. amy
  {
    kind: "public",
    username: "amy",
    pfp_url: "https://picsum.photos/id/190/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
  },

  // 31. calm
  {
    kind: "public",
    username: "calm",
    pfp_url: "https://picsum.photos/id/210/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
  },

  // 32. salute
  {
    kind: "public",
    username: "salute",
    pfp_url: "https://picsum.photos/id/220/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/800/200" }],
    followers: [],
  },

  // 33. collector (подписан на leo)
  {
    kind: "public",
    username: "collector",
    pfp_url: "https://picsum.photos/id/230/100",
    followees: [{ kind: "short", username: "leo", pfp_url: "https://picsum.photos/id/900/200" }],
    followers: [],
  },

  // 34. gallery
  {
    kind: "public",
    username: "gallery",
    pfp_url: "https://picsum.photos/id/240/100",
    followees: [{ kind: "short", username: "leo", pfp_url: "https://picsum.photos/id/900/200" }],
    followers: [],
  },
];
