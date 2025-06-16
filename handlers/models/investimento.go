package models

import "time"

type Investimento struct {
	ID             int       `json:"id"`
	Nome           string    `json:"nome"`
	Tipo           string    `json:"tipo"`
	Valor          float64   `json:"valor"`
	DataInicio     time.Time `json:"data_inicio"`
	DataVencimento time.Time `json:"data_vencimento"`
}

// Para requisições de criação/atualização
type InvestimentoRequest struct {
	Nome           string  `json:"nome" binding:"required"`
	Tipo           string  `json:"tipo" binding:"required"`
	Valor          float64 `json:"valor" binding:"required"`
	DataInicio     string  `json:"data_inicio" binding:"required"`
	DataVencimento string  `json:"data_vencimento" binding:"required"`
}
