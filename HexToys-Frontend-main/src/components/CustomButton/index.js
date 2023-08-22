import React from 'react';

import { Button } from './style';

const CustomButton = (props) => {

  const { children, size, height, width, margin, ...others } = props;

  return (
    <Button size={size} height={height} width={width} margin={margin} {...others}>
      {children}
    </Button>
  )
}

export default CustomButton
