import React, { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const LinkBehavior = forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

export default LinkBehavior;
