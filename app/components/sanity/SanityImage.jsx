import {getExtension, getImageDimensions} from '@sanity/asset-utils';
import imageUrlBuilder from '@sanity/image-url';
import React from 'react';

import {useIsDev} from '../../hooks/useIsDev';
import {cn} from '../../lib/utils';
import {useRootLoaderData} from '../../root';

/**
 * Sanity’s Image component is a wrapper around the HTML image element.
 * It supports the same props as the HTML `img` element, but automatically
 * generates the srcSet and sizes attributes for you. For most use cases,
 * you’ll want to set the `aspectRatio` prop to ensure the image is sized
 * correctly.
 */
const SanityImage = React.forwardRef(
  (
    {
      aspectRatio,
      className,
      data,
      decoding = 'async',
      loading = 'lazy',
      lqip = true,
      showBorder = true,
      showShadow = true,
      sizes,
      style,
      ...passthroughProps
    },
    ref,
  ) => {
    const {env} = useRootLoaderData();
    const isDev = useIsDev();

    if (!data || !data.asset || !env) {
      return null;
    }

    const config = {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    };
    const _ref = data.asset._ref;
    const {height, width} = getImageDimensions(_ref);
    const extension = getExtension(_ref);
    const aspectRatioValues = aspectRatio?.split('/');

    if (aspectRatio && aspectRatioValues?.length !== 2 && isDev) {
      console.warn(
        `Invalid aspect ratio: ${aspectRatio}. Using the original aspect ratio. The aspect ratio should be in the format "width/height".`,
      );
    }

    const aspectRatioWidth = aspectRatioValues
      ? parseFloat(aspectRatioValues[0])
      : undefined;
    const aspectRatioHeight = aspectRatioValues
      ? parseFloat(aspectRatioValues[1])
      : undefined;

    const urlBuilder = imageUrlBuilder({
      dataset: config.dataset,
      projectId: config.projectId,
    })
      .image({
        _ref,
        crop: data.crop,
        hotspot: data.hotspot,
      })
      .auto('format');

    const srcSetValues = [
      50, 100, 200, 450, 600, 750, 900, 1000, 1250, 1500, 1750, 2000, 2500,
      3000, 3500, 4000, 5000,
    ];

    const urlDefault = generateImageUrl({
      aspectRatioHeight,
      aspectRatioWidth,
      urlBuilder,
      width,
    });

    if (isDev && !sizes) {
      console.warn(
        [
          'No sizes prop provided to SanityImage component,',
          'you may be loading unnecessarily large images.',
          `Image used is ${urlDefault || _ref || 'unknown'}`,
        ].join(' '),
      );
    }

    const srcSet = srcSetValues
      .filter((value) => value < width)
      .map((value) => {
        const imageUrl = generateImageUrl({
          aspectRatioHeight,
          aspectRatioWidth,
          urlBuilder,
          width: value,
        });
        if (width >= value) {
          return `${imageUrl} ${value}w`;
        }
        return '';
      })
      .join(', ')
      .concat(`, ${urlDefault} ${width}w`);

    const blurDataUrl = generateImageUrl({
      aspectRatioHeight,
      aspectRatioWidth,
      blur: 10,
      urlBuilder,
      width: 30,
    });

    if (extension === 'svg' || extension === 'png') {
      lqip = false;
    }

    const LQIP = lqip && {
      backgroundImage: `url(${blurDataUrl})`,
      backgroundPositionX: `var(--focalX)`,
      backgroundPositionY: `var(--focalY)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    };

    const focalCoords = data.hotspot?.x &&
      data.hotspot?.y && {
        x: Math.ceil(data.hotspot.x * 100),
        y: Math.ceil(data.hotspot.y * 100),
      };

    const focalProperties = focalCoords && {
      '--focalX': focalCoords?.x + '%',
      '--focalY': focalCoords?.y + '%',
      objectPosition: `var(--focalX) var(--focalY)`,
    };

    return (
      <img
        alt={data.alt || ''}
        className={cn(
          showBorder &&
            'rounded-[--media-border-corner-radius] border-[rgb(var(--border)_/_var(--media-border-opacity))] [border-width:--media-border-thickness]',
          showShadow &&
            '[box-shadow:rgb(var(--shadow)_/_var(--media-shadow-opacity))_var(--media-shadow-horizontal-offset)_var(--media-shadow-vertical-offset)_var(--media-shadow-blur-radius)_0px]',
          className,
        )}
        decoding={decoding}
        height={aspectRatioHeight ? aspectRatioHeight * 100 : height}
        loading={loading}
        ref={ref}
        sizes={sizes}
        src={urlDefault}
        srcSet={srcSet}
        style={{
          ...style,
          ...focalProperties,
          ...LQIP,
          aspectRatio: `${aspectRatioWidth || width}/${
            aspectRatioHeight || height
          }`,
          width: '100%',
        }}
        width={aspectRatioWidth ? aspectRatioWidth * 100 : width}
        {...passthroughProps}
      />
    );
  },
);

SanityImage.displayName = 'SanityImage';

export {SanityImage};

function generateImageUrl({
  aspectRatioHeight,
  aspectRatioWidth,
  blur = 0,
  urlBuilder,
  width,
}) {
  let imageUrl = urlBuilder.width(width);
  const imageHeight =
    aspectRatioHeight && aspectRatioWidth
      ? Math.round((width / aspectRatioWidth) * aspectRatioHeight)
      : undefined;

  if (imageHeight) {
    imageUrl = imageUrl.height(imageHeight);
  }

  if (blur && blur > 0) {
    imageUrl = imageUrl.blur(blur);
  }

  return imageUrl.url();
}

export function generateSanityImageUrl({
  crop,
  dataset,
  height,
  projectId,
  ref,
  width,
}) {
  if (!ref) return null;
  const urlBuilder = imageUrlBuilder({
    dataset,
    projectId,
  })
    .image({
      _ref: ref,
    })
    .auto('format')
    .width(width);

  let imageUrl = urlBuilder.url();

  if (height) {
    imageUrl = urlBuilder.height(height).url();
  }

  if (crop) {
    imageUrl = urlBuilder.crop(crop).url();
  }

  return imageUrl;
}
