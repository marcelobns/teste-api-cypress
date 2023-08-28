/// <reference types="cypress" />
import produtosSchema from '../contracts/produtos.contract';

describe('Testes da Funcionalidade produtos', () => {
    let token;
    before(() => {
        cy.token("marcelo@teste.com.br", "editado_teste").then((_token) => {
            token = _token;
        })
    })

    it('Retornar uma lista de produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.duration).to.be.lessThan(20)

            expect(response.body.produtos).to.be.a('array')
            expect(response.body.produtos[0]).to.have.property('nome')
            expect(response.body.produtos[0]).to.have.property('preco')
            expect(response.body.produtos[0]).to.have.property('descricao')
            expect(response.body.produtos[0]).to.have.property('quantidade')
        })
    });

    it("Cadastrar um produto", () => {
        const produto_nome = "Produto Teste " + Math.floor(Math.random() * 1000);
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                nome: produto_nome,
                preco: "999",
                descricao: "Descrição do produto teste",
                quantidade: "99"
            },
            headers: {
                authorization: token
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq("Cadastro realizado com sucesso")
        })
    });

    it("Cadastrar um produto Repetido", () => {
        cy.cadastrarProduto(token, "Produto Teste 1", "999", "Descrição do produto teste", "99")
    });

    it("Deve editar um produto", () => {
        cy.request('produtos').then((response) => {
            expect(response.status).to.eq(200)

            let _id = response.body.produtos[0]._id
            const produto_nome = "Produto Editado " + Math.floor(Math.random() * 1000)
            
            cy.request({
                method: 'PUT',
                url: `produtos/${_id}`,
                body: {
                    nome: produto_nome,
                    preco: "999",
                    descricao: "Descrição do produto teste",
                    quantidade: "99"
                },
                headers: {
                    authorization: token
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq("Registro alterado com sucesso")
            })
        })
    });

    it("Deve editar um produto previamente cadastrado", () => {
        const random = Math.floor(Math.random() * 1000);
        const produto_nome = "Produto Teste " + random;

        cy.cadastrarProduto(token, produto_nome, "999", `Descrição do ${produto_nome}`, "99")
        .then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq("Cadastro realizado com sucesso")

            cy.request('produtos').then((response) => {
                expect(response.status).to.eq(200)
    
                let _id = response.body.produtos[0]._id
                const produto_nome_edit = "Produto Teste Editado " + random
                
                cy.request({
                    method: 'PUT',
                    url: `produtos/${_id}`,
                    body: {
                        nome: produto_nome_edit,
                        preco: "999",
                        descricao: `Descrição do ${produto_nome_edit}`,
                        quantidade: "99"
                    },
                    headers: {
                        authorization: token
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.message).to.eq("Registro alterado com sucesso")
                })
            })
        })
    });

    it("Deve Deletar um produto previamente cadastrado", () => {
        const random = Math.floor(Math.random() * 1000);
        const produto_nome = "Produto Teste " + random;

        cy.cadastrarProduto(token, produto_nome, "999", `Descrição do ${produto_nome}`, "99")
        .then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq("Cadastro realizado com sucesso")
            
            let _id = response.body._id

            cy.request({
                method: 'DELETE',
                url: `produtos/${_id}`,
                headers: {
                    authorization: token
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq("Registro excluído com sucesso")
            })
        })
    });

    it("Deve validar o schema da lista de produtos", () => {
        cy.request('produtos').then((response) => {
            expect(response.status).to.eq(200)
            produtosSchema.validateAsync(response.body).then((_response) => {
                expect(_response).to.be.a('object')
            })
        })
    })
});