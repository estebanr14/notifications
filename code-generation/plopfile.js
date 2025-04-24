const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

Handlebars.registerHelper('kebabCase', (str) => {
    return str.replace(/\s+/g, '-').toLowerCase();
});

Handlebars.registerHelper('ifIncludes', function (array, value, options) {
    return array.includes(value) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('equals', (arg1, arg2) => arg1 === arg2);
Handlebars.registerHelper('or', (arg1, arg2) => arg1 || arg2);

module.exports = function (plop) {
    const kebabCase = (str) => str.replace(/\s+/g, '-').toLowerCase();
    const templatesPath = path.resolve(__dirname, 'plop-templates');
    const configPath = path.resolve(__dirname, 'config.json');
    const examplePath = path.resolve(__dirname, 'config.example.json');

    plop.setGenerator('module', {
        description: 'Crea un nuevo módulo con CQRS y DDD desde un JSON de configuración',
        prompts: [
            {
                type: 'list',
                name: 'app',
                message: '¿En qué aplicación deseas generar el módulo?',
                choices: ['backend', 'backoffice', 'notifications'],
            },
        ],
        actions: (answers) => {

            if (!fs.existsSync(configPath)) {
                throw new Error(`No se encontró el archivo JSON de configuración en ${configPath}`);
            }


            const config = require(configPath);
            const { moduleName, fields, operations } = config;
            console.log(`Generando módulo: ${moduleName}`);
            console.log('Campos:', fields);
            console.log('Operaciones:', operations);

            const actions = [];
            const moduleBasePath = `../apps/${answers.app}/src/${kebabCase(moduleName)}`;
            const securityRole = answers.app === 'backend' ? 'User' : 'Admin';

            actions.push(
                // Crear módulo
                {
                    type: 'add',
                    path: `${moduleBasePath}/${kebabCase(moduleName)}.module.ts`,
                    templateFile: `${templatesPath}/module.hbs`,
                    data: { moduleName, fields, operations },
                },
                // Crear controlador
                {
                    type: 'add',
                    path: `${moduleBasePath}/presentation/http/${kebabCase(moduleName)}.controller.ts`,
                    templateFile: `${templatesPath}/controller.hbs`,
                    data: { moduleName, fields, operations, securityRole },
                },
                // Crear DTOs
                {
                    type: 'add',
                    path: `${moduleBasePath}/presentation/dtos/${kebabCase(moduleName)}.dto.ts`,
                    templateFile: `${templatesPath}/dto.hbs`,
                    data: { moduleName, fields, operations },
                },
                {
                    type: 'add',
                    path: `${moduleBasePath}/presentation/dtos/${kebabCase(moduleName)}.response.dto.ts`,
                    templateFile: `${templatesPath}/response-dto.hbs`,
                    data: { moduleName, fields },
                },
                // Comandos, queries y handlers
                ...operations
                    .map((operation) => {
                        const isCommand = operation === 'create' || operation === 'delete' || operation === 'update';
                        if (isCommand) {
                            return [
                                {
                                    type: 'add',
                                    path: `${moduleBasePath}/application/commands/${operation}-${kebabCase(moduleName)}.command.ts`,
                                    templateFile: `${templatesPath}/command.hbs`,
                                    data: { operation, moduleName, fields },
                                },
                                {
                                    type: 'add',
                                    path: `${moduleBasePath}/application/handlers/${operation}-${kebabCase(moduleName)}.handler.ts`,
                                    templateFile: `${templatesPath}/handler.hbs`,
                                    data: { operation, moduleName, fields },
                                },
                                operation === 'create' ? {
                                    type: 'add',
                                    path: `${moduleBasePath}/presentation/dtos/create-${kebabCase(moduleName)}.dto.ts`,
                                    templateFile: `${templatesPath}/create-dto.hbs`,
                                    data: { moduleName, fields },
                                } : null,
                                operation === 'update' ? {
                                    type: 'add',
                                    path: `${moduleBasePath}/presentation/dtos/update-${kebabCase(moduleName)}.dto.ts`,
                                    templateFile: `${templatesPath}/update-dto.hbs`,
                                    data: { moduleName, fields },
                                } : null,
                            ].filter(Boolean);
                        }

                        const isQuery = operation === 'getById' || operation === 'getList';
                        if (isQuery) {
                            const queryName = operation === 'getList' ? 'get-list' : 'get';
                            return [
                                {
                                    type: 'add',
                                    path: `${moduleBasePath}/application/queries/${queryName}-${kebabCase(moduleName)}.query.ts`,
                                    templateFile: `${templatesPath}/query.hbs`,
                                    data: { operation, moduleName, fields },
                                },
                                {
                                    type: 'add',
                                    path: `${moduleBasePath}/application/handlers/${queryName}-${kebabCase(moduleName)}.handler.ts`,
                                    templateFile: `${templatesPath}/query-handler.hbs`,
                                    data: { operation, moduleName, fields },
                                },
                                operation === 'getList' ? {
                                    type: 'add',
                                    path: `${moduleBasePath}/presentation/dtos/get-list-${kebabCase(moduleName)}s.dto.ts`,
                                    templateFile: `${templatesPath}/query-filters-dto.hbs`,
                                    data: { moduleName, fields },
                                } : null,
                            ].filter(Boolean);
                        }

                        return null;
                    })
                    .filter(Boolean)
                    .flat(),

                {
                    type: 'add',
                    path: `${moduleBasePath}/application/${kebabCase(moduleName)}.service.ts`,
                    templateFile: `${templatesPath}/service.hbs`,
                    data: { moduleName, fields, operations },
                },
                {
                    type: 'add',
                    path: `${moduleBasePath}/infraestructure/schemas/${kebabCase(moduleName)}.schema.ts`,
                    templateFile: `${templatesPath}/schema.hbs`,
                    data: { moduleName, fields },
                },
                {
                    type: 'add',
                    path: `${moduleBasePath}/infraestructure/repositories/${kebabCase(moduleName)}.mongo.repository.ts`,
                    templateFile: `${templatesPath}/repository.hbs`,
                    data: { moduleName, fields },
                },
                {
                    type: 'add',
                    path: `${moduleBasePath}/application/providers/${kebabCase(moduleName)}.providers.ts`,
                    templateFile: `${templatesPath}/providers.hbs`,
                    data: { moduleName, fields },
                },
                {
                    type: 'add',
                    path: `${moduleBasePath}/application/mappers/${kebabCase(moduleName)}.mapper.ts`,
                    templateFile: `${templatesPath}/mapper.hbs`,
                    data: { moduleName, fields, operations },
                },
                {
                    type: 'add',
                    path: `${moduleBasePath}/domain/entities/${kebabCase(moduleName)}.interface.ts`,
                    templateFile: `${templatesPath}/interface.hbs`,
                    data: { moduleName, fields },
                },
                {
                    type: 'add',
                    path: `${moduleBasePath}/domain/entities/${kebabCase(moduleName)}.entity.ts`,
                    templateFile: `${templatesPath}/entity.hbs`,
                    data: { moduleName, fields },
                },
            );

            return actions;
        },
    });


    plop.setWelcomeMessage(
        `Bienvenido a la generación automática de módulos.\n` +
        `Archivo de configuración: ${configPath}\n` +
        `Ejemplo disponible en: ${examplePath}`
    );
};
