import React from 'react';
import {vercelStegaSplit} from '@vercel/stega';

export default function CleanString({value}) {
  if (!value) return null;

  const {cleaned, encoded} = vercelStegaSplit(value);

  return encoded ? (
    <>
      {cleaned}
      <span aria-hidden className="hidden">
        {encoded}
      </span>
    </>
  ) : (
    cleaned
  );
}
