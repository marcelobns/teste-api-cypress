import Joi from 'joi';

const UsuarioSchema = Joi.object({
    quantidade: Joi.number().required(),
    usuarios: Joi.array().items({
        nome: Joi.string().required(),
        preco: Joi.number().required(),
        descricao: Joi.string().required(),
        quantidade: Joi.number().required(),
        _id: Joi.string().required()
    })
});

export default UsuarioSchema;