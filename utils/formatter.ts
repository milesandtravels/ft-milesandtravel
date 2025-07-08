export const formatters = {
  toCamelCase(str: string): string {
    if (!str || typeof str !== 'string') {
      return ''
    }
    return str
      .trim()
      .split(/[\s\-_\.]+/)
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '')
  },

  toKebabCase(str: string): string {
    if (!str || typeof str !== 'string') {
      return ''
    }

    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  },

  toSnakeCase(str: string): string {
    if (!str || typeof str !== 'string') {
      return ''
    }

    return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
  },
  toTitleCase(str: string): string {
    if (!str || typeof str !== 'string') {
      return ''
    }

    return str
      .trim()
      .split(/[\s\-_\.]+/)
      .map(word => {
        if (!word) return ''
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
      .replace(/\s+/g, ' ')
  },
  toPascalCase(str: string): string {
    if (!str || typeof str !== 'string') {
      return ''
    }

    const camelCase = str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
      .replace(/^[^a-zA-Z]/, '')

    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
  },
}
