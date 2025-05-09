import { DefaultNamingStrategy } from 'typeorm';

export class SnakeNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string): string {
    return (
      userSpecifiedName ||
      targetName
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')
    );
  }

  columnName(propertyName: string, customName: string): string {
    return (
      customName ||
      propertyName
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')
    );
  }
}
