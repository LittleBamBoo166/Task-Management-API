export class Checking {
  static isEmpty(value: unknown): boolean {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return false;
    }
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    if (value instanceof Date) {
      return false;
    }
    if (value instanceof Object && !Object.keys(value).length) {
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true;
      }
      if (value.every((item) => Checking.isEmpty(item))) {
        return true;
      }
    }
    if (value === '') {
      return true;
    }

    return false;
  }

  static lengthIsBetween(
    value: number | string | Array<unknown>,
    min: number,
    max: number,
  ): boolean {
    if (Checking.isEmpty(value)) {
      return false;
    }
    const valueLength =
      typeof value === 'number'
        ? Number(value).toString().length
        : value.length;
    if (valueLength >= min && valueLength <= max) {
      return true;
    }
    return false;
  }

  private static isSpecialCharacter(characterCode: number) {
    if (
      (characterCode >= 65 && characterCode <= 90) ||
      (characterCode >= 97 && characterCode <= 122) ||
      (characterCode >= 48 && characterCode <= 57) ||
      characterCode === 95
    ) {
      return false;
    }
    return true;
  }

  static isContainSpecialCharacter(value: string): boolean {
    if (Checking.isEmpty(value)) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      const characterCode = value.charCodeAt(i);
      if (this.isSpecialCharacter(characterCode)) {
        return true;
      }
    }
    return false;
  }

  static isContainNumber(value: string): boolean {
    if (Checking.isEmpty(value)) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      const character = value.charAt(i);
      if (isNaN(Number(character))) {
        continue;
      } else {
        return true;
      }
    }
    return false;
  }

  static isHexColor(value: string): boolean {
    if (Checking.isEmpty(value)) {
      return false;
    }
    if (value.length !== 7 && value.length !== 4) {
      return false;
    }
    if (value.charAt(0) != '#') {
      return false;
    }
    for (let i = 1; i < value.length; i++) {
      const charCode = value.charCodeAt(i);
      if (charCode < 48 && charCode > 57) {
        if (
          (charCode < 65 && charCode > 70) ||
          (charCode < 97 && charCode > 102)
        ) {
          return false;
        }
      }
    }
    return true;
  }
}
