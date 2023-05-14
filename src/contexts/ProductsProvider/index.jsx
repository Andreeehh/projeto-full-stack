import P from 'prop-types';
import { useReducer } from 'react';
import { ProductsContext } from './context';
import { reducer } from './reducer';
import { data } from './data';

export const ProductsProvider = ({ children }) => {
  const [productsState, productsDispatch] = useReducer(reducer, data);

  return <ProductsContext.Provider value={{ productsState, productsDispatch }}>{children}</ProductsContext.Provider>;
};

ProductsProvider.propTypes = {
  children: P.node.isRequired,
};
