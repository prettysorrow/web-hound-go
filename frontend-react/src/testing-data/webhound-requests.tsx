import type { WebHoundRequest } from "@/transport/dtos/webhound";

export const WebHoundTesting___WebHoundRequests: WebHoundRequest[] = [
  {
    created_by: {
      used_service: "github",
      service_id: "prettysorrow",
      display_name: "Artem",
    },
    created_on: "alice",
    created_at: "2011-11-11 23:00:00.123456789 +0000 UTC m=+0.123456789",
    results: [
      {
        service: "github",
        result: {
          kind: "verbose",
          username: "alice",
          pfp_url: "https://picsum.photos/500/500",
          followers: [
            { kind: "short", username: "bob", pfp_url: "https://picsum.photos/500/500" },
            { kind: "short", username: "charlie", pfp_url: "https://picsum.photos/500/500" },
            { kind: "short", username: "dart", pfp_url: "https://picsum.photos/500/500" },
          ],
          followees: [
            { kind: "short", username: "charlie", pfp_url: "https://picsum.photos/500/500" },
          ],
        },
      },
    ],
  },
  {
    created_by: {
      used_service: "telegram",
      service_id: "letmedieinsorrow",
      display_name: "Alexandra Yoshimura",
    },
    created_on: "prettysorrow",
    created_at: "2011-11-11 23:00:00.123456789 +0000 UTC m=+0.123456789",
    results: [],
  },
];
