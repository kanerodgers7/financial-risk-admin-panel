import React from 'react';
import './IconButton.scss';
import PropTypes from 'prop-types';

const IconButton = props => {
  const { title, buttonType, iconColor, className, ...restProps } = props;
  const buttonClass = `button ${buttonType}-button icon-button ${className}`;
  // const style = `{{borderColor: "${border}"}}`

  return (
    <button type="button" className={buttonClass} {...restProps}>
      <span className="material-icons-round"> {title} </span>
    </button>
  );
};

IconButton.propTypes = {
  title: PropTypes.string.isRequired,
  buttonType: PropTypes.oneOf([
    'primary',
    'secondary',
    'outlined-bg',
    'outlined-primary',
    'outlined-secondary',
  ]).isRequired,
  className: PropTypes.string,
  iconColor: PropTypes.string,
};

IconButton.defaultProps = {
  className: '',
  iconColor: '',
};

export default IconButton;