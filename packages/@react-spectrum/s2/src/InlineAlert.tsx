/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import AlertTriangle from './wf-icons/AlertTriangle';
import CheckmarkCircle from './wf-icons/CheckmarkCircle';
import {DOMProps, DOMRef} from '@react-types/shared';
import {filterDOMProps} from '@react-aria/utils';
import {StyleProps, focusRing, getAllowedOverrides} from './style-utils' with {type: 'macro'};
import InfoCircle from './wf-icons/InfoCircle';
import {ReactNode, forwardRef, useEffect, useRef} from 'react';
import {useDOMRef} from '@react-spectrum/utils';
import {style} from '../style-macro/spectrum-theme' with {type: 'macro'};
import {useFocusRing} from 'react-aria';
import {Provider, HeadingContext} from 'react-aria-components';
import {ContentContext} from './Content';
import {IconContext} from './Icon';

export interface SpectrumInlineAlertProps extends DOMProps, StyleProps, InlineStylesProps {
  /**
   * The contents of the Inline Alert.
   */
  children: ReactNode,
  /**
   * Whether to automatically focus the Inline Alert when it first renders.
   */
  autoFocus?: boolean
}

interface InlineStylesProps {
  /**
   * The semantic tone of a Inline Alert.
   * @default neutral
   */
  variant?: 'informative' | 'positive' | 'notice' | 'negative' | 'neutral',
  /**
   * The visual style of the Inline Alert.
   * @default border
   */
  style?: 'border' | 'subtleFill' | 'boldFill'
}

const inlineAlert = style<InlineStylesProps & {isFocusVisible?: boolean}>({
  ...focusRing(),
  display: 'inline-block',
  position: 'relative',
  boxSizing: 'border-box',
  maxWidth: 320,
  fontSize: 'ui',
  fontFamily: 'sans',
  padding: 24,
  borderRadius: 'lg',
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: {
    style: {
      border: {
        variant: {
          informative: 'informative-800',
          positive: 'positive-700',
          notice: 'notice-700',
          negative: 'negative-800',
          neutral: 'gray-700' // is there a semantic color name for neutral?
        }
      },
      subtleFill: 'transparent',
      boldFill: 'transparent'
    }
  },
  backgroundColor: {
    variant: {
      informative: {
        style: {
          border: 'gray-25',
          subtleFill: 'informative-200',
          boldFill: 'informative'
        }
      },
      positive: {
        style: {
          border: 'gray-25',
          subtleFill: 'positive-200',
          boldFill: 'positive'
        }
      },
      notice: {
        style: {
          border: 'gray-25',
          subtleFill: 'notice-200',
          boldFill: 'notice'
        }
      },
      negative: {
        style: {
          border: 'gray-25',
          subtleFill: 'negative-200',
          boldFill: 'negative'
        }
      },
      neutral: {
        style: {
          border: 'gray-25',
          subtleFill: 'gray-100',
          boldFill: 'neutral-subdued'
        }
      }
    }
  }
}, getAllowedOverrides());

const icon = style<InlineStylesProps>({
  gridArea: 'icon',
  size: 20,
  '--iconPrimary': {
    type: 'fill',
    value: {
      style: {
        border: {
          variant: {
            informative: 'informative',
            positive: 'positive',
            notice: 'notice',
            negative: 'negative',
            neutral: 'neutral'
          }
        },
        subtleFill: {
          variant: {
            informative: 'informative',
            positive: 'positive',
            notice: 'notice',
            negative: 'negative',
            neutral: 'neutral'
          }
        },
        boldFill: {
          default: 'white',
          variant: {
            notice: 'black'
          }
        }
      }
    }
  }
});

const grid = style({
  display: 'grid',
  columnGap: 24,
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto auto',
  width: 'full',
  gridTemplateAreas: [
    'heading icon',
    'content content'
  ],
  color: {
    style: {
      border: 'gray-900',
      subtleFill: 'gray-900',
      boldFill: {
        default: 'white',
        variant: {
          notice: 'black'
        }
      }
    }
  }
});

let ICONS = {
  informative: InfoCircle,
  positive: CheckmarkCircle,
  notice: AlertTriangle,
  negative: AlertTriangle,
  neutral: undefined
};

const heading = style<InlineStylesProps>({
  marginTop: 0,
  color: { // if i remove this, it throws an error that heading isn't a function, yet not calling it a ts error
    style: {
      border: 'gray-900',
      subtleFill: 'gray-900',
      boldFill: {
        default: 'white',
        variant: {
          notice: 'black'
        }
      }
    }
  },
  gridArea: 'heading',
  fontSize: 'ui',
  lineHeight: 'ui'
});

const content = style<InlineStylesProps>({
  gridArea: 'content',
  color: {
    style: {
      border: 'gray-800',
      subtleFill: 'gray-800',
      boldFill: {
        default: 'white',
        variant: {
          notice: 'black'
        }
      }
    }
  },
  fontSize: 'body-sm',
  lineHeight: 'body'
});

function InlineAlert(props: SpectrumInlineAlertProps, ref: DOMRef<HTMLDivElement>) {
  let {
    children,
    variant = 'neutral',
    style: styleFill = 'border',
    autoFocus
  } = props;

  let domRef = useDOMRef(ref);

  let Icon = null;
  let iconAlt = '';
  if (variant in ICONS) {
    Icon = ICONS[variant];
    iconAlt = variant;
  }

  let {isFocusVisible, focusProps} = useFocusRing({autoFocus: props.autoFocus});
  let autoFocusRef = useRef(props.autoFocus);
  useEffect(() => {
    if (autoFocusRef.current && domRef.current) {
      domRef.current.focus();
    }
    autoFocusRef.current = false;
  }, [domRef]);

  return (
    <div
      {...filterDOMProps(props)}
      {...focusProps}
      ref={domRef}
      tabIndex={autoFocus ? -1 : undefined}
      autoFocus={autoFocus}
      role="alert"
      style={props.UNSAFE_style}
      className={(props.UNSAFE_className || '') + inlineAlert({
        variant,
        style: styleFill,
        isFocusVisible
      }, props.css)}>
      <div
        className={grid(props)}>
        <Provider
          values={[
            [HeadingContext, {className: heading({variant, style: styleFill})}],
            [ContentContext, {className: content({variant, style: styleFill})}],
            [IconContext, {css: icon({variant, style: styleFill})}]
          ]}>
          {Icon && <Icon aria-label={iconAlt} />}
          {children}
        </Provider>
      </div>
    </div>
  );
}

/**
 * Inline alerts display a non-modal message associated with objects in a view.
 * These are often used in form validation, providing a place to aggregate feedback related to multiple fields.
 */
const _InlineAlert = /*#__PURE__*/ forwardRef(InlineAlert);
export {_InlineAlert as InlineAlert};
