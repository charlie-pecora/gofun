package main

import (
	"fmt"
	"html/template"
	"log"
	"log/slog"
	"net/http"
	"os"
	"sync"
	"github.com/google/uuid"
)

const gridHeight = 50
const gridWidth = 100

var logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))

var state applicationState

func main() {
	// create secret for user secret assignment

	state = applicationState{
		users: make(map[string]gameLoadData),
	}

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("GET /static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("GET /", indexHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = ":8080"
	} else {
		port = ":" + port
	}
	logger.Info("Server is listening", "port", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

var indexTemplate = template.Must(template.New("index.html").ParseFiles("./templates/index.html"))

func indexHandler(w http.ResponseWriter, r *http.Request) {
	newUserData, err := createGameLoadData()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	logger.Info("Received a page load, generating new token", "id", newUserData.UserId)
	err = indexTemplate.Execute(w, newUserData)
	if err != nil {
		log.Printf("%+v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

type gameLoadData struct {
	UserId string
	Grid  gameDimensions
}

type gameDimensions struct {
	Height int
	Width int
}

func createGameLoadData() (gameLoadData, error) {
	u := gameLoadData{
		UserId: uuid.NewString(),
		Grid: gameDimensions{
			Height: gridHeight,
			Width: gridWidth,
		},
	}
	state.addUser(u)
	return u, nil
}

type applicationState struct {
	mu sync.RWMutex
	users map[string]gameLoadData
}

func (a *applicationState) addUser(u gameLoadData) {
	a.mu.Lock()
	defer a.mu.Unlock()
	state.users[u.UserId] = u
	logger.Info(fmt.Sprint(a))
}

