import Joi from 'joi';

// Schema untuk CREATE (semua field wajib)
export const notePayloadSchema = Joi.object({
    title: Joi.string().required().max(50),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
});

// Schema untuk QUERY/Search
export const noteQuerySchema = Joi.object({
    title: Joi.string().empty(''),
});

// ✅ TAMBAHKAN INI: Schema untuk UPDATE (field opsional)
export const noteUpdatePayloadSchema = Joi.object({
    title: Joi.string().max(50),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
}).min(1); // Minimal harus ada 1 field yang dikirim saat update