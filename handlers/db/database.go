package db

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() error {
	var err error
	DB, err = sql.Open("sqlite3", "./investimentos.db")
	if err != nil {
		return err
	}

	// Cria a tabela se não existir
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS investimentos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		nome TEXT NOT NULL,
		tipo TEXT NOT NULL,
		valor REAL NOT NULL,
		data_inicio TEXT NOT NULL,
		data_vencimento TEXT NOT NULL
	);`

	if _, err = DB.Exec(createTableSQL); err != nil {
		return err
	}

	return nil
}
