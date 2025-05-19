import { CPF } from '../factories'

describe('CPF', () => {
  describe('Constructor', () => {
    it('deve criar uma instância de CPF com um CPF válido', () => {
      const cpf = new CPF('529.982.247-25')
      expect(cpf).toBeInstanceOf(CPF)
      expect(cpf.raw).toBe('52998224725')
    })

    it('deve aceitar CPF sem formatação', () => {
      const cpf = new CPF('52998224725')
      expect(cpf).toBeInstanceOf(CPF)
      expect(cpf.raw).toBe('52998224725')
    })

    it('deve lançar erro para CPF com quantidade incorreta de dígitos', () => {
      expect(() => new CPF('1234567890')).toThrow('CPF deve conter exatamente 11 dígitos numéricos')
      expect(() => new CPF('123456789012')).toThrow(
        'CPF deve conter exatamente 11 dígitos numéricos',
      )
    })

    it('deve lançar erro para CPF com dígitos verificadores inválidos', () => {
      expect(() => new CPF('12345678901')).toThrow('CPF inválido')
    })

    it('deve lançar erro para CPF com todos os dígitos iguais', () => {
      expect(() => new CPF('11111111111')).toThrow('CPF inválido')
      expect(() => new CPF('00000000000')).toThrow('CPF inválido')
    })

    it('deve remover caracteres não numéricos do CPF', () => {
      const cpf = new CPF('529.982.247-25')
      expect(cpf.raw).toBe('52998224725')
    })
  })

  describe('Propriedades', () => {
    it('deve retornar o valor formatado do CPF', () => {
      const cpf = new CPF('52998224725')
      expect(cpf.formatted).toBe('529.982.247-25')
    })

    it('deve retornar o valor bruto do CPF', () => {
      const cpf = new CPF('529.982.247-25')
      expect(cpf.raw).toBe('52998224725')
    })
  })

  describe('Casos especiais', () => {
    it('deve aceitar CPFs válidos com caracteres especiais', () => {
      const cpf = new CPF('529.982.247-25')
      expect(cpf).toBeInstanceOf(CPF)
    })

    it('deve aceitar CPFs válidos com espaços', () => {
      const cpf = new CPF('529 982 247 25')
      expect(cpf).toBeInstanceOf(CPF)
    })

    it('deve aceitar CPFs válidos com letras (que serão ignoradas)', () => {
      const cpf = new CPF('529a982b247c25')
      expect(cpf).toBeInstanceOf(CPF)
      expect(cpf.raw).toBe('52998224725')
    })
  })

  describe('CPFs válidos conhecidos', () => {
    const cpfsValidos = [
      '529.982.247-25',
      '111.444.777-35',
      '448.748.803-63',
      '053.125.853-00',
      '762.543.213-00',
    ]

    test.each(cpfsValidos)('deve aceitar o CPF válido %s', (cpfValido) => {
      expect(() => new CPF(cpfValido)).not.toThrow()
    })
  })

  describe('CPFs inválidos conhecidos', () => {
    const cpfsInvalidos = [
      '111.111.111-11', // Todos os dígitos iguais
      '123.456.789-01', // Dígitos verificadores incorretos
      '529.982.247-26', // Último dígito incorreto
      '529.982.247-15', // Penúltimo dígito incorreto
      '12345', // Muito curto
      '123456789012345', // Muito longo
    ]

    test.each(cpfsInvalidos)('deve rejeitar o CPF inválido %s', (cpfInvalido) => {
      expect(() => new CPF(cpfInvalido)).toThrow()
    })
  })
})
