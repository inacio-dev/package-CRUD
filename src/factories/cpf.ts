import { z } from 'zod'

/**
 * Classe que representa um CPF (Cadastro de Pessoa Física) brasileiro.
 * Encapsula a validação, formatação e manipulação segura de CPFs.
 */
export class CPF {
  /**
   * Valor interno do CPF, armazenado apenas com dígitos numéricos.
   * @private
   */
  private readonly value: string

  /**
   * Verifica se um CPF é válido de acordo com as regras da Receita Federal.
   * Realiza a validação do algoritmo dos dígitos verificadores.
   * @param cpf - String contendo o CPF (apenas dígitos).
   * @returns {boolean} true se o CPF for válido, false caso contrário.
   * @private
   * @static
   */
  private static validate(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    try {
      const digits = cpf.split('').map((digit) => parseInt(digit, 10))

      // Validação do primeiro dígito verificador
      // Multiplica os 9 primeiros dígitos pela sequência decrescente de 10 a 2
      let soma1 = 0
      for (let i = 0; i < 9; i++) {
        soma1 += digits[i] * (10 - i)
      }

      // Calcula o resto da divisão (soma1 * 10) por 11
      let resto1 = (soma1 * 10) % 11
      // Se o resto for 10, considera-se como 0
      if (resto1 === 10) {
        resto1 = 0
      }

      // Verifica se o resto calculado corresponde ao primeiro dígito verificador
      if (resto1 !== digits[9]) {
        return false
      }

      // Validação do segundo dígito verificador
      // Multiplica os 10 primeiros dígitos pela sequência decrescente de 11 a 2
      let soma2 = 0
      for (let i = 0; i < 10; i++) {
        soma2 += digits[i] * (11 - i)
      }

      // Calcula o resto da divisão (soma2 * 10) por 11
      let resto2 = (soma2 * 10) % 11
      // Se o resto for 10, considera-se como 0
      if (resto2 === 10) {
        resto2 = 0
      }

      // Verifica se o resto calculado corresponde ao segundo dígito verificador
      return resto2 === digits[10]
    } catch {
      return false
    }
  }

  /**
   * Valida se o CPF tem exatamente 11 dígitos numéricos e se os dígitos verificadores são válidos.
   * @private
   * @static
   */
  private static readonly schema = z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos numéricos')
    .refine((cpf) => CPF.validate(cpf), 'CPF inválido')

  // -------------------------------------------------------------------------------------------------------------------

  /**
   * Construtor para criação de instâncias de CPF.
   * Valida o CPF e lança um erro se for inválido.
   * @param cpf - String contendo o CPF, pode incluir pontuação (que será removida).
   * @throws {Error} Se o CPF for inválido.
   */
  public constructor(cpf: string) {
    const cleanCpf = cpf.replace(/\D/g, '')
    const result = CPF.schema.safeParse(cleanCpf)

    if (!result.success) {
      throw new Error(result.error.errors[0]?.message || 'CPF inválido')
    }

    this.value = cleanCpf
  }

  /**
   * Retorna o CPF no formato padrão brasileiro: XXX.XXX.XXX-XX.
   * @returns {string} CPF formatado.
   */
  public get formatted(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  /**
   * Retorna o valor bruto do CPF (apenas dígitos).
   * @returns {string} CPF sem formatação.
   */
  public get raw(): string {
    return this.value
  }

  /**
   * Verifica se uma string representa um cpf válido.
   * @param cpf - String a ser validada.
   * @returns {boolean} true se a string for um cpf válido, false caso contrário.
   */
  public static isValid(cpf: string): boolean {
    try {
      const cleanRegistration = cpf.replace(/\D/g, '')
      return CPF.schema.safeParse(cleanRegistration).success
    } catch {
      return false
    }
  }
}
