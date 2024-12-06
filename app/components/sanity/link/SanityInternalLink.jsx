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
      case 'job':
        return `${locale.pathPrefix}/pages/job`;
      case 'locations':
        return `${locale.pathPrefix}/pages/locations`;
      case 'catering':
        return `${locale.pathPrefix}/pages/catering`;
      case 'ourStory':
        return `${locale.pathPrefix}/pages/our-story`;
      case 'ourCurrywurst':
        return `${locale.pathPrefix}/pages/our-currywurst`;
      case 'home':
        return `${locale.pathPrefix}/`;
      case 'policiesInnerPage':
        return `${locale.pathPrefix}/policies/${slug}`;
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
