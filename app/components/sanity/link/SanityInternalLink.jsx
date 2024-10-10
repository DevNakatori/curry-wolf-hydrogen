import {Link} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';

import {useRootLoaderData as LoaderData} from '~/root';

export function SanityInternalLink(props) {
  const {locale} = LoaderData();
  const {children, data} = props;

  if (!data) return null;

  const {link, name} = data;

  const documentType = link?.documentType;
  const slug = link?.slug;
  const anchor = data.anchor ? `#${data.anchor}` : '';

  const path = () => {
    switch (documentType) {
      case 'page':
        return `${locale.pathPrefix}/pages/${slug}`;
      case 'locations':
        return `${locale.pathPrefix}/pages/${slug}`;
      case 'catering':
        return `${locale.pathPrefix}/pages/${slug}`;
      case 'ourStory':
        return `${locale.pathPrefix}/pages/${slug}`;
      case 'ourCurrywurst':
        return `${locale.pathPrefix}/pages/${slug}`;
      case 'product':
        return `${locale.pathPrefix}/products/${slug}`;
      case 'collection':
        return `${locale.pathPrefix}/collections/${slug}`;
      case 'home':
        return locale.pathPrefix || '/';
      case 'polices':
        return `${locale.pathPrefix}/polices/${slug}`;
      default:
        return '';
    }
  };

  // Remove encode stega data from url
  const url = stegaClean(`${path()}${anchor}`);

  // Todo: add Navlink support
  return (
    <Link onClick={props.onClick} prefetch="intent" to={url}>
      {children ? children : name}
    </Link>
  );
}
