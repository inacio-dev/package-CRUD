import { Email } from '../factories/email'

describe('Email', () => {
  describe('Constructor', () => {
    it('deve criar uma instância de Email com um email válido', () => {
      const email = new Email('teste@exemplo.com')
      expect(email).toBeInstanceOf(Email)
      expect(email.raw).toBe('teste@exemplo.com')
    })

    it('deve aceitar email com vários caracteres especiais na parte do usuário', () => {
      const email = new Email('teste.nome+tag-123@exemplo.com')
      expect(email).toBeInstanceOf(Email)
      expect(email.raw).toBe('teste.nome+tag-123@exemplo.com')
    })

    it('deve normalizar o email para minúsculas', () => {
      const email = new Email('Teste@Exemplo.Com')
      expect(email.raw).toBe('teste@exemplo.com')
    })

    it('deve remover espaços extras', () => {
      const email = new Email('  teste@exemplo.com  ')
      expect(email.raw).toBe('teste@exemplo.com')
    })

    it('deve lançar erro para email sem @', () => {
      expect(() => new Email('testesememail.com')).toThrow('Email inválido')
    })

    it('deve lançar erro para email sem domínio', () => {
      expect(() => new Email('teste@')).toThrow('Email inválido')
    })

    it('deve lançar erro para email sem nome de usuário', () => {
      expect(() => new Email('@exemplo.com')).toThrow('Email inválido')
    })

    it('deve lançar erro para email com formato inválido', () => {
      expect(() => new Email('teste@exemplo')).toThrow('Email inválido')
    })
  })

  describe('Métodos', () => {
    it('deve retornar o domínio do email', () => {
      const email = new Email('teste@exemplo.com')
      expect(email.getDomain()).toBe('exemplo.com')
    })

    it('deve retornar o nome de usuário do email', () => {
      const email = new Email('usuario.teste@dominio.com.br')
      expect(email.getUsername()).toBe('usuario.teste')
    })

    it('deve verificar corretamente o domínio do email', () => {
      const email = new Email('teste@exemplo.com')
      expect(email.hasDomain('exemplo.com')).toBe(true)
      expect(email.hasDomain('outro.com')).toBe(false)
    })

    it('deve verificar domínio de forma case-insensitive', () => {
      const email = new Email('teste@Exemplo.com')
      expect(email.hasDomain('exemplo.COM')).toBe(true)
    })
  })

  describe('Validação Estática', () => {
    it('deve identificar emails válidos', () => {
      expect(Email.isValid('teste@exemplo.com')).toBe(true)
      expect(Email.isValid('user.name+tag@domain.co.uk')).toBe(true)
      expect(Email.isValid('email@dominio.com.br')).toBe(true)
      expect(Email.isValid('usuario123@servidor.net')).toBe(true)
    })

    it('deve identificar emails inválidos', () => {
      expect(Email.isValid('email@')).toBe(false)
      expect(Email.isValid('@dominio.com')).toBe(false)
      expect(Email.isValid('emailsemdominio')).toBe(false)
      expect(Email.isValid('email@dominio')).toBe(false)
      expect(Email.isValid('')).toBe(false)
    })
  })

  describe('Emails comuns', () => {
    const emailsValidos = [
      'simples@exemplo.com',
      'muito.comum@exemplo.com',
      'disposable.style.email.with+tag@exemplo.com',
      'outros.email-com-hifen@exemplo.com',
      'x@exemplo.com',
      'exemplo-indeed@strange-exemplo.com',
      'exemplo@s.exemplo',
      'email@exemplo.web',
      'email@dominio.org',
      'email@dominio.co.jp',
    ]

    test.each(emailsValidos)('deve aceitar o email válido %s', (emailValido) => {
      expect(() => new Email(emailValido)).not.toThrow()
    })
  })
})
