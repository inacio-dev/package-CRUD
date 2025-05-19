import { FullName } from '../factories/full-name'

describe('FullName', () => {
  describe('Constructor', () => {
    it('deve criar uma instância de FullName com um nome válido', () => {
      const fullName = new FullName('João Silva')
      expect(fullName).toBeInstanceOf(FullName)
      expect(fullName.raw).toBe('João Silva')
    })

    it('deve normalizar a capitalização do nome', () => {
      const fullName = new FullName('maria DA silva')
      expect(fullName.raw).toBe('Maria da Silva')
    })

    it('deve normalizar preposições e artigos', () => {
      const fullName = new FullName('Antonio DE Oliveira DOS Santos')
      expect(fullName.raw).toBe('Antonio de Oliveira dos Santos')
    })

    it('deve preservar a capitalização da primeira palavra', () => {
      const fullName = new FullName('de souza pereira')
      expect(fullName.raw).toBe('De Souza Pereira')
    })

    it('deve remover espaços extras', () => {
      const fullName = new FullName('  Ana   Paula  Souza  ')
      expect(fullName.raw).toBe('Ana Paula Souza')
    })

    it('deve aceitar nomes com hífens', () => {
      const fullName = new FullName('João-Carlos Silva')
      expect(fullName.raw).toBe('João-Carlos Silva')
    })

    it('deve aceitar nomes com apóstrofos', () => {
      const fullName = new FullName("Maria D'Alessandro")
      expect(fullName.raw).toBe("Maria D'Alessandro")
    })

    it('deve lançar erro para nome com menos de 3 caracteres', () => {
      expect(() => new FullName('Jo')).toThrow('Nome completo deve ter pelo menos 3 caracteres')
    })

    it('deve lançar erro para nome muito longo', () => {
      const longName = 'A'.repeat(101)
      expect(() => new FullName(longName)).toThrow('Nome completo não pode exceder 100 caracteres')
    })

    it('deve lançar erro para nome sem sobrenome', () => {
      expect(() => new FullName('João')).toThrow('Nome completo inválido')
    })

    it('deve lançar erro para nome com palavras muito curtas', () => {
      expect(() => new FullName('João S')).toThrow('Nome completo inválido')
    })

    it('deve lançar erro para nome com caracteres inválidos', () => {
      expect(() => new FullName('João Silva123')).toThrow('Nome completo inválido')
      expect(() => new FullName('João @Silva')).toThrow('Nome completo inválido')
      expect(() => new FullName('João Silva!')).toThrow('Nome completo inválido')
    })
  })

  describe('Métodos', () => {
    it('deve retornar o primeiro nome', () => {
      const fullName = new FullName('Maria José Oliveira')
      expect(fullName.getFirstName()).toBe('Maria')
    })

    it('deve retornar o último nome', () => {
      const fullName = new FullName('José Carlos da Silva')
      expect(fullName.getLastName()).toBe('Silva')
    })

    it('deve retornar o mesmo valor para raw e formatted', () => {
      const fullName = new FullName('Carlos Roberto Santos')
      expect(fullName.raw).toBe('Carlos Roberto Santos')
      expect(fullName.formatted).toBe('Carlos Roberto Santos')
    })
  })

  describe('Validação Estática', () => {
    it('deve validar nomes corretos', () => {
      expect(FullName.isValid('João Silva')).toBe(true)
      expect(FullName.isValid('Maria da Silva')).toBe(true)
      expect(FullName.isValid('José Carlos dos Santos')).toBe(true)
      expect(FullName.isValid('Ana-Maria Oliveira')).toBe(true)
      expect(FullName.isValid("Jean-Claude O'Donnell")).toBe(true)
    })

    it('deve invalidar nomes incorretos', () => {
      expect(FullName.isValid('João')).toBe(false) // Sem sobrenome
      expect(FullName.isValid('J S')).toBe(false) // Palavras muito curtas
      expect(FullName.isValid('123 Silva')).toBe(false) // Números
      expect(FullName.isValid('@João Silva')).toBe(false) // Caracteres especiais
      expect(FullName.isValid('')).toBe(false) // Vazio
    })
  })

  describe('Nomes válidos', () => {
    const nomesValidos = [
      'João Silva',
      'Maria de Souza',
      'José da Costa Santos',
      'Ana Paula Oliveira',
      'Carlos Alberto dos Santos',
      'Antônio José Ferreira',
      'Jean-Pierre Dupont',
      "Maria O'Connor",
      'Pedro Silva e Souza',
      'Luís Inácio da Silva',
    ]

    test.each(nomesValidos)('deve aceitar o nome válido %s', (nomeValido) => {
      expect(() => new FullName(nomeValido)).not.toThrow()
    })
  })

  describe('Nomes inválidos', () => {
    const nomesInvalidos = [
      'J', // Muito curto
      'João', // Sem sobrenome
      'J S', // Componentes muito curtos
      'João 123', // Com números
      'João @Silva', // Com caracteres especiais não permitidos
      'João Silva!', // Com pontuação não permitida
      'João Silva júnior 123', // Mistura válida com inválida
    ]

    test.each(nomesInvalidos)('deve rejeitar o nome inválido %s', (nomeInvalido) => {
      expect(() => new FullName(nomeInvalido)).toThrow()
    })
  })

  describe('Casos especiais', () => {
    it('deve lidar com nomes contendo preposições compostas', () => {
      const fullName = new FullName('João da Silva de Oliveira')
      expect(fullName.raw).toBe('João da Silva de Oliveira')
    })

    it('deve normalizar múltiplos espaços corretamente', () => {
      const fullName = new FullName('João   da   Silva')
      expect(fullName.raw).toBe('João da Silva')
    })

    it('deve aceitar nomes com hífen como uma única palavra', () => {
      const fullName = new FullName('Maria-José Silva')
      expect(fullName.getFirstName()).toBe('Maria-José')
      expect(fullName.getLastName()).toBe('Silva')
    })
  })
})
