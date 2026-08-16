package webhound_fetching

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	baseUrl    string
	httpClient *http.Client
}

func NewClient(baseUrl string) *Client {
	return &Client{
		baseUrl: baseUrl,
		httpClient: &http.Client{
			Timeout: 25 * time.Second,
		},
	}
}

type GitHubUser struct {
	Username  string        `json:"username"`
	UserUrl   string        `json:"user_url"`
	AvatarUrl string        `json:"avatar_url"`
	Followers []*GitHubUser `json:"followers"`
	Followees []*GitHubUser `json:"followees"`
}

func (c *Client) GetGitHubUser(ctx context.Context, username string) (*GitHubUser, error) {
	var user GitHubUser
	if err := c.getJSON(ctx, fmt.Sprintf("/api/fetching/github/users/%s", username), &user); err != nil {
		return nil, err
	}
	return &user, nil
}

type InstagramUser struct {
	Username  string           `json:"username"`
	Bio       string           `json:"bio"`
	AvatarUrl string           `json:"avatar_url"`
	Followers []*InstagramUser `json:"followers"`
	Followees []*InstagramUser `json:"followees"`
}

func (c *Client) GetInstagramUser(ctx context.Context, username string) (*InstagramUser, error) {
	var user InstagramUser
	if err := c.getJSON(ctx, fmt.Sprintf("/api/fetching/instagram/users/%s", username), &user); err != nil {
		return nil, err
	}
	return &user, nil
}

func (c *Client) getJSON(ctx context.Context, path string, dest any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseUrl+path, nil)
	if err != nil {
		return fmt.Errorf("failed to create fetching request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to reach fetching service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("fetching service returned status %d", resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(dest); err != nil {
		return fmt.Errorf("failed to decode fetching service response: %w", err)
	}

	return nil
}
