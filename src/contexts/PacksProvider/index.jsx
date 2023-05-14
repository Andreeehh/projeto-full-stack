import P from 'prop-types';
import { useReducer } from 'react';
import { PacksContext } from './context';
import { reducer } from './reducer';
import { data } from './data';

export const PacksProvider = ({ children }) => {
  const [packsState, packsDispatch] = useReducer(reducer, data);

  return <PacksContext.Provider value={{ packsState, packsDispatch }}>{children}</PacksContext.Provider>;
};

PacksProvider.propTypes = {
  children: P.node.isRequired,
};
