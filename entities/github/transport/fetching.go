package webhound_github_transport

import (
	"context"
	"fmt"
	"sync"

	webhound_fetching "go.mod/services/fetching"
)

// Fetched GitHub profiles live in process memory instead of the database: the
// map is filled on first request per username and serves every later request.
var (
	githubUsersMu sync.RWMutex
	githubUsers   = map[string]*User{}
)

func GetUserDtoOrFetch(ctx context.Context, fetching *webhound_fetching.Client, username string) (*User, error) {
	githubUsersMu.RLock()
	cached, ok := githubUsers[username]
	githubUsersMu.RUnlock()
	if ok {
		return cached, nil
	}

	fetched, err := fetching.GetGitHubUser(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch github user @%s from external service: %w", username, err)
	}

	user := GitHubUserToDto(fetched)

	githubUsersMu.Lock()
	githubUsers[username] = user
	githubUsersMu.Unlock()

	return user, nil
}

func GitHubUserToDto(fetched *webhound_fetching.GitHubUser) *User {
	user := &User{Username: fetched.Username, Verbose: true, PfpUrl: fetched.AvatarUrl}

	for _, followee := range fetched.Followees {
		user.Followees = append(user.Followees, User{Username: followee.Username, Verbose: false, PfpUrl: followee.AvatarUrl})
	}

	for _, follower := range fetched.Followers {
		user.Followers = append(user.Followers, User{Username: follower.Username, Verbose: false, PfpUrl: follower.AvatarUrl})
	}

	return user
}
