package webhound_config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

func Init() error {
	path := os.Getenv("WEBHOUND_ENV_FILE")
	if path == "" {
		path = ".env"
	}

	viper.SetConfigFile(path)
	viper.SetConfigType("dotenv")
	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("failed to read env config from %s: %w", path, err)
	}

	viper.AutomaticEnv()
	return nil
}

func GetString(key string) string {
	return viper.GetString(key)
}
