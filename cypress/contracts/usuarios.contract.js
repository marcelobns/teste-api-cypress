import Joi from 'joi';

const UsuariosSchema = Joi.object({
    quantidade: Joi.number().required(),
    usuarios: Joi.array().items({
        nome: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        administrador: Joi.boolean().required(),
        _id: Joi.string().required()
    })
});

export default UsuariosSchema;