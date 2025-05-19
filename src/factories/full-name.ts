import { z } from 'zod'

/**
 * Classe que representa o nome completo de uma pessoa.
 * Encapsula a validação, formatação e manipulação segura de nomes.
 */
export class FullName {
  /**
   * Valor interno do nome completo.
   * @private
   */
  private readonly value: string

  /**
   * Validação básica do nome completo.
   * @private
   * @static
   */
  private static readonly schema = z
    .string()
    .min(3, 'Nome completo deve ter pelo menos 3 caracteres')
    .max(100, 'Nome completo não pode exceder 100 caracteres')
    .refine((value) => FullName.validate(value), 'Nome completo inválido')

  /**
   * Realiza validações adicionais no nome completo.
   * @param name - Nome completo a ser validado.
   * @returns {boolean} true se o nome for válido, false caso contrário.
   * @private
   * @static
   */
  private static validate(name: string): boolean {
    // Nome deve conter pelo menos duas palavras (nome e sobrenome)
    const words = name.trim().split(/\s+/)
    if (words.length < 2) {
      return false
    }

    // Lista de preposições, artigos e conectivos que são válidos mesmo com menos de 2 caracteres
    const validSingleCharWords = ['e', 'o', 'a', 'à', 'é']

    // Cada palavra deve ter pelo menos 2 caracteres e começar com letra,
    // exceto preposições/artigos/conectivos que podem ter 1 caractere
    for (const word of words) {
      // Preposições e artigos podem ter 1 caractere
      if (word.length === 1 && !validSingleCharWords.includes(word.toLowerCase())) {
        return false
      }

      // Verificar se a palavra começa com uma letra
      if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]/.test(word)) {
        return false
      }

      // Verificar se a palavra contém apenas letras, hífens, apóstrofos
      if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+$/.test(word)) {
        return false
      }
    }

    return true
  }

  /**
   * Normaliza um nome completo, removendo espaços extras e capitalizando adequadamente.
   * @param name - Nome a ser normalizado.
   * @returns {string} Nome normalizado.
   * @private
   * @static
   */
  private static normalizeName(name: string): string {
    // Remove espaços extras
    const trimmedName = name.trim().replace(/\s+/g, ' ')

    // Divide o nome em palavras para processar cada uma individualmente
    const words = trimmedName.split(' ')

    // Processa cada palavra
    const processedWords = words.map((word, index) => {
      // Lista de preposições, artigos e conectivos que não são capitalizados
      const lowerCaseWords = [
        'de',
        'da',
        'do',
        'das',
        'dos',
        'e',
        'o',
        'a',
        'os',
        'as',
        'em',
        'com',
      ]

      // Se for a primeira palavra, sempre capitaliza
      if (index === 0) {
        return FullName.capitalizeWord(word)
      }

      // Se for uma preposição, artigo ou conectivo, mantém em minúsculo
      if (lowerCaseWords.includes(word.toLowerCase())) {
        return word.toLowerCase()
      }

      // Para as demais palavras, capitaliza adequadamente
      return FullName.capitalizeWord(word)
    })

    // Junta as palavras processadas
    return processedWords.join(' ')
  }

  /**
   * Capitaliza uma palavra, respeitando hífens e apóstrofos.
   * @param word - Palavra a ser capitalizada.
   * @returns {string} Palavra capitalizada.
   * @private
   * @static
   */
  private static capitalizeWord(word: string): string {
    // Trata palavras com hífen
    if (word.includes('-')) {
      return word
        .split('-')
        .map((part) => FullName.capitalizeWord(part))
        .join('-')
    }

    // Trata palavras com apóstrofo
    if (word.includes("'")) {
      const apostropheIndex = word.indexOf("'")
      const firstPart = word.substring(0, apostropheIndex + 1)
      const secondPart = word.substring(apostropheIndex + 1)

      if (secondPart.length > 0) {
        return firstPart + FullName.capitalizeWord(secondPart)
      }
      return firstPart
    }

    // Capitalização padrão
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }

  // -------------------------------------------------------------------------------------------------------------------

  /**
   * Construtor para criação de instâncias de nome completo.
   * Valida o nome e lança um erro se for inválido.
   * @param name - String contendo o nome completo.
   * @throws {Error} Se o nome for inválido.
   */
  public constructor(name: string) {
    const cleanName = FullName.normalizeName(name)
    const result = FullName.schema.safeParse(cleanName)

    if (!result.success) {
      throw new Error(result.error.errors[0]?.message || 'Nome completo inválido')
    }

    this.value = cleanName
  }

  /**
   * Retorna o nome completo.
   * @returns {string} Nome completo formatado.
   */
  public get raw(): string {
    return this.value
  }

  /**
   * Retorna o nome completo formatado (mesmo que raw neste caso).
   * @returns {string} Nome completo formatado.
   */
  public get formatted(): string {
    return this.value
  }

  /**
   * Retorna o primeiro nome.
   * @returns {string} Primeiro nome.
   */
  public getFirstName(): string {
    return this.value.split(' ')[0]
  }

  /**
   * Retorna o último nome (sobrenome).
   * @returns {string} Último nome.
   */
  public getLastName(): string {
    const parts = this.value.split(' ')
    return parts[parts.length - 1]
  }

  /**
   * Verifica se uma string representa um nome completo válido.
   * @param name - String a ser validada.
   * @returns {boolean} true se a string for um nome válido, false caso contrário.
   */
  public static isValid(name: string): boolean {
    try {
      const cleanName = FullName.normalizeName(name)
      return FullName.schema.safeParse(cleanName).success
    } catch {
      return false
    }
  }
}
