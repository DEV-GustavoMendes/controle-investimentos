package main

import (
	"investimentos/handlers"
	"investimentos/handlers/db"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {

	if err := db.InitDB(); err != nil {
		log.Fatalf("Falha ao inicializar o banco: %v", err)
	}

	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	r.SetTrustedProxies([]string{"127.0.0.1"})


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


	api := r.Group("/api")
	{
		api.GET("/investimentos", handlers.ListarInvestimentos)
		api.GET("/investimentos/buscar", handlers.BuscarInvestimentos)
		api.GET("/investimentos/:id", handlers.BuscarInvestimentoPorID)
		api.POST("/investimentos", handlers.CriarInvestimento)
		api.PUT("/investimentos/:id", handlers.AtualizarInvestimento)
		api.DELETE("/investimentos/:id", handlers.DeletarInvestimento)
	}

	
	r.Static("/static", "./static")

	log.Println("Servidor rodando na porta 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Falha ao iniciar servidor: %v", err)
	}
}
