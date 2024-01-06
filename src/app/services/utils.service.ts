export class UtilsService {
  static dataConvertida(date: string): string {
      return date ? new Date(date).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }) : '';
  }
}
