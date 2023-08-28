/// <reference types="cypress" />

describe('Login - Teste de API Serverest', () => {
    it('Login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login',
            body: {
                email: "marcelo@teste.com.br",
                password: "editado_teste"
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.message).to.eq("Login realizado com sucesso")
            cy.log(response.body.authorization)
        })
    })
})