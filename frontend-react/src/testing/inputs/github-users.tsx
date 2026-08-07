import type { GitHubUserVerbose } from "@/transport/dtos/github";

export const WebHoundTesting___GitHubUsers: GitHubUserVerbose[] = [
  // 1. alex
  {
    kind: "verbose",
    username: "alex",
    pfp_url: "https://picsum.photos/id/1011/200",
    followees: [
      { kind: "short", username: "mike", pfp_url: "https://picsum.photos/id/1/100" },
      { kind: "short", username: "open_source", pfp_url: "https://picsum.photos/id/10/100" },
      { kind: "short", username: "react_ninja", pfp_url: "https://picsum.photos/id/20/100" },
    ],
    followers: [
      { kind: "short", username: "buddy", pfp_url: "https://picsum.photos/id/30/100" },
      { kind: "short", username: "js_lover", pfp_url: "https://picsum.photos/id/40/100" },
    ],
  },

  // 2. mia
  {
    kind: "verbose",
    username: "mia",
    pfp_url: "https://picsum.photos/id/2002/200",
    followees: [
      { kind: "short", username: "rustacean", pfp_url: "https://picsum.photos/id/50/100" },
    ],
    followers: [
      { kind: "short", username: "junior", pfp_url: "https://picsum.photos/id/60/100" },
      { kind: "short", username: "ella", pfp_url: "https://picsum.photos/id/70/100" },
      { kind: "short", username: "wizard", pfp_url: "https://picsum.photos/id/80/100" },
    ],
  },

  // 3. emma
  {
    kind: "verbose",
    username: "emma",
    pfp_url: "https://picsum.photos/id/3003/200",
    followees: [
      { kind: "short", username: "john", pfp_url: "https://picsum.photos/id/90/100" },
      { kind: "short", username: "library", pfp_url: "https://picsum.photos/id/100/100" },
      { kind: "short", username: "poet", pfp_url: "https://picsum.photos/id/110/100" },
    ],
    followers: [],
  },

  // 4. max
  {
    kind: "verbose",
    username: "max",
    pfp_url: "https://picsum.photos/id/4004/200",
    followees: [{ kind: "short", username: "lucy", pfp_url: "https://picsum.photos/id/120/100" }],
    followers: [
      { kind: "short", username: "pro_gamer", pfp_url: "https://picsum.photos/id/130/100" },
    ],
  },

  // 5. secret_committer
  {
    kind: "verbose",
    username: "secret_committer",
    pfp_url: "https://picsum.photos/id/5005/200",
    followees: [],
    followers: [],
  },

  // 6. sunny
  {
    kind: "verbose",
    username: "sunny",
    pfp_url: "https://picsum.photos/id/6006/200",
    followees: [
      { kind: "short", username: "club", pfp_url: "https://picsum.photos/id/140/100" },
      { kind: "short", username: "beat", pfp_url: "https://picsum.photos/id/150/100" },
    ],
    followers: [{ kind: "short", username: "party", pfp_url: "https://picsum.photos/id/160/100" }],
  },

  // 7. cryptic
  {
    kind: "verbose",
    username: "cryptic",
    pfp_url: "https://picsum.photos/id/7007/200",
    followees: [],
    followers: [],
  },

  // 8. luna
  {
    kind: "verbose",
    username: "luna",
    pfp_url: "https://picsum.photos/id/8008/200",
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
    kind: "verbose",
    username: "leo",
    pfp_url: "https://picsum.photos/id/9009/200",
    followees: [],
    followers: [
      { kind: "short", username: "collector", pfp_url: "https://picsum.photos/id/230/100" },
      { kind: "short", username: "gallery", pfp_url: "https://picsum.photos/id/240/100" },
    ],
  },

  // 10. ghost
  {
    kind: "verbose",
    username: "ghost",
    pfp_url: "https://picsum.photos/id/1010/200",
    followees: [],
    followers: [],
  },

  // ========= ДОПОЛНЕННЫЕ ПОЛЬЗОВАТЕЛИ =========

  // 11. mike (на него подписан alex)
  {
    kind: "verbose",
    username: "mike",
    pfp_url: "https://picsum.photos/id/1/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/1011/200" }],
  },

  // 12. open_source
  {
    kind: "verbose",
    username: "open_source",
    pfp_url: "https://picsum.photos/id/10/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/1011/200" }],
  },

  // 13. react_ninja
  {
    kind: "verbose",
    username: "react_ninja",
    pfp_url: "https://picsum.photos/id/20/100",
    followees: [],
    followers: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/1011/200" }],
  },

  // 14. buddy (подписан на alex)
  {
    kind: "verbose",
    username: "buddy",
    pfp_url: "https://picsum.photos/id/30/100",
    followees: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/1011/200" }],
    followers: [],
  },

  // 15. js_lover
  {
    kind: "verbose",
    username: "js_lover",
    pfp_url: "https://picsum.photos/id/40/100",
    followees: [{ kind: "short", username: "alex", pfp_url: "https://picsum.photos/id/1011/200" }],
    followers: [],
  },

  // 16. rustacean (на него подписана mia)
  {
    kind: "verbose",
    username: "rustacean",
    pfp_url: "https://picsum.photos/id/50/100",
    followees: [],
    followers: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/2002/200" }],
  },

  // 17. junior (подписан на mia)
  {
    kind: "verbose",
    username: "junior",
    pfp_url: "https://picsum.photos/id/60/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/2002/200" }],
    followers: [],
  },

  // 18. ella
  {
    kind: "verbose",
    username: "ella",
    pfp_url: "https://picsum.photos/id/70/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/2002/200" }],
    followers: [],
  },

  // 19. wizard
  {
    kind: "verbose",
    username: "wizard",
    pfp_url: "https://picsum.photos/id/80/100",
    followees: [{ kind: "short", username: "mia", pfp_url: "https://picsum.photos/id/2002/200" }],
    followers: [],
  },

  // 20. john (на него подписана emma)
  {
    kind: "verbose",
    username: "john",
    pfp_url: "https://picsum.photos/id/90/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/3003/200" }],
  },

  // 21. library
  {
    kind: "verbose",
    username: "library",
    pfp_url: "https://picsum.photos/id/100/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/3003/200" }],
  },

  // 22. poet
  {
    kind: "verbose",
    username: "poet",
    pfp_url: "https://picsum.photos/id/110/100",
    followees: [],
    followers: [{ kind: "short", username: "emma", pfp_url: "https://picsum.photos/id/3003/200" }],
  },

  // 23. lucy (на неё подписан max)
  {
    kind: "verbose",
    username: "lucy",
    pfp_url: "https://picsum.photos/id/120/100",
    followees: [],
    followers: [{ kind: "short", username: "max", pfp_url: "https://picsum.photos/id/4004/200" }],
  },

  // 24. pro_gamer (подписан на max)
  {
    kind: "verbose",
    username: "pro_gamer",
    pfp_url: "https://picsum.photos/id/130/100",
    followees: [{ kind: "short", username: "max", pfp_url: "https://picsum.photos/id/4004/200" }],
    followers: [],
  },

  // 25. club (на него подписан sunny)
  {
    kind: "verbose",
    username: "club",
    pfp_url: "https://picsum.photos/id/140/100",
    followees: [],
    followers: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/6006/200" }],
  },

  // 26. beat
  {
    kind: "verbose",
    username: "beat",
    pfp_url: "https://picsum.photos/id/150/100",
    followees: [],
    followers: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/6006/200" }],
  },

  // 27. party (подписан на sunny)
  {
    kind: "verbose",
    username: "party",
    pfp_url: "https://picsum.photos/id/160/100",
    followees: [{ kind: "short", username: "sunny", pfp_url: "https://picsum.photos/id/6006/200" }],
    followers: [],
  },

  // 28. zen (на него подписана luna)
  {
    kind: "verbose",
    username: "zen",
    pfp_url: "https://picsum.photos/id/170/100",
    followees: [],
    followers: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/8008/200" }],
  },

  // 29. ray (подписан на luna)
  {
    kind: "verbose",
    username: "ray",
    pfp_url: "https://picsum.photos/id/180/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/8008/200" }],
    followers: [],
  },

  // 30. amy
  {
    kind: "verbose",
    username: "amy",
    pfp_url: "https://picsum.photos/id/190/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/8008/200" }],
    followers: [],
  },

  // 31. calm
  {
    kind: "verbose",
    username: "calm",
    pfp_url: "https://picsum.photos/id/210/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/8008/200" }],
    followers: [],
  },

  // 32. salute
  {
    kind: "verbose",
    username: "salute",
    pfp_url: "https://picsum.photos/id/220/100",
    followees: [{ kind: "short", username: "luna", pfp_url: "https://picsum.photos/id/8008/200" }],
    followers: [],
  },

  // 33. collector (подписан на leo)
  {
    kind: "verbose",
    username: "collector",
    pfp_url: "https://picsum.photos/id/230/100",
    followees: [{ kind: "short", username: "leo", pfp_url: "https://picsum.photos/id/9009/200" }],
    followers: [],
  },

  // 34. gallery
  {
    kind: "verbose",
    username: "gallery",
    pfp_url: "https://picsum.photos/id/240/100",
    followees: [{ kind: "short", username: "leo", pfp_url: "https://picsum.photos/id/9009/200" }],
    followers: [],
  },
];
