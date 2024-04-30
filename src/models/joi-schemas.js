import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
.keys({
  email: Joi.string().email().example("bigboss@mgs.com").required(),
  password: Joi.string().example("secret").required(),
})
.label("UserCredentialsSpec");

export const UserSpec =  UserCredentialsSpec.keys({
  firstName: Joi.string().example("Big").required(),
  lastName: Joi.string().example("Boss").required(),
  _id: IdSpec,
})
.label("UserSpec");


export const UserSpecPlus = UserSpec.keys({
  admin: Joi.boolean().example("true"),
  __v: Joi.number(),
})
.label("UserSpecPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

// .example
export const SpotSpec = Joi.object()
.keys({
  name: Joi.string().required(),
  category: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  userid: IdSpec,
})
.label("SpotSpec");

// .example
export const SpotSpecPlus = SpotSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
})
.label("SpotSpecPlus");

export const SpotArray = Joi.array().items(SpotSpecPlus).label("SpotArray");

// Note: Non-API function, therefore not documenting via Swagger
export const SpotEdit = {
  name: Joi.string().allow("").optional(),
  category: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  latitude: Joi.number().min(-90).max(90).allow("").optional(),
  longitude: Joi.number().min(-180).max(180).allow("").optional(),
}

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");