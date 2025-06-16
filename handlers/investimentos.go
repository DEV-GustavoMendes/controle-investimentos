package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"investimentos/handlers/models"
	"investimentos/handlers/repository"

	"github.com/gin-gonic/gin"
)

func ListarInvestimentos(c *gin.Context) {
	investimentos, err := repository.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, investimentos)
}

func BuscarInvestimentos(c *gin.Context) {
	termo := c.Query("termo")
	if termo == "" {
		ListarInvestimentos(c)
		return
	}

	investimentos, err := repository.Search(termo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, investimentos)
}

func validarInvestimento(req models.InvestimentoRequest) error {
	// Validar valor maior que zero
	if req.Valor <= 0 {
		return fmt.Errorf("o valor do investimento deve ser maior que zero")
	}

	// Converter datas string para time.Time
	dataInicio, err := time.Parse("2006-01-02", req.DataInicio)
	if err != nil {
		return fmt.Errorf("data de início inválida")
	}

	dataVencimento, err := time.Parse("2006-01-02", req.DataVencimento)
	if err != nil {
		return fmt.Errorf("data de vencimento inválida")
	}

	// Validar se a data de início não está no futuro
	if dataInicio.After(time.Now()) {
		return fmt.Errorf("a data de início não pode estar no futuro")
	}

	// Validar se a data de vencimento é posterior à data de início
	if dataVencimento.Before(dataInicio) {
		return fmt.Errorf("a data de vencimento deve ser posterior à data de início")
	}

	return nil
}

func CriarInvestimento(c *gin.Context) {
	var req models.InvestimentoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validar investimento
	if err := validarInvestimento(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Converter datas string para time.Time
	dataInicio, _ := time.Parse("2006-01-02", req.DataInicio)
	dataVencimento, _ := time.Parse("2006-01-02", req.DataVencimento)

	investimento := models.Investimento{
		Nome:           req.Nome,
		Tipo:           req.Tipo,
		Valor:          req.Valor,
		DataInicio:     dataInicio,
		DataVencimento: dataVencimento,
	}

	id, err := repository.Create(investimento)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func AtualizarInvestimento(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req models.InvestimentoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validar investimento
	if err := validarInvestimento(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Conversões de datas
	dataInicio, _ := time.Parse("2006-01-02", req.DataInicio)
	dataVencimento, _ := time.Parse("2006-01-02", req.DataVencimento)

	investimento := models.Investimento{
		Nome:           req.Nome,
		Tipo:           req.Tipo,
		Valor:          req.Valor,
		DataInicio:     dataInicio,
		DataVencimento: dataVencimento,
	}

	if err := repository.Update(id, investimento); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func DeletarInvestimento(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := repository.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func BuscarInvestimentoPorID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	investimento, err := repository.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if investimento == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Investimento não encontrado"})
		return
	}

	c.JSON(http.StatusOK, investimento)
}
