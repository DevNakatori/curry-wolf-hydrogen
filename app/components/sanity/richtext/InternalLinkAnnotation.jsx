import {SanityInternalLink} from '../link/SanityInternalLink';

export function InternalLinkAnnotation(props) {
  return (
    <SanityInternalLink
      data={{
        _key: props._key,
        _type: 'internalLink',
        anchor: props.anchor,
        link: props.link,
        name: null,
      }}
    >
      {props.children}
    </SanityInternalLink>
  );
}
