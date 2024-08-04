
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clound server',
      version: '1.0.0',
      description: 'Servicio para cargar archivos',
      license: {},
      contact: {}
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    paths: {
      '/createFile': {
        post: {
          security: [{
            bearerAuth: []
          }],
          summary: 'Create a new file',
          description: 'Create a new file with the given data and user.',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200':{
              "description": "Archivo subido correctamente.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "url": {
                        "type": "string",
                        "description": "url del archivo."
                      }
                    }
                  }
                }},
            },
            '400':{
              "description": "Solicitud incorrecta (archivo faltante, error de validación).",
              "content": {
                "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string",
                    "description": "Mensaje de error."
                  }
                }
              }}}
            },
            '500': {
              "description": "Error interno del servidor.",
              "content": {
                "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string",
                    "description": "Mensaje de error."
                  }
                }
              }}}
            }
          }
        }
      },
      '/getFile/{id}': {
        get: {
          summary: 'Get a file by ID',
          description: 'Retrieve a file by its ID.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'The ID of the file to retrieve.',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              "description": "archivo.",
              "headers": {
                "Content-Disposition": {
                  "type": "string",
                  "description": "Cabecera Content-Disposition del archivo original."
                },
                "Content-Type": {
                  "type": "string",
                  "description": "Cabecera Content-Type del archivo original."
                },
                "Content-Length": {
                  "type": "string",
                  "description": "Cabecera Content-Length del archivo original."
                }
              },
              "content": {
                "application/json": {
              "schema": {
                "type": "string",
                "format": "binary"
              }}}
            },
            '404':{
              "description": "Archivo no encontrado.",
              "content": {
                "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string",
                    "description": "Mensaje de error (e.g., \"No encontrado\")."
                  }
                }
              }}}
            },
            '500': {
              "description": "Error interno del servidor.",
              "content": {
                "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string",
                    "description": "Mensaje de error."
                  }
                }
              }}}
            }
          }
        }
      },
      '/register': {
        post: {
          summary: 'Sing in a user',
          description: 'Sing in a user with the given user name.',
          requestBody: {
            content: {
              'application/x-www-form-urlencoded': {
                schema: {
                  type: 'object',
                  properties: {
                    userName: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              "description": "Inicio de sesión exitoso.",
              "content": {
                "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "token": {
                    "type": "string",
                    "description": "url del archivo."
                  }
                }
              }}}
            },
            '400':{
              "description": "Solicitud incorrecta (nombre de usuario faltante, error de validación).",
              "content": {
                "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string",
                    "description": "Mensaje de error."
                  }
                }
              }}}
            },
            '500': {
              "description": "Error interno del servidor.",
              "content": {
                "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string",
                    "description": "Mensaje de error."
                  }
                }
              }}}
            }
          }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = options;
