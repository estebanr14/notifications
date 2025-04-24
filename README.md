<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# dev
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```


With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


## Automatic Code Generation
This project uses Plop to automate code generation, adhering to a Domain-Driven Design (DDD) modular structure. It ensures centralized configuration and scalability for modules.

## Generated Structure
Each generated module follows a clear and consistent structure:

```bash
apps/
  └── <app-name>/src/<module-name>/
      ├── application/
      │   ├── commands/       # CQRS Commands
      │   ├── handlers/       # Command and Query Handlers
      │   ├── mappers/        # Mappers between Entities and DTOs
      │   ├── providers/      # Dependency Injection Providers
      │   ├── <module-name>.service.ts
      ├── domain/
      │   ├── entities/       # Domain Entities and Value Objects
      │   ├── <module-name>.interface.ts
      │   ├── <module-name>.entity.ts
      ├── infraestructure/
      │   ├── schemas/        # MongoDB Schemas
      │   ├── repositories/   # Database Repositories
      ├── presentation/
      │   ├── http/           # HTTP Controllers
      │   ├── dtos/           # Input and Output DTOs
```
## Initial Configuration: config.json
The config.json file defines the module details you want to generate. This file must be located at code-generation/config.json.

Example config.json:

```json
{
  "moduleName": "moduleName",
  "fields": [
    { "name": "userId", "type": "string", "required": true },
    { "name": "balance", "type": "number", "required": true },
    { "name": "currency", "type": "string", "required": true },
    { "name": "isActive", "type": "boolean", "required": false }
  ],
  "operations": ["create", "update", "delete", "getById", "getList"]
}
```


## Field Descriptions:

- moduleName: Name of the module.
- fields: Defines the attributes of the module's main entity:
  - name: Attribute name.
  - type: Data type (string, number, boolean, date, etc.).
  - required: Indicates if the field is mandatory (true or false).
- operations: Required operations for module(create, update, delete, getById, getList)


## Commands for Code Generation
To generate code automatically:

Ensure that the config.json file is correctly configured.
Run the following command:
```bash
yarn add:module
```
This command:

Calls npx plop module --plopfile ./code-generation/plopFile.js.
Generates module files in the appropriate location.
Automatically formats the code (yarn format).


## Infrastructure Management with Terraform

This project uses Terraform to manage its cloud infrastructure on AWS. We use `tfenv` for Terraform version management to ensure consistency across the team.

### Prerequisites

1. Install `tfenv`:

```bash
macOS (using Homebrew)
brew install tfenv

Linux
git clone https://github.com/tfutils/tfenv.git ~/.tfenv
echo 'export PATH="$HOME/.tfenv/bin:$PATH"' >> ~/.bash_profile
```

2. Install the required Terraform version:

```bash
cd infrastructure/
tfenv install
tfenv use
```

3. Configure AWS credentials:
```bash
aws configure
```

4. Initialize Terraform version control in bootstrap (Do it just once):

```bash
cd infrastructure/bootstrap/
terraform init
terraform plan
terraform apply
```
5. Verify the infrastructure:

```bash
cd infrastructure/bootstrap/
terraform state list
terraform state show <resource_address>
terraform show
```
6. How to recover  remote state:

```bash
cd infrastructure/bootstrap/
terraform state pull
```

### Project Structure

The Terraform configuration is organized as follows:

infrastructure/
├── bootstrap/ # Bootstrap infrastructure
├── environments/ # Environment-specific configurations
│ ├── development/ # Development environment
│ ├── staging/ # Staging environment
│ └── production/ # Production environment
└── modules/ # Reusable Terraform modules
├── networking/ # VPC, subnets, security groups
├── ecs/ # ECS cluster and services
└── rds/ # Database configuration

### Usage

1. Navigate to the desired environment directory:

```bash
cd infrastructure/environments/dev
```

2. Initialize Terraform:

```bash
terraform init
```

3. Plan your changes:

```bash
terraform plan
```

4. Apply your changes:

```bash
terraform apply
```

5. Destroy your infrastructure:

```bash
terraform destroy
```

6. format code

```bash
terraform fmt
```

7. validate configuration

```bash
terraform validate
```

8. destroy infrastructure

```bash
terraform destroy
```




### Additional Resources

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Documentation](https://docs.aws.amazon.com/index.html)
