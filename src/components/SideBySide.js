import React, { Children, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './SideBySide.module.scss';
import splitUsing from '../utils/splitUsing';
import splitWhen from '../utils/splitWhen';
import { isMdxType } from '../utils/mdx';

const SideBySide = ({ className, children, type }) => {
  const types = Array.isArray(type) ? type : [type];
  const childObjects = Children.toArray(children);

  const isGatsbyMdxType = (child, type) => {
    if (
      type === 'img' &&
      isMdxType(child, 'span') &&
      Array.isArray(child.props.children)
    ) {
      return (
        child.props.children.filter((child) => isMdxType(child, 'img')).length >
        0
      );
    }
    return isMdxType(child, type);
  };
  const rendersRightColumn = childObjects.some((child) =>
    types.some((type) => isGatsbyMdxType(child, type))
  );
  const sections = splitUsing(childObjects, (child) =>
    types.some((type) => isGatsbyMdxType(child, type))
  ).map((section) =>
    splitWhen(section, (child) =>
      types.some((type) => isGatsbyMdxType(child, type))
    )
  );

  return (
    <div className={cx(className, styles.container)}>
      {sections.map(([left, right], idx) => (
        <Fragment key={idx}>
          <div className={cx({ [styles.spanColumns]: !rendersRightColumn })}>
            {left}
          </div>
          {rendersRightColumn && <div>{right}</div>}
        </Fragment>
      ))}
    </div>
  );
};

SideBySide.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  className: PropTypes.string,
};

export default SideBySide;
