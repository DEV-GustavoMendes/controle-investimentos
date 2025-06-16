package repository

import (
	"database/sql"
	"investimentos/handlers/db"
	"investimentos/handlers/models"
	"log"
	"time"
)

func GetAll() ([]models.Investimento, error) {
	rows, err := db.DB.Query("SELECT id, nome, tipo, valor, data_inicio, data_vencimento FROM investimentos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var investimentos []models.Investimento
	for rows.Next() {
		var inv models.Investimento
		var dataInicioStr, dataVencimentoStr string

		err := rows.Scan(&inv.ID, &inv.Nome, &inv.Tipo, &inv.Valor, &dataInicioStr, &dataVencimentoStr)
		if err != nil {
			log.Printf("Erro ao scanear investimento: %v", err)
			continue
		}

		// Converter strings para time.Time
		inv.DataInicio, _ = time.Parse("2006-01-02", dataInicioStr)
		inv.DataVencimento, _ = time.Parse("2006-01-02", dataVencimentoStr)

		investimentos = append(investimentos, inv)
	}

	return investimentos, nil
}

func Search(term string) ([]models.Investimento, error) {
	query := `
		SELECT id, nome, tipo, valor, data_inicio, data_vencimento 
		FROM investimentos 
		WHERE nome LIKE ? OR tipo LIKE ? OR valor LIKE ?`

	rows, err := db.DB.Query(query, "%"+term+"%", "%"+term+"%", "%"+term+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var investimentos []models.Investimento
	for rows.Next() {
		var inv models.Investimento
		var dataInicioStr, dataVencimentoStr string

		err := rows.Scan(&inv.ID, &inv.Nome, &inv.Tipo, &inv.Valor, &dataInicioStr, &dataVencimentoStr)
		if err != nil {
			log.Printf("Erro ao scanear investimento: %v", err)
			continue
		}

		inv.DataInicio, _ = time.Parse("2006-01-02", dataInicioStr)
		inv.DataVencimento, _ = time.Parse("2006-01-02", dataVencimentoStr)

		investimentos = append(investimentos, inv)
	}

	return investimentos, nil
}


// CRUD
func Create(inv models.Investimento) (int64, error) {
	result, err := db.DB.Exec(
		"INSERT INTO investimentos (nome, tipo, valor, data_inicio, data_vencimento) VALUES (?, ?, ?, ?, ?)",
		inv.Nome, inv.Tipo, inv.Valor, inv.DataInicio.Format("2006-01-02"), inv.DataVencimento.Format("2006-01-02"))

	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func Update(id int, inv models.Investimento) error {
	_, err := db.DB.Exec(
		"UPDATE investimentos SET nome = ?, tipo = ?, valor = ?, data_inicio = ?, data_vencimento = ? WHERE id = ?",
		inv.Nome, inv.Tipo, inv.Valor, inv.DataInicio.Format("2006-01-02"), inv.DataVencimento.Format("2006-01-02"), id)

	return err
}

func Delete(id int) error {
	_, err := db.DB.Exec("DELETE FROM investimentos WHERE id = ?", id)
	return err
}

func GetByID(id int) (*models.Investimento, error) {
	var inv models.Investimento
	var dataInicioStr, dataVencimentoStr string

	err := db.DB.QueryRow(
		"SELECT id, nome, tipo, valor, data_inicio, data_vencimento FROM investimentos WHERE id = ?",
		id,
	).Scan(&inv.ID, &inv.Nome, &inv.Tipo, &inv.Valor, &dataInicioStr, &dataVencimentoStr)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	// Converte strings para time.Time
	inv.DataInicio, _ = time.Parse("2006-01-02", dataInicioStr)
	inv.DataVencimento, _ = time.Parse("2006-01-02", dataVencimentoStr)

	return &inv, nil
}
