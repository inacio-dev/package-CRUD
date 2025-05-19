import { z } from 'zod'

/**
 * Classe que representa um endereço de email.
 * Encapsula a validação, formatação e manipulação segura de emails.
 */
export class Email {
  /**
   * Valor interno do email.
   * @private
   */
  private readonly value: string

  /**
   * Valida se o email segue um formato válido.
   * @private
   * @static
   */
  private static readonly schema = z
    .string()
    .email('Email inválido')
    .max(255, 'Email não pode exceder 255 caracteres')

  // -------------------------------------------------------------------------------------------------------------------

  /**
   * Construtor para criação de instâncias de email.
   * Valida o email e lança um erro se for inválido.
   * @param email - String contendo o email.
   * @throws {Error} Se o email for inválido.
   */
  public constructor(email: string) {
    const cleanEmail = email.trim().toLowerCase()
    const result = Email.schema.safeParse(cleanEmail)

    if (!result.success) {
      throw new Error(result.error.errors[0]?.message || 'Email inválido')
    }

    this.value = cleanEmail
  }

  /**
   * Retorna o valor bruto do email.
   * @returns {string} Email sem formatação.
   */
  public get raw(): string {
    return this.value
  }

  /**
   * Retorna o email formatado (em minúsculas).
   * @returns {string} Email formatado.
   */
  public get formatted(): string {
    return this.value
  }

  /**
   * Retorna o domínio do email (parte após o @).
   * @returns {string} Domínio do email.
   */
  public getDomain(): string {
    return this.value.split('@')[1]
  }

  /**
   * Retorna o nome de usuário do email (parte antes do @).
   * @returns {string} Nome de usuário do email.
   */
  public getUsername(): string {
    return this.value.split('@')[0]
  }

  /**
   * Verifica se o email usa um domínio específico.
   * @param domain - Domínio a ser verificado.
   * @returns {boolean} true se o email usar o domínio especificado, false caso contrário.
   */
  public hasDomain(domain: string): boolean {
    return this.getDomain().toLowerCase() === domain.toLowerCase()
  }

  /**
   * Verifica se uma string representa um email válido.
   * @param email - String a ser validada.
   * @returns {boolean} true se a string for um email válido, false caso contrário.
   */
  public static isValid(email: string): boolean {
    try {
      const cleanEmail = email.trim().toLowerCase()
      return Email.schema.safeParse(cleanEmail).success
    } catch {
      return false
    }
  }
}
