package main

import (
	"investimentos/handlers"
	"investimentos/handlers/db"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializa o banco de dados
	if err := db.InitDB(); err != nil {
		log.Fatalf("Falha ao inicializar o banco: %v", err)
	}

	// Configura o modo de produção
	gin.SetMode(gin.ReleaseMode)

	// Configura o router Gin
	r := gin.Default()

	// Configura confiança de proxies
	r.SetTrustedProxies([]string{"127.0.0.1"})

	// Configura CORS para permitir seu frontend
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Rotas da API
	api := r.Group("/api")
	{
		api.GET("/investimentos", handlers.ListarInvestimentos)
		api.GET("/investimentos/buscar", handlers.BuscarInvestimentos)
		api.GET("/investimentos/:id", handlers.BuscarInvestimentoPorID)
		api.POST("/investimentos", handlers.CriarInvestimento)
		api.PUT("/investimentos/:id", handlers.AtualizarInvestimento)
		api.DELETE("/investimentos/:id", handlers.DeletarInvestimento)
	}

	// Servir arquivos estáticos (se necessário)
	r.Static("/static", "./static")

	log.Println("Servidor rodando na porta 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Falha ao iniciar servidor: %v", err)
	}
}
