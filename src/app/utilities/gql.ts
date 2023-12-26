export function gql(strings: TemplateStringsArray, ...values: Array<any>): string {
  return String.raw({ raw: strings }, ...values);
}
