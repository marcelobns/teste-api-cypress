// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('token', (email, password) => { 
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            email: email,
            password: password
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        return response.body.authorization
    })
})

Cypress.Commands.add('cadastrarProduto', (token, nome, preco, descricao, quantidade) => {
    cy.request({
        method: 'POST',
        url: 'produtos',
        body: {
            nome: nome,
            preco: preco,
            descricao: descricao,
            quantidade: quantidade
        },
        headers: {
            authorization: token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('cadastrarUsuario', (token, nome, email, password, administrador) => {
    cy.request({
        method: 'POST',
        url: 'usuarios',
        body: {
            nome: nome,
            email: email,
            password: password,
            administrador: administrador
        },
        headers: {
            authorization: token
        },
        failOnStatusCode: false
    })
})