declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  import { PropsWithChildren } from 'react';

  type LinkProps = PropsWithChildren<NextLinkProps>;

  export default function Link(props: LinkProps): JSX.Element;
} 