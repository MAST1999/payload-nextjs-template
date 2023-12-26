interface Args {
  disableLabel?: true;
  disableAppearance?: true;
}
const gql = (strings: TemplateStringsArray, ...values: Array<any>) =>
  String.raw({ raw: strings }, ...values);

export const LINK_FIELDS = ({ disableAppearance, disableLabel }: Args = {}): string => gql`{
  ${!disableLabel ? "label" : ""}
  ${!disableAppearance ? "appearance" : ""}
  type
  newTab
  url
  reference {
    relationTo
    value {
      ...on Page {
        slug
      }
    }
  }
}`;
