'use client';

import React from 'react';

export function HydrationFix(): React.JSX.Element {
  return (
    <script
      id="hydration-fix"
      dangerouslySetInnerHTML={{
        __html: `
          if (document.body.hasAttribute('inject_vt_svd')) {
            document.body.removeAttribute('inject_vt_svd');
          }
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (
                mutation.type === 'attributes' &&
                mutation.attributeName === 'inject_vt_svd'
              ) {
                document.body.removeAttribute('inject_vt_svd');
              }
            });
          });
          observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['inject_vt_svd']
          });
        `,
      }}
    />
  );
}