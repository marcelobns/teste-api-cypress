/// <reference types="cypress" />
import usuariosSchema from '../contracts/usuarios.contract';
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {
    let token;
    before(() => {
        cy.token("marcelo@teste.com.br", "editado_teste").then((_token) => {
            token = _token;
        })
    })

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then((response) => {
            expect(response.status).to.eq(200)
            
            usuariosSchema.validateAsync(response.body).then((_response) => {
                expect(_response).to.be.an('object')
            })
        })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.request('usuarios').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.duration).to.be.lessThan(20)
            expect(response.body.usuarios).to.be.a('array')
            expect(response.body.usuarios[0]).to.have.property('nome')
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        cy.cadastrarUsuario(token, faker.person.fullName(), faker.internet.email(), faker.internet.password(), "true")
        .then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq("Cadastro realizado com sucesso")
        })
    });

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastrarUsuario(token, faker.person.fullName(), 'emailinvalido', faker.internet.password(), "true")
        .then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('email');
            expect(response.body.email).to.contains('email deve ser um email válido');
        });
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        const person = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        }

        cy.cadastrarUsuario(token, person.nome, person.email, person.password, person.administrador)
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.message).to.eq("Cadastro realizado com sucesso")

                cy.request({
                    method: 'PUT',
                    url: `usuarios/${response.body._id}`,
                    body: {
                        nome: `editado_${person.nome}`,
                        email: `editado_${person.email}`,
                        password: `editado_${person.password}`,
                        administrador: "false"
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

    it.only('Deve deletar um usuário previamente cadastrado', () => {
        const person = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        }

        cy.cadastrarUsuario(token, person.nome, person.email, person.password, person.administrador)
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.message).to.eq("Cadastro realizado com sucesso")

                cy.request({
                    method: 'DELETE',
                    url: `usuarios/${response.body._id}`,
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
});