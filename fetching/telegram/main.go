package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/gotd/contrib/auth/terminal"
	"github.com/gotd/td/session"
	"github.com/gotd/td/telegram"
	"github.com/gotd/td/telegram/auth"
	"github.com/gotd/td/tg"
)

var (
	apiID   int
	apiHash string
)

func mustGetEnv() {
	id, err := strconv.Atoi(os.Getenv("TELEGRAM_API_ID"))
	if err != nil {
		panic("invalid TELEGRAM_API_ID")
	}

	apiID = id

	apiHash = os.Getenv("TELEGRAM_API_HASH")
	if apiHash == "" {
		panic("TELEGRAM_API_HASH is empty")
	}
}

// lookupUser выполняет авторизацию (если требуется),
// ищет пользователя по username и получает его полный профиль.
func lookupUser(ctx context.Context, client *telegram.Client, username string) error {
	// Если session.json уже существует, авторизация будет пропущена.
	// Иначе terminal.OS() спросит телефон, код подтверждения и пароль 2FA.
	if err := client.Auth().IfNecessary(
		ctx,
		auth.NewFlow(
			terminal.OS(),
			auth.SendCodeOptions{},
		),
	); err != nil {
		return err
	}

	api := client.API()

	// Аналог метода contacts.resolveUsername.
	resolved, err := api.ContactsResolveUsername(
		ctx,
		&tg.ContactsResolveUsernameRequest{
			Username: username,
		},
	)
	if err != nil {
		return err
	}

	// Ищем обычного пользователя среди найденных объектов.
	var user *tg.User
	for _, u := range resolved.Users {
		if v, ok := u.(*tg.User); ok {
			user = v
			break
		}
	}

	if user == nil {
		return fmt.Errorf("user not found")
	}

	fmt.Println("ID:", user.ID)
	fmt.Println("Username:", user.Username)
	fmt.Println("Name:", user.FirstName, user.LastName)

	// Получаем расширенную информацию о пользователе
	// (bio, количество общих чатов, фото и т.д.).
	full, err := api.UsersGetFullUser(
		ctx,
		&tg.InputUser{
			UserID:     user.ID,
			AccessHash: user.AccessHash,
		},
	)
	if err != nil {
		return err
	}

	fmt.Println("Bio:", full.FullUser.About)
	fmt.Println("Common chats:", full.FullUser.CommonChatsCount)

	if photo, ok := full.FullUser.ProfilePhoto.(*tg.Photo); ok {
		fmt.Println("Photo ID:", photo.ID)
	}

	return nil
}

func main() {
	mustGetEnv()

	// Читаем username из stdin.
	fmt.Print("Enter username: ")

	reader := bufio.NewReader(os.Stdin)

	username, err := reader.ReadString('\n')
	if err != nil {
		log.Fatal(err)
	}

	username = strings.TrimSpace(username)

	ctx := context.Background()

	// Создаем Telegram-клиент.
	// SessionStorage автоматически сохранит авторизационную сессию
	// в session.json после первого успешного входа.
	client := telegram.NewClient(
		apiID,
		apiHash,
		telegram.Options{
			SessionStorage: &session.FileStorage{
				Path: "session.json",
			},
		},
	)

	err = client.Run(ctx, func(ctx context.Context) error {
		return lookupUser(ctx, client, username)
	})
	if err != nil {
		log.Fatal(err)
	}
}
