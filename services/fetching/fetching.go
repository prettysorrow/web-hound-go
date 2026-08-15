package webhound_fetching

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

type Client struct {
	baseUrl    string
	httpClient *http.Client
}

func NewClient(baseUrl string) *Client {
	return NewClientWithTimeout(baseUrl, 90*time.Second)
}

func NewClientWithTimeout(baseUrl string, timeout time.Duration) *Client {
	return &Client{
		baseUrl: baseUrl,
		httpClient: &http.Client{
			Timeout: timeout,
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

type InstagramMedia struct {
	Type string `json:"type"`
	Url  string `json:"url"`
}

type InstagramUser struct {
	Username  string            `json:"username"`
	AvatarUrl string            `json:"avatar_url"`
	Medias    []*InstagramMedia `json:"medias"`
}

type InstagramUserInfo struct {
	AvatarUrl   string `json:"avatar_url"`
	IsPrivate   bool   `json:"is_private"`
	FollowLimit int    `json:"follow_limit"`
	UserId      string `json:"user_id"`
}

func (c *Client) GetInstagramUserInfo(ctx context.Context, username string) (*InstagramUserInfo, error) {
	var info InstagramUserInfo
	if err := c.getJSON(ctx, fmt.Sprintf("/api/fetching/instagram/users/%s/info", url.PathEscape(username)), &info); err != nil {
		return nil, err
	}
	return &info, nil
}

type InstagramUserChunk struct {
	Users     []*InstagramUser `json:"users"`
	NextMaxId string           `json:"next_max_id"`
	Done      bool             `json:"done"`
}

func (c *Client) GetInstagramUserChunk(ctx context.Context, list, username, userId, maxId string) (*InstagramUserChunk, error) {
	path := fmt.Sprintf(
		"/api/fetching/instagram/users/%s/chunk?list=%s&user_id=%s&max_id=%s",
		url.PathEscape(username),
		url.QueryEscape(list),
		url.QueryEscape(userId),
		url.QueryEscape(maxId),
	)
	var chunk InstagramUserChunk
	if err := c.getJSON(ctx, path, &chunk); err != nil {
		return nil, err
	}
	return &chunk, nil
}

func (c *Client) GetInstagramUserMedia(ctx context.Context, username string) (*InstagramUser, error) {
	var user InstagramUser
	if err := c.getJSON(ctx, fmt.Sprintf("/api/fetching/instagram/users/%s/media", url.PathEscape(username)), &user); err != nil {
		return nil, err
	}
	return &user, nil
}

type Error struct {
	StatusCode int
	Message    string
}

func (e *Error) Error() string {
	return e.Message
}

// StatusCodeForError maps an error from the fetching client to an HTTP status
// code for the caller: 404 when the upstream says "not found", 502 Bad Gateway
// for any other fetching failure.
func StatusCodeForError(err error) int {
	var fetchingErr *Error
	if errors.As(err, &fetchingErr) && fetchingErr.StatusCode == http.StatusNotFound {
		return http.StatusNotFound
	}
	return http.StatusBadGateway
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
		return &Error{
			StatusCode: resp.StatusCode,
			Message:    fmt.Sprintf("fetching service returned status %d", resp.StatusCode),
		}
	}

	if err := json.NewDecoder(resp.Body).Decode(dest); err != nil {
		return fmt.Errorf("failed to decode fetching service response: %w", err)
	}

	return nil
}
