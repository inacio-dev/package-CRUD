# @inacio-dev/package-crud

Uma biblioteca TypeScript de validação e formatação para dados comuns em operações CRUD, com foco especial em validações para o contexto brasileiro.

## Instalação

```bash
npm install @inacio-dev/package-crud
```

Ou usando yarn:

```bash
yarn add @inacio-dev/package-crud
```

## Autenticação com GitHub Packages

Este pacote é distribuído através do GitHub Packages. Para instalar, você precisará configurar a autenticação:

1. Crie um token de acesso pessoal no GitHub com permissão `read:packages`

   - Vá para: Settings > Developer settings > Personal access tokens
   - Gere um novo token com escopo `read:packages`

2. Configure o npm para usar o GitHub Packages:

   Crie ou edite o arquivo `.npmrc` no diretório raiz do seu projeto:

   ```
   @inacio-dev:registry=https://npm.pkg.github.com/
   //npm.pkg.github.com/:_authToken=SEU_TOKEN_AQUI
   ```

   Substitua `SEU_TOKEN_AQUI` pelo token gerado no passo anterior.

## Funcionalidades

Esta biblioteca fornece classes para validação e manipulação dos seguintes tipos de dados:

- **CPF**: Validação e formatação de CPF (Cadastro de Pessoa Física)
- **Email**: Validação e manipulação de endereços de email
- **FullName**: Validação e formatação de nomes completos
- **EmployeeStatus**: Enum para status de funcionário

## Classes e Uso

### CPF

```typescript
import { CPF } from '@inacio-dev/package-crud'

// Criando um CPF
const cpf = new CPF('529.982.247-25')

// Acesso às propriedades
console.log(cpf.raw) // '52998224725'
console.log(cpf.formatted) // '529.982.247-25'

// Validação estática
console.log(CPF.isValid('529.982.247-25')) // true
console.log(CPF.isValid('123.456.789-00')) // false (CPF inválido)
```

O método estático `isValid` permite verificar se um CPF é válido sem criar uma instância:

```typescript
// Verificar validade sem criar instância
if (CPF.isValid(cpfInput)) {
  console.log('CPF válido')
} else {
  console.log('CPF inválido')
}
```

Um CPF é considerado válido quando:

- Contém exatamente 11 dígitos numéricos
- Passa na validação do algoritmo dos dígitos verificadores
- Não consiste em dígitos repetidos (ex: 111.111.111-11)

### Email

```typescript
import { Email } from '@inacio-dev/package-crud'

// Criando uma instância de Email
const email = new Email('usuario@exemplo.com')

// Acesso às propriedades e métodos
console.log(email.raw) // 'usuario@exemplo.com'
console.log(email.formatted) // 'usuario@exemplo.com'
console.log(email.getDomain()) // 'exemplo.com'
console.log(email.getUsername()) // 'usuario'
console.log(email.hasDomain('exemplo.com')) // true

// Validação estática
console.log(Email.isValid('usuario@exemplo.com')) // true
console.log(Email.isValid('email-invalido')) // false
```

O método estático `isValid` permite verificar se um email é válido sem criar uma instância:

```typescript
// Verificar validade sem criar instância
if (Email.isValid(emailInput)) {
  console.log('Email válido')
} else {
  console.log('Email inválido')
}
```

### FullName

```typescript
import { FullName } from '@inacio-dev/package-crud'

// Criando uma instância de FullName
const nome = new FullName('joão da silva')

// Acesso às propriedades e métodos
console.log(nome.raw) // 'João da Silva'
console.log(nome.formatted) // 'João da Silva'
console.log(nome.getFirstName()) // 'João'
console.log(nome.getLastName()) // 'Silva'

// Validação estática
console.log(FullName.isValid('Maria Santos')) // true
console.log(FullName.isValid('João')) // false (necessita sobrenome)
```

O método estático `isValid` permite verificar se um nome completo é válido sem criar uma instância:

```typescript
// Verificar validade sem criar instância
if (FullName.isValid(nameInput)) {
  console.log('Nome válido')
} else {
  console.log('Nome inválido')
}
```

A classe FullName oferece:

- Validação de nomes completos (pelo menos um nome e um sobrenome)
- Formatação automática (capitalização apropriada, tratamento de preposições)
- Suporte a caracteres especiais como hífens e apóstrofos (ex: 'Maria-José', 'O'Connor')

### EmployeeStatus

```typescript
import { EmployeeStatus } from '@inacio-dev/package-crud'

// Usando enum para tipar uma função
function updateEmployeeStatus(status: EmployeeStatus) {
  console.log(`Status atualizado para: ${status}`)
}

updateEmployeeStatus(EmployeeStatus.NORMAL) // 'Normal'
updateEmployeeStatus(EmployeeStatus.VACATION) // 'Férias'
updateEmployeeStatus(EmployeeStatus.DISMISSED) // 'Demitido'
updateEmployeeStatus(EmployeeStatus.TRANSFERRED) // 'Transferido'
updateEmployeeStatus(EmployeeStatus.LEAVE) // 'Afastado'
```

## Tratamento de Erros

Todas as classes de validação lançam erros descritivos quando os dados fornecidos são inválidos:

```typescript
try {
  const cpf = new CPF('123.456.789-00')
} catch (error) {
  console.error(error.message) // 'CPF inválido'
}

try {
  const email = new Email('emailinvalido')
} catch (error) {
  console.error(error.message) // 'Email inválido'
}

try {
  const nome = new FullName('João123')
} catch (error) {
  console.error(error.message) // 'Nome completo inválido'
}
```

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Crie um novo Pull Request
